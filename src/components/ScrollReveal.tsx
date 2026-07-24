"use client";

import { useEffect } from "react";

/**
 * Мягкое появление блоков при скролле (перенос с Бытовки72, сдержанно как у премиум-сайтов).
 * Работает поверх [data-reveal]: без JS блоки видны сразу (SEO/no-js safe),
 * с JS html получает .js-reveal и элементы всплывают по мере входа в вьюпорт.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((el) => el.classList.add("in"));
      return () => root.classList.remove("js-reveal");
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    els.forEach((el) => {
      // уже в кадре при загрузке — показываем сразу, без «прыжка»
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) el.classList.add("in");
      else io.observe(el);
    });

    return () => {
      io.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
