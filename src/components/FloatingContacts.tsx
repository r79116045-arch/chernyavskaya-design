"use client";

import { useState } from "react";
import { channels } from "@/lib/contacts";
import type { Channel } from "@/lib/contacts";

/**
 * Плавающая вертикальная панель мессенджеров — всегда на виду при скролле.
 * Только десктоп: на мобильных — StickyCta снизу.
 */
export default function FloatingContacts() {
  const items = channels("Здравствуйте! Пишу с сайта.");
  if (!items.length) return null;

  return (
    <div className="hidden md:block fixed right-5 bottom-8 z-30">
      <div className="flex flex-col items-center gap-3">
        {items.map((c) => (
          <FloatingBtn key={c.kind} c={c} />
        ))}
      </div>
    </div>
  );
}

function FloatingBtn({ c }: { c: Channel }) {
  const [copied, setCopied] = useState(false);

  const color =
    c.kind === "tg" ? "#2AABEE" :
    c.kind === "max" ? "#6B4FD4" :
    "#94857a";  // средний тон — виден и на светлом, и на тёмном фоне

  const shared =
    "group inline-flex items-center justify-center w-10 h-10 rounded-full " +
    "border bg-transparent backdrop-blur-sm " +
    "shadow-[0_1px_3px_rgba(30,26,24,0.10)] " +
    "transition-all duration-200 hover:scale-110 hover:shadow-[0_2px_8px_rgba(30,26,24,0.18)]";

  // Кнопка копирования номера — с иконкой трубки
  if (c.kind === "copy") {
    return (
      <button
        type="button"
        aria-label={copied ? "Номер скопирован" : c.label}
        title={c.label}
        className={shared}
        style={{ borderColor: color, color }}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(c.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch { /* фолбэк */ }
        }}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <a
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={c.label}
      title={c.label}
      className={shared}
      style={{ borderColor: color, color }}
    >
      {c.kind === "tg" && (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M21.6 3.2c.3-1.2-.6-1.8-1.5-1.5L1.9 8.7c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 10.8-6.8c.5-.3 1-.1.6.2l-8.7 7.9-.3 4.8c.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.5z" />
        </svg>
      )}
      {c.kind === "max" && (
        <span className="font-ui font-bold text-[9px] tracking-[0.05em]">MAX</span>
      )}
    </a>
  );
}
