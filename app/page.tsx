import { ArrowDown, Lamp, Layers3, Spline } from "lucide-react";

import { Gallery } from "@/components/gallery";
import { HouseViewerSection } from "@/components/house-viewer-section";
import { SiteHeader } from "@/components/site-header";
import { SiteImage } from "@/components/site-image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const MATERIALS = [
  {
    name: "Дерево",
    tone: "bg-[#c59358]",
    text: "Левое крыло: тёплые горизонтальные рейки на всю высоту фасада",
  },
  {
    name: "Графит",
    tone: "bg-[#1a1a1b]",
    text: "Правое крыло: матовые угольные панели, карниз и тонкие рамы",
  },
  {
    name: "Светлый бетон",
    tone: "bg-[#d5cfc6] text-zinc-800",
    text: "Торцевая стена и плита приподнятой террасы",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="flex-1">
        <section className="relative min-h-[88vh] overflow-hidden">
          <SiteImage
            src="/renders/house-dusk-hero.png"
            alt="Современный L-дом на сумерках: дерево, графит, бетон, очаг и LED по периметру террасы"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/40 to-black/15" />
          <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6">
            <Badge className="mb-4 w-fit bg-black/45 text-white backdrop-blur">
              Архитектурная визуализация
            </Badge>
            <h1 className="font-heading max-w-3xl text-4xl leading-tight text-white sm:text-6xl">
              Современный дом:
              <span className="block text-wood">графит, дерево, светлый бетон</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/75 sm:text-lg">
              L-объём на сумерках. Слева горизонтальное дерево, справа графит и
              бетон. Терраса парит за счёт LED по периметру, в центре — очаг.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#gallery"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-wood text-zinc-950 hover:bg-wood/90"
                )}
              >
                Галерея ракурсов
                <ArrowDown data-icon="inline-end" />
              </a>
              <a
                href="#model"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/25 bg-black/30 text-white hover:bg-white/10"
                )}
              >
                Открыть 3D
                <Spline data-icon="inline-end" />
              </a>
            </div>
          </div>
        </section>

        <section id="materials" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-wood">Фасад</p>
              <h2 className="font-heading mt-1 text-3xl text-white sm:text-4xl">
                Три материала
              </h2>
            </div>
            <Layers3 className="hidden size-8 text-white/30 sm:block" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {MATERIALS.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className={`h-28 ${item.tone}`} />
                <div className="space-y-1 p-5">
                  <h3 className="font-heading text-2xl text-white">{item.name}</h3>
                  <p className="text-sm text-white/65">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-wood/30 bg-wood/10 p-5">
            <Lamp className="mt-0.5 size-5 shrink-0 text-wood" />
            <p className="text-sm text-white/80 sm:text-base">
              Свет: лента под карнизом, бра вверх-вниз на графите и непрерывный
              LED по периметру приподнятой террасы. В центре площадки — чёрный
              квадратный очаг.
            </p>
          </div>
        </section>

        <section id="gallery" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-wood">Ракурсы</p>
            <h2 className="font-heading mt-1 text-3xl text-white sm:text-4xl">
              Галерея визуализации
            </h2>
            <p className="mt-2 max-w-2xl text-white/65">
              Фотореалистичные кадры в формате сумеречного двора: дерево, графит,
              бетон, очаг и периметральная подсветка.
            </p>
          </div>
          <Gallery />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-wood">Сверка</p>
            <h2 className="font-heading mt-1 text-3xl text-white sm:text-4xl">
              Эскиз и визуализация
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-200">
              <div className="relative aspect-[16/10]">
                <SiteImage
                  src="/renders/sketch.png"
                  alt="Исходный линейный эскиз дома"
                  fill
                  className="object-contain p-6"
                />
              </div>
              <figcaption className="bg-[#111318] px-4 py-3 text-sm text-white/70">
                Исходный эскиз
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-white/10">
              <div className="relative aspect-[16/10]">
                <SiteImage
                  src="/renders/house-dusk-hero.png"
                  alt="Сумеречная визуализация L-дома"
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="bg-[#111318] px-4 py-3 text-sm text-white/70">
                Тот же объём в сумерках
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="model" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-wood">3D</p>
            <h2 className="font-heading mt-1 text-3xl text-white sm:text-4xl">
              Модель по эскизу
            </h2>
            <p className="mt-2 text-white/65">
              Левое крыло — дерево, правое — графит и бетон. Ночью горят карниз,
              периметр террасы и очаг.
            </p>
          </div>
          <HouseViewerSection />
        </section>

        <Separator className="mx-auto max-w-6xl bg-white/10" />
        <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-white/45 sm:px-6">
          Визуализация одноэтажного L-дома. Материалы: дерево, графит, светлый
          бетон. Подсветка террасы — по периметру.
        </footer>
      </main>
    </>
  );
}
