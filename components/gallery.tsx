"use client";

import { useState } from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RENDERS, SKETCH, type RenderItem } from "@/lib/renders";

export function Gallery() {
  const [active, setActive] = useState<RenderItem | null>(null);
  const items = [...RENDERS, SKETCH];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setActive(item)}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:border-wood/50"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition duration-500 group-hover:scale-[1.03] ${
                  item.isSketch ? "bg-zinc-200 object-contain p-4" : ""
                }`}
              />
            </div>
            <div className="space-y-1 p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg text-white">{item.title}</h3>
                {item.isSketch ? (
                  <Badge variant="outline">эскиз</Badge>
                ) : null}
              </div>
              <p className="text-sm text-white/60">{item.caption}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent
          className="max-h-[92vh] overflow-auto bg-zinc-950 p-0 sm:max-w-[min(96vw,1100px)]"
          showCloseButton
        >
          {active ? (
            <>
              <div className="relative aspect-video w-full bg-black">
                <Image
                  src={active.src}
                  alt={active.title}
                  fill
                  sizes="96vw"
                  className={
                    active.isSketch
                      ? "object-contain bg-zinc-200 p-6"
                      : "object-contain"
                  }
                />
              </div>
              <DialogHeader className="p-4 sm:p-5">
                <DialogTitle className="font-heading text-xl">
                  {active.title}
                </DialogTitle>
                <DialogDescription>{active.caption}</DialogDescription>
              </DialogHeader>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
