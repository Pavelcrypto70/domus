import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

type SiteImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
};

export function SiteImage({ src, alt, className, fill, priority }: SiteImageProps) {
  return (
    // Native img so GitHub Pages always gets the /domus prefix.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(src)}
      alt={alt}
      className={cn(fill ? "absolute inset-0 h-full w-full" : "h-full w-full", className)}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
    />
  );
}
