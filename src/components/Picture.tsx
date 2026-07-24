import type { ProjectImage } from "@/lib/projects";

/**
 * Картинка проекта: <picture> с AVIF → WebP → JPEG, srcset/sizes и width/height (CLS = 0).
 * priority=true — только ОДИН кадр на страницу (герой/шапка кейса): fetchPriority=high, без lazy.
 * fit="cover" — для «окошек» (герой, карточки), fit="contain" — для галереи кейса, где
 * композицию рендера рубить нельзя.
 */
export default function Picture({
  image,
  alt,
  sizes = "100vw",
  priority = false,
  className = "",
  imgClassName = "",
  fit = "cover",
}: {
  image: ProjectImage;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  fit?: "cover" | "contain" | "none";
}) {
  const fitCls = fit === "cover" ? "object-cover" : fit === "contain" ? "object-contain" : "";
  return (
    <picture className={className}>
      {image.avif && <source type="image/avif" srcSet={image.avif} sizes={sizes} />}
      {image.webp && <source type="image/webp" srcSet={image.webp} sizes={sizes} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        srcSet={image.jpg || undefined}
        sizes={image.jpg ? sizes : undefined}
        alt={alt}
        width={image.w ?? undefined}
        height={image.h ?? undefined}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={`${fitCls} ${imgClassName}`}
      />
    </picture>
  );
}
