"use client";

import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";

const WALL_H = 3.18;
const FASCIA = 0.44;
const THICK = 0.28;

const LONG = { x0: -7.4, x1: 0, z0: -4.15, z1: 12.5 };
const SHORT = { x0: -7.4, x1: 11.7, z0: -7.4, z1: 0 };
const TERRACE = { x0: 0.18, x1: 9.35, z0: 0.18, z1: 8.7, h: 0.1 };

function mid(a: number, b: number) {
  return (a + b) / 2;
}

function span(a: number, b: number) {
  return b - a;
}

function useMaps() {
  const maps = useMemo(() => {
    const concrete = noiseTexture("#d4cdc3", "#9a948c", 900, false);
    concrete.repeat.set(3, 2);
    const graphite = noiseTexture("#2c3035", "#121416", 500, false);
    graphite.repeat.set(2, 1);
    const wood = noiseTexture("#c08a54", "#6e4324", 80, true);
    wood.repeat.set(1, 4);
    return { concrete, graphite, wood };
  }, []);

  useLayoutEffect(() => {
    return () => {
      maps.concrete.dispose();
      maps.graphite.dispose();
      maps.wood.dispose();
    };
  }, [maps]);

  return maps;
}

function noiseTexture(
  base: string,
  speckle: string,
  count: number,
  grain: boolean
) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  if (grain) {
    for (let y = 0; y < size; y += 3) {
      ctx.fillStyle = `rgba(70, 35, 12, ${0.05 + (y % 13) * 0.01})`;
      ctx.fillRect(0, y, size, 2);
    }
  }
  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = 0.06 + Math.random() * 0.14;
    ctx.fillStyle = speckle;
    ctx.fillRect(
      Math.random() * size,
      Math.random() * size,
      1 + Math.random() * 2.5,
      1 + Math.random() * (grain ? 6 : 2)
    );
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function Box({
  position,
  size,
  color,
  map,
  roughness = 0.72,
  metalness = 0.04,
  emissive,
  emissiveIntensity = 0,
  receiveShadow = true,
  castShadow = true,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  map?: THREE.Texture;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  receiveShadow?: boolean;
  castShadow?: boolean;
}) {
  return (
    <mesh
      position={position}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        map={map}
        roughness={roughness}
        metalness={metalness}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

function WoodSlats({
  start,
  length,
  height,
  axis,
  y,
  face,
}: {
  start: [number, number];
  length: number;
  height: number;
  axis: "x" | "z";
  y: number;
  face: number;
}) {
  const slat = 0.11;
  const gap = 0.018;
  const n = Math.max(1, Math.floor(length / (slat + gap)));
  const items = [];
  for (let i = 0; i < n; i++) {
    const offset = i * (slat + gap) + slat / 2;
    const tone = i % 4 === 0 ? "#a87442" : i % 3 === 0 ? "#c99660" : "#b7844e";
    const pos: [number, number, number] =
      axis === "x"
        ? [start[0] + offset, y, start[1] + face]
        : [start[0] + face, y, start[1] + offset];
    const size: [number, number, number] =
      axis === "x" ? [slat, height, 0.055] : [0.055, height, slat];
    items.push(
      <mesh key={i} position={pos} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={tone} roughness={0.68} metalness={0.02} />
      </mesh>
    );
  }
  return <group>{items}</group>;
}

function GlassWall({
  position,
  size,
  night,
}: {
  position: [number, number, number];
  size: [number, number, number];
  night: boolean;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={night ? "#d5eaf5" : "#8aa8b8"}
        metalness={0.18}
        roughness={0.08}
        transparent
        opacity={night ? 0.32 : 0.42}
      />
    </mesh>
  );
}

function Mullions({
  axis,
  from,
  to,
  at,
  y,
  h,
}: {
  axis: "x" | "z";
  from: number;
  to: number;
  at: number;
  y: number;
  h: number;
}) {
  const step = 2.15;
  const nodes = [];
  for (let t = from + step; t < to - 0.4; t += step) {
    nodes.push(
      <Box
        key={t}
        position={axis === "x" ? [t, y, at] : [at, y, t]}
        size={axis === "x" ? [0.08, h, 0.12] : [0.12, h, 0.08]}
        color="#24272b"
        roughness={0.35}
        metalness={0.45}
      />
    );
  }
  return <group>{nodes}</group>;
}

function SlitWindow({
  position,
  size,
  night,
}: {
  position: [number, number, number];
  size: [number, number, number];
  night: boolean;
}) {
  return (
    <group>
      <Box
        position={position}
        size={[size[0] + 0.08, size[1] + 0.08, size[2] + 0.08]}
        color="#1e2124"
        roughness={0.35}
        metalness={0.4}
      />
      <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#8fb4c8"
          emissive={night ? "#ffd7a1" : "#1a3040"}
          emissiveIntensity={night ? 1.6 : 0.08}
          roughness={0.12}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.16, 1.4, 8]} />
        <meshStandardMaterial color="#4a3426" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.95, 14, 10]} />
        <meshStandardMaterial color="#3a5340" roughness={0.85} />
      </mesh>
      <mesh position={[0.35, 1.7, 0.15]} castShadow>
        <sphereGeometry args={[0.55, 12, 10]} />
        <meshStandardMaterial color="#4a6550" roughness={0.85} />
      </mesh>
    </group>
  );
}

