import type { Channel } from "@/lib/contacts";

/**
 * Компактные круглые кнопки каналов связи («красивые небольшие», Пётр 23.07):
 * Telegram — фирменный голубой с самолётиком, MAX — их сине-фиолетовый градиент,
 * телефон — графит с трубкой. 44×44 — минимальная честная тач-цель.
 * Рендерятся только живые каналы (пустой contacts.ts → кнопки нет).
 */
export default function ChannelButtons({ items }: { items: Channel[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((c) => (
        <a
          key={c.kind}
          href={c.href}
          target={c.kind === "tel" ? undefined : "_blank"}
          rel={c.kind === "tel" ? undefined : "noopener noreferrer"}
          aria-label={c.label}
          title={c.label}
          className="group/ch inline-flex items-center justify-center w-11 h-11 rounded-full text-white
            shadow-[0_1px_4px_rgba(30,26,24,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
          style={
            c.kind === "tg"
              ? { background: "#2AABEE" }
              : c.kind === "max"
                ? { background: "linear-gradient(135deg,#8E55EA 0%,#4D7BF3 100%)" }
                : { background: "var(--color-graphite, #35302c)" }
          }
        >
          {c.kind === "tg" && (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M21.6 3.2c.3-1.2-.6-1.8-1.5-1.5L1.9 8.7c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 10.8-6.8c.5-.3 1-.1.6.2l-8.7 7.9-.3 4.8c.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.5z" />
            </svg>
          )}
          {c.kind === "max" && (
            <span className="font-ui font-bold text-[10px] tracking-[0.06em]">MAX</span>
          )}
          {c.kind === "tel" && (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z" />
            </svg>
          )}
        </a>
      ))}
    </div>
  );
}
