"use client";

import { useEffect, useRef, useState } from "react";
import { channels } from "@/lib/contacts";
import ChannelButtons from "@/components/ChannelButtons";

type Status = "idle" | "sending" | "ok" | "fail";

/** Версия политики: меняем при правке текста /privacy — уходит в заявку как доказательство согласия. */
export const POLICY_VERSION = "2026-07-14";

/** Версия текста согласия (/soglasie). Меняем при любой правке формулировок. */
export const CONSENT_VERSION = "2026-07-23";

/** Краткая суть согласия — уходит в заявку, чтобы было видно, ПОД ЧЕМ именно подписался человек. */
export const CONSENT_SUMMARY =
  "Согласие на обработку указанных контактных данных для связи по обращению; " +
  "оператор — Чернявская Д. В., самозанятая, ИНН 720214772655; срок — до 1 года; отзыв в любой момент.";

/**
 * Форма заявки: ОДНО обязательное поле «как с вами связаться» (телефон / telegram / почта)
 * + необязательный комментарий. Имя не спрашиваем: обязательное поле телефона — самый
 * дорогой элемент формы, выбор канала снимает барьер.
 * Отправка — form.php на хостинге: данные остаются в РФ, в Telegram уходит только сигнал.
 *
 * Заявка НИКОГДА не теряется: ловушка для ботов и таймер только ПОМЕЧАЮТ сообщение,
 * а не отбрасывают (иначе автозаполнение браузера молча съедало бы живых клиентов).
 */
export default function LeadForm({ context }: { context?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [phone, setPhone] = useState("");
  const startedAt = useRef<number>(0);
  const okRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "ok") okRef.current?.focus();
  }, [status]);

  const live = channels(context);

  /** Мягкое форматирование: только на blur, ввод не перехватываем, вставку из буфера принимаем любую. */
  function formatPhone(v: string) {
    const d = v.replace(/\D/g, "").replace(/^8/, "7").replace(/^([^7])/, "7$1");
    if (d.length < 11) return v;
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    try {
      const res = await fetch("/form.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: data.get("contact"),
          note: data.get("note"),
          honeypot: data.get("nickname_alt"), // ловушка: у людей поле пустое
          elapsed: Math.round((Date.now() - startedAt.current) / 1000),
          // фиксация факта согласия: доказывание лежит на операторе (ч.3 ст.9 152-ФЗ)
          consent: data.get("consent") === "on",
          consent_version: CONSENT_VERSION,
          policy_version: POLICY_VERSION,
          consent_text: CONSENT_SUMMARY,
          context: context || "",
          source: window.location.pathname + window.location.search,
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Ошибка ${res.status}`);
      }
      setStatus("ok");
      form.reset();
      setPhone("");
    } catch (err) {
      setStatus("fail");
      setError(
        err instanceof Error && err.name !== "AbortError" && err.message.startsWith("Введите")
          ? err.message
          : ""
      );
    } finally {
      clearTimeout(timer);
    }
  }

  // «чуть меньше, чтоб изящно» (Пётр 23.07): поля и отступы на ступень компактнее,
  // но тач-высота ≥44px и одно-полевая конверсионная логика не тронуты
  const inputCls =
    "w-full font-ui text-ui rounded-xl border border-graphite/55 bg-white/70 " +
    "px-3.5 py-2.5 outline-none focus:border-graphite placeholder:text-graphite/60";

  return (
    <div
      id="zayavka"
      className="max-w-[640px] rounded-[20px] bg-ivory-light border border-graphite/15 p-6 md:p-7 scroll-mt-[var(--header-h)]"
    >
      <h3 className="font-display text-h3 font-medium">
        {context ? `Хотите интерьер, как в проекте «${context}»?` : "Обсудим ваш интерьер?"}
      </h3>
      <p className="font-ui text-ui text-graphite/70 mt-1.5 mb-4">
        Консультация и замер — бесплатно. Отвечу в течение дня.
      </p>

      {status === "ok" ? (
        <div>
          <p
            ref={okRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="font-body text-body text-graphite outline-none"
          >
            Заявка принята — отвечу в течение дня. Если удобнее сразу, вот прямые каналы:
          </p>
          {live.length > 0 && (
            <div className="mt-5">
              <ChannelButtons items={live} />
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={submit} noValidate={false}>
          {/* ловушка для ботов: люди её не видят и не таб-фокусят; заявку она НЕ отбрасывает */}
          <div
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
          >
            <label htmlFor="nickname_alt">Не заполняйте это поле</label>
            <input id="nickname_alt" name="nickname_alt" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {/* ОДНО обязательное поле: на телефоне бросают форму до 37%, выбор канала снимает барьер */}
          <label htmlFor="lf-contact" className="sr-only">
            Как с вами связаться — телефон, telegram или почта
          </label>
          <input
            id="lf-contact"
            name="contact"
            type="text"
            required
            autoComplete="tel"
            placeholder="Телефон, telegram или почта"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={(e) => setPhone(formatPhone(e.target.value))}
            aria-describedby={error ? "lf-error" : "lf-hint"}
            className={inputCls}
          />
          <p id="lf-hint" className="font-ui text-ui text-graphite/75 mt-2">
            Как удобнее — так и отвечу. Имя спрашивать не буду, познакомимся в разговоре.
          </p>
          {error && (
            <p id="lf-error" role="alert" className="font-ui text-ui text-wine mt-2">
              {error}
            </p>
          )}

          <label htmlFor="lf-note" className="sr-only">
            Коротко о задаче (необязательно)
          </label>
          <textarea
            id="lf-note"
            name="note"
            rows={2}
            placeholder="Коротко о задаче: площадь, город, сроки (необязательно)"
            className={inputCls + " mt-3 resize-y"}
          />

          {/* Согласие — ОТДЕЛЬНЫЙ документ, а не ссылка на политику (ч.1 ст.9 152-ФЗ с 01.09.2025) */}
          <label className="flex items-start gap-2.5 mt-3.5 mb-3.5 cursor-pointer">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 w-4 h-4 accent-wine shrink-0"
            />
            <span className="font-ui text-ui text-graphite/80">
              Даю{" "}
              <a href="/soglasie/" target="_blank" rel="noopener" className="underline hover:text-graphite">
                согласие на обработку персональных данных
              </a>{" "}
              (см. также{" "}
              <a href="/privacy/" target="_blank" rel="noopener" className="underline hover:text-graphite">
                политику
              </a>
              )
            </span>
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-graphite w-full !py-3 !min-h-[44px]"
          >
            {status === "sending" ? "Отправляю…" : "Записаться на бесплатный замер"}
          </button>
          <p className="font-ui text-ui text-graphite/70 mt-2.5 text-center">
            Отвечу в течение дня — тем способом, который вы указали. Без навязывания.
          </p>

          {status === "fail" && !error && (
            <div role="alert" className="mt-4">
              <p className="font-ui text-ui text-wine">
                Заявка не дошла.{" "}
                {live.length > 0 ? "Свяжитесь напрямую — так быстрее:" : "Попробуйте, пожалуйста, ещё раз."}
              </p>
              {live.length > 0 && (
                <div className="mt-3">
                  <ChannelButtons items={live} />
                </div>
              )}
            </div>
          )}
        </form>
      )}

      {status === "idle" && live.length > 0 && (
        <div className="mt-4 pt-4 border-t border-graphite/10">
          <span className="caps text-graphite/70 block mb-3">или напишите напрямую</span>
          <ChannelButtons items={live} />
        </div>
      )}
    </div>
  );
}