function GrassClump({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={i}
          position={[(i - 3) * 0.08, 0.28, (i % 3) * 0.05]}
          rotation={[0.1, i, 0.15]}
          castShadow
        >
          <coneGeometry args={[0.05, 0.55 + (i % 3) * 0.1, 5]} />
          <meshStandardMaterial color={i % 2 ? "#6a7d4e" : "#556844"} />
        </mesh>
      ))}
    </group>
  );
}

export function HouseModel({ night }: { night: boolean }) {
  const maps = useMaps();
  const led = night ? 6.2 : 0.85;
  const interior = night ? 2.8 : 0.2;

  const longW = span(LONG.x0, LONG.x1);
  const longD = span(LONG.z0, LONG.z1);
  const shortW = span(SHORT.x0, SHORT.x1);
  const shortD = span(SHORT.z0, SHORT.z1);

  return (
    <group>
      <Box
        position={[0, -0.04, 2]}
        size={[48, 0.08, 48]}
        color={night ? "#1c241c" : "#5d6b4e"}
        roughness={0.95}
        receiveShadow
        castShadow={false}
      />

      <Box
        position={[mid(TERRACE.x0, TERRACE.x1), TERRACE.h / 2, mid(TERRACE.z0, TERRACE.z1)]}
        size={[
          span(TERRACE.x0, TERRACE.x1),
          TERRACE.h,
          span(TERRACE.z0, TERRACE.z1),
        ]}
        color="#d9d3cb"
        map={maps.concrete}
        roughness={0.55}
      />

      <Box
        position={[
          mid(TERRACE.x0, TERRACE.x1),
          0.02,
          mid(TERRACE.z0, TERRACE.z1),
        ]}
        size={[
          span(TERRACE.x0, TERRACE.x1) + 0.7,
          0.04,
          span(TERRACE.z0, TERRACE.z1) + 0.7,
        ]}
        color={night ? "#3a3a38" : "#b7b1a7"}
        roughness={0.9}
        castShadow={false}
      />

      {/* Perimeter LED */}
      <Box
        position={[mid(TERRACE.x0, TERRACE.x1), TERRACE.h + 0.015, TERRACE.z0]}
        size={[span(TERRACE.x0, TERRACE.x1) + 0.06, 0.03, 0.06]}
        color="#fff6e4"
        emissive="#ffcc80"
        emissiveIntensity={led}
        roughness={0.2}
        castShadow={false}
      />
      <Box
        position={[mid(TERRACE.x0, TERRACE.x1), TERRACE.h + 0.015, TERRACE.z1]}
        size={[span(TERRACE.x0, TERRACE.x1) + 0.06, 0.03, 0.06]}
        color="#fff6e4"
        emissive="#ffcc80"
        emissiveIntensity={led}
        roughness={0.2}
        castShadow={false}
      />
      <Box
        position={[TERRACE.x0, TERRACE.h + 0.015, mid(TERRACE.z0, TERRACE.z1)]}
        size={[0.06, 0.03, span(TERRACE.z0, TERRACE.z1)]}
        color="#fff6e4"
        emissive="#ffcc80"
        emissiveIntensity={led}
        roughness={0.2}
        castShadow={false}
      />
      <Box
        position={[TERRACE.x1, TERRACE.h + 0.015, mid(TERRACE.z0, TERRACE.z1)]}
        size={[0.06, 0.03, span(TERRACE.z0, TERRACE.z1)]}
        color="#fff6e4"
        emissive="#ffcc80"
        emissiveIntensity={led}
        roughness={0.2}
        castShadow={false}
      />

      {night && (
        <>
          <pointLight
            position={[mid(TERRACE.x0, TERRACE.x1), 0.35, TERRACE.z0]}
            intensity={3.2}
            distance={7}
            color="#ffc878"
          />
          <pointLight
            position={[TERRACE.x1, 0.35, mid(TERRACE.z0, TERRACE.z1)]}
            intensity={2.6}
            distance={7}
            color="#ffc878"
          />
          <pointLight
            position={[2.4, 1.4, 2.2]}
            intensity={8}
            distance={10}
            color="#ffd6a0"
          />
        </>
      )}

      {/* Floors */}
      <Box
        position={[mid(LONG.x0, LONG.x1), 0.06, mid(LONG.z0, LONG.z1)]}
        size={[longW, 0.12, longD]}
        color="#cfc8be"
        map={maps.concrete}
      />
      <Box
        position={[mid(SHORT.x0, SHORT.x1), 0.06, mid(SHORT.z0, SHORT.z1)]}
        size={[shortW, 0.12, shortD]}
        color="#cfc8be"
        map={maps.concrete}
      />

      {/* Outer concrete walls */}
      <Box
        position={[LONG.x0 + THICK / 2, WALL_H / 2, mid(LONG.z0, LONG.z1)]}
        size={[THICK, WALL_H, longD]}
        color="#d5cec5"
        map={maps.concrete}
      />
      <Box
        position={[mid(LONG.x0, LONG.x1), WALL_H / 2, LONG.z1 - THICK / 2]}
        size={[longW, WALL_H, THICK]}
        color="#d5cec5"
        map={maps.concrete}
      />
      <Box
        position={[mid(SHORT.x0, SHORT.x1), WALL_H / 2, SHORT.z0 + THICK / 2]}
        size={[shortW, WALL_H, THICK]}
        color="#d5cec5"
        map={maps.concrete}
      />
      <Box
        position={[SHORT.x1 - THICK / 2, WALL_H / 2, mid(SHORT.z0, SHORT.z1)]}
        size={[THICK, WALL_H, shortD]}
        color="#d5cec5"
        map={maps.concrete}
      />

      {/* Graphite end panels */}
      <Box
        position={[LONG.x0 + 0.2, WALL_H / 2, LONG.z1 - 1.1]}
        size={[0.12, WALL_H - 0.2, 1.6]}
        color="#2a2e32"
        map={maps.graphite}
        roughness={0.4}
        metalness={0.25}
      />
      <Box
        position={[SHORT.x1 - 1.1, WALL_H / 2, SHORT.z0 + 0.2]}
        size={[1.6, WALL_H - 0.2, 0.12]}
        color="#2a2e32"
        map={maps.graphite}
        roughness={0.4}
        metalness={0.25}
      />

      <SlitWindow
        night={night}
        position={[LONG.x0 + 0.12, 1.55, LONG.z1 - 2.6]}
        size={[0.08, 2.15, 0.38]}
      />
      <SlitWindow
        night={night}
        position={[LONG.x0 + 0.12, 1.55, LONG.z0 + 2.4]}
        size={[0.08, 2.15, 0.38]}
      />
      <SlitWindow
        night={night}
        position={[SHORT.x1 - 2.5, 1.55, SHORT.z0 + 0.12]}
        size={[0.38, 2.15, 0.08]}
      />
      <SlitWindow
        night={night}
        position={[SHORT.x0 + 2.2, 1.55, SHORT.z0 + 0.12]}
        size={[0.38, 2.15, 0.08]}
      />

      {/* Inner glass facades */}
      <GlassWall
        night={night}
        position={[0.04, 1.55, 6.2]}
        size={[0.06, 2.85, 10.4]}
      />
      <GlassWall
        night={night}
        position={[6.0, 1.55, 0.04]}
        size={[10.2, 2.85, 0.06]}
      />
      <Mullions axis="z" from={1.1} to={12.1} at={0.08} y={1.55} h={2.9} />
      <Mullions axis="x" from={1.1} to={11.2} at={0.08} y={1.55} h={2.9} />

      {/* Interior glow behind glass */}
      <Box
        position={[-0.55, 1.5, 6.2]}
        size={[0.04, 2.4, 9.6]}
        color="#ffe3b5"
        emissive="#ffc078"
        emissiveIntensity={interior}
        castShadow={false}
        receiveShadow={false}
      />
      <Box
        position={[6.0, 1.5, -0.55]}
        size={[9.4, 2.4, 0.04]}
        color="#ffe3b5"
        emissive="#ffc078"
        emissiveIntensity={interior}
        castShadow={false}
        receiveShadow={false}
      />

      {/* Recessed wood porch */}
      <WoodSlats
        start={[0.08, 0.08]}
        length={2.7}
        height={2.7}
        axis="z"
        y={1.45}
        face={0.05}
      />
      <WoodSlats
        start={[0.08, 0.08]}
        length={2.7}
        height={2.7}
        axis="x"
        y={1.45}
        face={0.05}
      />
      <Box
        position={[1.45, WALL_H - 0.06, 1.45]}
        size={[2.9, 0.08, 2.9]}
        color="#b7844e"
        map={maps.wood}
        roughness={0.6}
      />

      {/* Roofs + graphite fascia */}
      <Box
        position={[
          mid(LONG.x0, LONG.x1),
          WALL_H + FASCIA / 2,
          mid(LONG.z0, LONG.z1),
        ]}
        size={[longW + 0.38, FASCIA, longD + 0.38]}
        color="#2a2d31"
        map={maps.graphite}
        roughness={0.38}
        metalness={0.28}
      />
      <Box
        position={[
          mid(SHORT.x0, SHORT.x1),
          WALL_H + FASCIA / 2,
          mid(SHORT.z0, SHORT.z1),
        ]}
        size={[shortW + 0.38, FASCIA, shortD + 0.38]}
        color="#2a2d31"
        map={maps.graphite}
        roughness={0.38}
        metalness={0.28}
      />

      {/* Interior furniture silhouettes */}
      <Box
        position={[-3.1, 0.38, 5.4]}
        size={[2.6, 0.55, 1.05]}
        color="#6a4a36"
        roughness={0.8}
      />
      <Box
        position={[-3.1, 0.22, 4.55]}
        size={[1.4, 0.18, 0.7]}
        color="#d8d0c6"
      />
      <Box
        position={[5.6, 0.4, -3.2]}
        size={[1.1, 0.75, 2.8]}
        color="#3e4348"
        roughness={0.5}
        metalness={0.2}
      />

      <Tree position={[-10.5, 0, 4.5]} />
      <Tree position={[13.5, 0, -3]} />
      <Tree position={[4.2, 0, 13.8]} />
      <GrassClump position={[10.4, 0, 7.2]} />
      <GrassClump position={[8.6, 0, 10.1]} />
      <GrassClump position={[-9.2, 0, -6.4]} />
      <GrassClump position={[1.2, 0, 11.4]} />
    </group>
  );
}
