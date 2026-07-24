"use client";

import { useEffect, useRef, useState } from "react";
import type { Project, ProjectImage } from "@/lib/projects";
import { imageAlt } from "@/lib/projects";

/**
 * Галерея кейса с лайтбоксом на нативном <dialog> (фокус-трап, Esc, backdrop — бесплатно).
 * Ритм «полноширинный → пара → полноширинный» задаётся индексом, а не руками,
 * чтобы вёрстка не разъехалась при добавлении проектов.
 * Рендеры НЕ кадрируем (object-contain) — композицию рубить нельзя.
 */
export default function Lightbox({
  project,
  images,
}: {
  project: Project;
  images: ProjectImage[];
}) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [idx, setIdx] = useState(0);

  const open = (i: number) => {
    setIdx(i);
    dlg.current?.showModal();
  };
  const move = (d: number) => setIdx((i) => (i + d + images.length) % images.length);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    d.addEventListener("keydown", onKey);
    return () => d.removeEventListener("keydown", onKey);
  }, [images.length]);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {images.map((img, i) => {
          // 0 — во всю ширину; далее парами; каждый 5-й снова во всю ширину
          const full = i === 0 || i % 5 === 0;
          // Кадр обязан помещаться на экран ЦЕЛИКОМ при скролле: ограничиваем ШИРИНУ рамки
          // через пропорцию кадра (maxWidth = --frame-h × w/h) — высота выходит ≤ --frame-h,
          // а место под lazy-фото резервируется атрибутами width/height (нет скачков лейаута).
          const ratio = img.w && img.h ? img.w / img.h : null;
          // Пара прижимается к ОБЩЕЙ оси: зазор между кадрами всегда ровно gap-8,
          // «гуляют» только внешние поля (просьба Петра «подровняй зазоры»).
          // Позиция в блоке из 5 (full + 4): 1,3 — левый кадр пары, 2,4 — правый.
          // Последний кадр без напарника — по центру, а не прижатым к пустоте.
          const lone = i === images.length - 1 && (i % 5 === 1 || i % 5 === 3);
          const pairSide = full || lone ? "" : i % 5 === 1 || i % 5 === 3 ? "md:justify-self-end" : "md:justify-self-start";
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => open(i)}
              className={`group relative overflow-hidden rounded-[18px] bg-ivory-dark w-full max-w-full justify-self-center ${
                full ? "md:col-span-2" : pairSide
              }`}
              style={{
                cursor: "zoom-in",
                ...(ratio ? { maxWidth: `calc(var(--frame-h) * ${ratio.toFixed(4)})` } : {}),
              }}
              aria-label="Открыть кадр во весь экран"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                srcSet={img.jpg || undefined}
                sizes={
                  full
                    ? "(min-width:2500px) 2200px, (min-width:768px) 88vw, 100vw"
                    : "(min-width:2500px) 1050px, (min-width:768px) 44vw, 100vw"
                }
                alt={imageAlt(project, img)}
                width={img.w ?? undefined}
                height={img.h ?? undefined}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={
                  ratio
                    ? "block w-full h-auto"
                    : "block w-auto h-auto max-w-full max-h-[var(--frame-h)]"
                }
              />
            </button>
          );
        })}
      </div>

      <dialog ref={dlg} className="lightbox">
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => dlg.current?.close()}
            aria-label="Закрыть"
            className="absolute top-4 right-5 text-ivory/90 text-3xl leading-none z-10"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Предыдущий кадр"
            className="absolute left-3 md:left-6 text-ivory/80 text-3xl p-4 z-10"
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[idx]?.src}
            alt={images[idx] ? imageAlt(project, images[idx]) : ""}
            className="max-w-full max-h-[88vh] object-contain"
          />
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Следующий кадр"
            className="absolute right-3 md:right-6 text-ivory/80 text-3xl p-4 z-10"
          >
            ›
          </button>
          {images[idx]?.caption && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 caps text-ivory px-3 py-1.5 rounded-full bg-graphite/70">
              {images[idx].caption}
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
