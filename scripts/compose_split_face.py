#!/usr/bin/env python3
"""Align two frontal portraits and join them on a hard vertical midline.

Left half  = --left  image (viewer's left)
Right half = --right image (viewer's right)

Features are not morphed or averaged: each pixel comes from exactly one source.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python import vision

# MediaPipe Face Mesh indices (image coordinates, person facing camera).
# 33 / 133 sit on the left side of the photo (person's right eye).
L_EYE_OUTER, L_EYE_INNER = 33, 133
R_EYE_INNER, R_EYE_OUTER = 362, 263
NOSE_TIP = 1
NOSE_BRIDGE = 6
FOREHEAD = 10
UPPER_LIP = 13
LOWER_LIP = 14
CHIN = 152
MOUTH_L, MOUTH_R = 61, 291
SUBNASALE = 2


def load_landmarker(model_path: Path) -> vision.FaceLandmarker:
    options = vision.FaceLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=str(model_path)),
        running_mode=vision.RunningMode.IMAGE,
        num_faces=1,
        output_face_blendshapes=False,
        output_facial_transformation_matrixes=False,
    )
    return vision.FaceLandmarker.create_from_options(options)


def landmarks_px(result: vision.FaceLandmarkerResult, w: int, h: int) -> np.ndarray:
    if not result.face_landmarks:
        raise RuntimeError("No face detected")
    lms = result.face_landmarks[0]
    return np.array([[lm.x * w, lm.y * h] for lm in lms], dtype=np.float32)


def detect(landmarker: vision.FaceLandmarker, bgr: np.ndarray) -> np.ndarray:
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    return landmarks_px(landmarker.detect(mp_image), bgr.shape[1], bgr.shape[0])


def midpoint(pts: np.ndarray, *idx: int) -> np.ndarray:
    return pts[list(idx)].mean(axis=0)


def face_frame(pts: np.ndarray) -> dict[str, np.ndarray]:
    left_eye = midpoint(pts, L_EYE_OUTER, L_EYE_INNER)
    right_eye = midpoint(pts, R_EYE_OUTER, R_EYE_INNER)
    mouth = midpoint(pts, UPPER_LIP, LOWER_LIP, MOUTH_L, MOUTH_R)
    # Midline landmarks should sit on the split after alignment.
    midline = np.stack(
        [
            pts[FOREHEAD],
            pts[NOSE_BRIDGE],
            pts[NOSE_TIP],
            pts[SUBNASALE],
            pts[UPPER_LIP],
            pts[LOWER_LIP],
            pts[CHIN],
        ]
    )
    return {
        "left_eye": left_eye,
        "right_eye": right_eye,
        "eyes_mid": (left_eye + right_eye) / 2.0,
        "nose": pts[NOSE_TIP],
        "mouth": mouth,
        "chin": pts[CHIN],
        "forehead": pts[FOREHEAD],
        "midline": midline.mean(axis=0),
        "eye_span": float(np.linalg.norm(right_eye - left_eye)),
        "eye_to_chin": float(np.linalg.norm(pts[CHIN] - (left_eye + right_eye) / 2.0)),
        "eye_angle": float(
            np.degrees(np.arctan2(right_eye[1] - left_eye[1], right_eye[0] - left_eye[0]))
        ),
    }


def similarity_to_canonical(
    frame: dict[str, np.ndarray],
    dst_pts: np.ndarray,
) -> np.ndarray:
    """Map this face onto a shared canonical triangle (eyes + mouth)."""
    src = np.float32(
        [
            frame["left_eye"],
            frame["right_eye"],
            frame["mouth"],
        ]
    )
    return cv2.getAffineTransform(src, dst_pts)


def canonical_dst(
    out_w: int,
    out_h: int,
    left_frame: dict[str, np.ndarray],
    right_frame: dict[str, np.ndarray],
    eye_y_ratio: float = 0.42,
    eye_span_ratio: float = 0.28,
) -> np.ndarray:
    """Same destination for both faces so eyes, nose and lips register."""
    target_eye_span = out_w * eye_span_ratio
    target_eye_y = out_h * eye_y_ratio
    cx = out_w / 2.0
    half = target_eye_span / 2.0

    def eye_to_mouth(frame: dict[str, np.ndarray]) -> float:
        return float(np.linalg.norm(frame["mouth"] - frame["eyes_mid"]))

    ratio = 0.5 * (
        eye_to_mouth(left_frame) / left_frame["eye_span"]
        + eye_to_mouth(right_frame) / right_frame["eye_span"]
    )
    mouth_y = target_eye_y + ratio * target_eye_span
    return np.float32(
        [
            [cx - half, target_eye_y],
            [cx + half, target_eye_y],
            [cx, mouth_y],
        ]
    )


def warp(bgr: np.ndarray, matrix: np.ndarray, size: tuple[int, int]) -> np.ndarray:
    return cv2.warpAffine(
        bgr,
        matrix,
        size,
        flags=cv2.INTER_LANCZOS4,
        borderMode=cv2.BORDER_REPLICATE,
    )


def to_bw(bgr: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)


def match_seam_luma(
    left: np.ndarray, right: np.ndarray, band: int = 28
) -> tuple[np.ndarray, np.ndarray]:
    """Match overall brightness of the two halves using a thin strip beside the seam."""
    h, w = left.shape[:2]
    cx = w // 2
    left_strip = left[:, max(0, cx - band) : cx]
    right_strip = right[:, cx : min(w, cx + band)]
    left_mean = float(cv2.cvtColor(left_strip, cv2.COLOR_BGR2GRAY).mean())
    right_mean = float(cv2.cvtColor(right_strip, cv2.COLOR_BGR2GRAY).mean())
    target = 0.5 * (left_mean + right_mean)
    left_scale = np.clip(target / max(left_mean, 1.0), 0.85, 1.15)
    right_scale = np.clip(target / max(right_mean, 1.0), 0.85, 1.15)
    left_adj = np.clip(left.astype(np.float32) * left_scale, 0, 255).astype(np.uint8)
    right_adj = np.clip(right.astype(np.float32) * right_scale, 0, 255).astype(np.uint8)
    return left_adj, right_adj


def hard_split(left: np.ndarray, right: np.ndarray) -> np.ndarray:
    h, w = left.shape[:2]
    cx = w // 2
    out = np.empty_like(left)
    out[:, :cx] = left[:, :cx]
    out[:, cx:] = right[:, cx:]
    return out


def compose(
    left_bgr: np.ndarray,
    right_bgr: np.ndarray,
    landmarker: vision.FaceLandmarker,
    out_size: tuple[int, int] = (1024, 1536),
) -> tuple[np.ndarray, dict]:
    left_pts = detect(landmarker, left_bgr)
    right_pts = detect(landmarker, right_bgr)
    left_frame = face_frame(left_pts)
    right_frame = face_frame(right_pts)

    out_w, out_h = out_size
    dst = canonical_dst(out_w, out_h, left_frame, right_frame)
    left_m = similarity_to_canonical(left_frame, dst)
    right_m = similarity_to_canonical(right_frame, dst)

    left_aligned = to_bw(warp(left_bgr, left_m, (out_w, out_h)))
    right_aligned = to_bw(warp(right_bgr, right_m, (out_w, out_h)))
    left_adj, right_adj = match_seam_luma(left_aligned, right_aligned)
    collage = hard_split(left_adj, right_adj)

    debug = {
        "left_eye_span": left_frame["eye_span"],
        "right_eye_span": right_frame["eye_span"],
        "left_eye_angle": left_frame["eye_angle"],
        "right_eye_angle": right_frame["eye_angle"],
    }
    return collage, debug


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--left", required=True, help="Portrait for the left half")
    parser.add_argument("--right", required=True, help="Portrait for the right half")
    parser.add_argument("--model", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    left = cv2.imread(args.left, cv2.IMREAD_COLOR)
    right = cv2.imread(args.right, cv2.IMREAD_COLOR)
    if left is None or right is None:
        raise SystemExit("Could not read source portraits")

    landmarker = load_landmarker(Path(args.model))
    collage, debug = compose(left, right, landmarker)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(out_path), collage, [cv2.IMWRITE_PNG_COMPRESSION, 3])
    print(f"Wrote {out_path} {collage.shape[1]}x{collage.shape[0]}")
    print(debug)


if __name__ == "__main__":
    main()
