"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { contacts, tgLink, tel } from "@/lib/contacts";
import { formHref } from "@/lib/routes";

/**
 * Липкая панель действий на мобильных — главный резерв заявок (трафик будет мобильный).
 * Появляется после героя, прячется когда форма #zayavka в кадре (иначе перекроет заявку).
 * Кнопки собираются из живых контактов: нет значения — нет кнопки (панель не ждёт Дарью).
 */
export default function StickyCta() {
  const pathname = usePathname() || "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    // прячем, пока форма видна
    const form = document.getElementById("zayavka");
    let formVisible = false;
    const io = form
      ? new IntersectionObserver(
          ([e]) => {
            formVisible = e.isIntersecting;
            update();
          },
          { rootMargin: "-10% 0px -40% 0px" }
        )
      : null;
    io?.observe(form!);

    // показываем после первого экрана
    const onScroll = () => update();
    function update() {
      setShow(window.scrollY > window.innerHeight * 0.6 && !formVisible);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [pathname]);

  const zayavka = formHref(pathname);
  const btns: { label: string; href: string; ext?: boolean; primary?: boolean }[] = [];
  if (contacts.phoneRaw) btns.push({ label: "Позвонить", href: tel() });
  if (contacts.telegram)
    btns.push({ label: "Написать", href: tgLink("Здравствуйте! Пишу с сайта."), ext: true });
  btns.push({ label: "Заявка", href: zayavka, primary: true });

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex gap-2 bg-ivory-light/95 backdrop-blur border-t border-graphite/15 px-3 py-2.5">
        {btns.map((b) => (
          <a
            key={b.label}
            href={b.href}
            target={b.ext ? "_blank" : undefined}
            rel={b.ext ? "noopener noreferrer" : undefined}
            className={`flex-1 text-center font-ui text-ui rounded-full py-3 min-h-[48px] flex items-center justify-center ${
              b.primary ? "bg-wine text-ivory-light" : "border border-graphite/55 text-graphite"
            }`}
          >
            {b.label}
          </a>
        ))}
      </div>
    </div>
  );
}
