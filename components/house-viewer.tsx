"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState } from "react";
import { Moon, RotateCcw, Sun } from "lucide-react";

import { HouseModel } from "@/components/house-model";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Scene({ night }: { night: boolean }) {
  return (
    <>
      <color attach="background" args={[night ? "#0a1220" : "#d5e1ea"]} />
      <fog attach="fog" args={[night ? "#0a1220" : "#d5e1ea", 26, 62]} />
      {night ? (
        <>
          <ambientLight intensity={0.12} />
          <hemisphereLight args={["#1a3050", "#0b0c0e", 0.35]} />
          <directionalLight
            position={[8, 12, 5]}
            intensity={0.28}
            color="#b7cce4"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={40}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <Stars radius={60} depth={28} count={700} factor={2.6} fade speed={0.4} />
        </>
      ) : (
        <>
          <ambientLight intensity={0.42} />
          <hemisphereLight args={["#dbe7f2", "#8c867c", 0.7]} />
          <directionalLight
            position={[10, 16, 7]}
            intensity={2.15}
            color="#fff3dc"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-22}
            shadow-camera-right={22}
            shadow-camera-top={22}
            shadow-camera-bottom={-22}
          />
          <directionalLight position={[-8, 6, -6]} intensity={0.35} color="#c9d6e4" />
        </>
      )}
      <HouseModel night={night} />
      <ContactShadows
        position={[0, 0.02, 2]}
        opacity={night ? 0.45 : 0.28}
        scale={42}
        blur={2.2}
        far={10}
      />
      <OrbitControls
        makeDefault
        enableDamping
        target={[2.1, 0.7, 2.0]}
        minPolarAngle={0.28}
        maxPolarAngle={Math.PI / 2.08}
        minDistance={8}
        maxDistance={34}
        autoRotate
        autoRotateSpeed={0.35}
      />
    </>
  );
}

export function HouseViewer() {
  const [night, setNight] = useState(true);
  const [key, setKey] = useState(0);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1220]">
      <div className="h-[min(72vh,760px)] w-full">
        <Canvas
          key={key}
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [13.5, 7.4, 13.2], fov: 38, near: 0.1, far: 80 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <Scene night={night} />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
        <div className="pointer-events-auto space-y-1">
          <Badge variant="secondary" className="bg-black/45 text-white backdrop-blur">
            Интерактивная модель
          </Badge>
          <p className="max-w-xs text-xs text-white/70 sm:text-sm">
            Вращайте сцену мышью. Подсветка террасы лучше видна ночью.
          </p>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <Button
            type="button"
            variant={night ? "default" : "outline"}
            size="sm"
            onClick={() => setNight(true)}
            className={night ? "bg-wood text-black hover:bg-wood/90" : "bg-black/40 text-white"}
          >
            <Moon data-icon="inline-start" />
            Ночь
          </Button>
          <Button
            type="button"
            variant={!night ? "default" : "outline"}
            size="sm"
            onClick={() => setNight(false)}
            className={!night ? "bg-concrete text-graphite hover:bg-concrete/90" : "bg-black/40 text-white"}
          >
            <Sun data-icon="inline-start" />
            День
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="bg-black/40 text-white"
            onClick={() => setKey((k) => k + 1)}
            aria-label="Сбросить камеру"
          >
            <RotateCcw />
          </Button>
        </div>
      </div>
    </div>
  );
}
