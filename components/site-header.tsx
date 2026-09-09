import { Badge } from "@/components/ui/badge";

const LINKS = [
  { href: "#materials", label: "Материалы" },
  { href: "#gallery", label: "Галерея" },
  { href: "#model", label: "3D-модель" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111318]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="font-heading text-xl tracking-wide text-white">
            Дом L
          </span>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            визуализация
          </Badge>
        </a>
        <nav className="flex items-center gap-1 sm:gap-3">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-1 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
