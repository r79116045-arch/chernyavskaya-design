"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formHref } from "@/lib/routes";

/**
 * Шапка по приёму Dieter Vander Velpen: пары разреженных капс-ссылок
 * вокруг центрального имени. Активный раздел подсвечен (aria-current).
 * «Написать» — акцентная пилюля: ведёт к форме на этой же странице, если она тут есть.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const panelRef = useRef<HTMLElement>(null);

  // меню обязано закрываться при смене маршрута, по Esc и по клику вне
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const link = (href: string) =>
    `nav-link transition-colors ${
      isActive(href)
        ? "text-graphite border-b border-wine pb-0.5"
        : "text-graphite/75 hover:text-graphite"
    }`;

  const write = formHref(pathname);

  return (
    <header
      ref={panelRef}
      className="bg-ivory-light/90 md:backdrop-blur-md border-b border-graphite/10 sticky top-0 z-40"
    >
      <div className="max-w-page mx-auto px-5">
        <div className="flex items-center justify-between py-4 md:py-5">
          <nav className="hidden md:flex gap-7" aria-label="Разделы">
            <Link href="/portfolio/" className={link("/portfolio")} aria-current={isActive("/portfolio") ? "page" : undefined}>
              Портфолио
            </Link>
            <Link href="/uslugi/" className={link("/uslugi")} aria-current={isActive("/uslugi") ? "page" : undefined}>
              Услуги и цены
            </Link>
          </nav>

          <Link href="/" className="text-center" aria-label="Дарья Чернявская — на главную">
            <span className="block font-display font-medium text-[clamp(19px,0.6vw+14px,28px)] tracking-[0.14em]">
              ДАРЬЯ ЧЕРНЯВСКАЯ
            </span>
            <span className="block caps-wide text-graphite/70 mt-0.5">
              дизайн интерьера · Тюмень
            </span>
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            <Link href="/kontakty/" className={link("/kontakty")} aria-current={isActive("/kontakty") ? "page" : undefined}>
              Контакты
            </Link>
            <a
              href={write}
              className="font-ui text-ui uppercase tracking-caps bg-wine text-ivory-light rounded-full px-4 py-2 hover:brightness-110 transition"
            >
              Написать
            </a>
          </div>

          {/* мобильный бургер */}
          <button
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="md:hidden p-3 -mr-2 min-w-[48px] min-h-[48px] flex flex-col items-center justify-center"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <span className="text-h3 leading-none">×</span>
            ) : (
              <>
                <span className="block w-6 h-px bg-graphite mb-1.5" />
                <span className="block w-6 h-px bg-graphite mb-1.5" />
                <span className="block w-6 h-px bg-graphite" />
              </>
            )}
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" className="md:hidden pb-5 flex flex-col gap-4 text-center" aria-label="Разделы">
            <Link href="/portfolio/" className={link("/portfolio")}>
              Портфолио
            </Link>
            <Link href="/uslugi/" className={link("/uslugi")}>
              Услуги и цены
            </Link>
            <Link href="/kontakty/" className={link("/kontakty")}>
              Контакты
            </Link>
            <a href={write} className="btn btn-wine mx-auto px-8">
              Написать
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
