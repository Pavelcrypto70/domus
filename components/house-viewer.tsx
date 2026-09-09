"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Component, type ReactNode, useEffect, useState } from "react";
import { Moon, RotateCcw, Sun } from "lucide-react";

import { HouseModel } from "@/components/house-model";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CAMERA_POS: [number, number, number] = [13.5, 7.4, 13.2];
const TARGET: [number, number, number] = [2.1, 0.7, 2.0];

function Scene({ night, resetToken }: { night: boolean; resetToken: number }) {
  return (
    <>
      <color attach="background" args={[night ? "#0a1220" : "#d5e1ea"]} />
      <fog attach="fog" args={[night ? "#0a1220" : "#d5e1ea", 28, 70]} />
      {night ? (
        <>
          <ambientLight intensity={0.22} />
          <hemisphereLight args={["#243656", "#121214", 0.45]} />
          <directionalLight position={[8, 12, 5]} intensity={0.45} color="#c5d6ea" />
          <pointLight
            position={[4.5, 0.4, 4.2]}
            intensity={5.5}
            distance={11}
            color="#ffc878"
          />
        </>
      ) : (
        <>
          <ambientLight intensity={0.55} />
          <hemisphereLight args={["#dbe7f2", "#8c867c", 0.85]} />
          <directionalLight position={[10, 16, 7]} intensity={1.6} color="#fff3dc" />
          <directionalLight position={[-8, 6, -6]} intensity={0.3} color="#c9d6e4" />
        </>
      )}
      <HouseModel night={night} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.025, 2]} receiveShadow={false}>
        <circleGeometry args={[14, 40]} />
        <meshBasicMaterial color="#000000" transparent opacity={night ? 0.28 : 0.12} />
      </mesh>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        target={TARGET}
        minPolarAngle={0.28}
        maxPolarAngle={Math.PI / 2.08}
        minDistance={8}
        maxDistance={34}
        autoRotate
        autoRotateSpeed={0.35}
      />
      <CameraReset token={resetToken} />
    </>
  );
}

function CameraReset({ token }: { token: number }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);

  useEffect(() => {
    if (token === 0) return;
    camera.position.set(...CAMERA_POS);
    const orbit = controls as unknown as { target?: { set: (...args: number[]) => void }; update?: () => void } | null;
    orbit?.target?.set(...TARGET);
    orbit?.update?.();
    camera.updateProjectionMatrix();
  }, [token, camera, controls]);

  return null;
}

class ViewerErrorBoundary extends Component<
  { children: ReactNode },
  { message: string | null }
> {
  state = { message: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { message: error.message };
  }

  render() {
    if (this.state.message) {
      return (
        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/70">
          Не удалось открыть 3D-сцену: {this.state.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export function HouseViewer() {
  const [night, setNight] = useState(true);
  const [resetToken, setResetToken] = useState(0);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1220]">
      <div className="h-[min(72vh,760px)] w-full" style={{ background: night ? "#0a1220" : "#d5e1ea" }}>
        <ViewerErrorBoundary>
          <Canvas
            dpr={1}
            camera={{ position: CAMERA_POS, fov: 38, near: 0.1, far: 90 }}
            gl={{
              antialias: false,
              alpha: false,
              powerPreference: "default",
              failIfMajorPerformanceCaveat: false,
              preserveDrawingBuffer: true,
              stencil: false,
              depth: true,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(night ? "#0a1220" : "#d5e1ea", 1);
              gl.domElement.addEventListener(
                "webglcontextlost",
                (event) => event.preventDefault(),
                false
              );
            }}
            style={{ background: night ? "#0a1220" : "#d5e1ea" }}
          >
            <Scene night={night} resetToken={resetToken} />
          </Canvas>
        </ViewerErrorBoundary>
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
            onClick={() => setResetToken((n) => n + 1)}
            aria-label="Сбросить камеру"
          >
            <RotateCcw />
          </Button>
        </div>
      </div>
    </div>
  );
}
