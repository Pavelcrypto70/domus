"use client";

import dynamic from "next/dynamic";

const HouseViewer = dynamic(
  () => import("@/components/house-viewer").then((mod) => mod.HouseViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(72vh,760px)] items-center justify-center rounded-2xl border border-white/10 bg-[#0a1220] text-sm text-white/60">
        Собираем 3D-модель…
      </div>
    ),
  }
);

export function HouseViewerSection() {
  return <HouseViewer />;
}
