"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { contacts, tgLink } from "@/lib/contacts";

/**
 * Липкая панель действий на мобильных. Три кнопки: Telegram, копировать номер, контакты.
 */
export default function StickyCta() {
  const pathname = usePathname() || "/";
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const copyPhone = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contacts.phoneHuman);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* фолбэк */ }
  }, []);

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex gap-2 bg-ivory-light/95 backdrop-blur border-t border-graphite/15 px-3 py-2.5">
        {contacts.telegram && (
          <a
            href={tgLink("Здравствуйте! Пишу с сайта.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center font-ui text-ui rounded-full py-3 min-h-[48px] flex items-center justify-center border border-graphite/55 text-graphite"
          >
            Написать
          </a>
        )}
        {contacts.phoneRaw && (
          <button
            type="button"
            onClick={copyPhone}
            className="flex-1 text-center font-ui text-ui rounded-full py-3 min-h-[48px] flex items-center justify-center border border-graphite/55 text-graphite"
          >
            {copied ? "Скопирован" : "Номер"}
          </button>
        )}
        <a
          href="/kontakty/"
          className="flex-1 text-center font-ui text-ui rounded-full py-3 min-h-[48px] flex items-center justify-center bg-wine text-ivory-light"
        >
          Контакты
        </a>
      </div>
    </div>
  );
}
