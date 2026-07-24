"use client";

import { useState } from "react";
import { channels } from "@/lib/contacts";

type Status = "idle" | "sending" | "ok" | "fail";

/**
 * Форма отзыва. Ключевое юридическое отличие от заявки: обязательная галка
 * СОГЛАСИЯ НА ПУБЛИКАЦИЮ (имя + текст уйдут на публичный сайт — без этого нельзя).
 * Контакт для уточнений — необязательный и НЕ публикуется.
 * Транспорт — тот же /form.php, что и у заявок (поле type: "otzyv").
 */
export default function OtzyvForm() {
  const [status, setStatus] = useState<Status>("idle");
  const live = channels();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.currentTarget);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    try {
      const res = await fetch("/form.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "otzyv",
          name: data.get("name"),
          object: data.get("object"),
          text: data.get("text"),
          contact: data.get("contact"),
          consent_publish: data.get("consent_publish") === "on",
          source: window.location.pathname,
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
    } catch {
      setStatus("fail");
    } finally {
      clearTimeout(timer);
    }
  }

  const inputCls =
    "w-full font-ui text-ui rounded-xl border border-graphite/55 bg-white/70 " +
    "px-3.5 py-2.5 outline-none focus:border-graphite placeholder:text-graphite/60";

  if (status === "ok")
    return (
      <p role="status" className="font-body text-lead text-graphite max-w-[58ch]">
        Спасибо! Отзыв получила — покажу вам финальный текст перед публикацией.
      </p>
    );

  return (
    <form onSubmit={submit} className="max-w-[640px] rounded-[20px] bg-ivory-light border border-graphite/15 p-6 md:p-7">
      <label htmlFor="ot-name" className="font-ui text-ui text-graphite/80 block mb-1.5">
        Как вас подписать? <span className="text-wine">*</span>
      </label>
      <input
        id="ot-name"
        name="name"
        type="text"
        required
        placeholder="Например: Елена К. — или полное имя"
        className={inputCls}
      />

      <label htmlFor="ot-object" className="font-ui text-ui text-graphite/80 block mb-1.5 mt-3.5">
        Что делали? (необязательно)
      </label>
      <input
        id="ot-object"
        name="object"
        type="text"
        placeholder="Например: квартира 68 м², Тюмень, 2024"
        className={inputCls}
      />

      <label htmlFor="ot-text" className="font-ui text-ui text-graphite/80 block mb-1.5 mt-3.5">
        Отзыв <span className="text-wine">*</span>
      </label>
      <textarea
        id="ot-text"
        name="text"
        rows={4}
        required
        placeholder="Пара фраз своими словами: с чем пришли, что понравилось в работе"
        className={inputCls + " resize-y"}
      />

      <label htmlFor="ot-contact" className="font-ui text-ui text-graphite/80 block mb-1.5 mt-3.5">
        Контакт для уточнений (не публикуется, необязательно)
      </label>
      <input
        id="ot-contact"
        name="contact"
        type="text"
        placeholder="Телефон или telegram"
        className={inputCls}
      />

      <label className="flex items-start gap-2.5 mt-4 mb-4 cursor-pointer">
        <input type="checkbox" name="consent_publish" required className="mt-1 w-4 h-4 accent-wine shrink-0" />
        <span className="font-ui text-ui text-graphite/80">
          Согласен(на) на публикацию этого отзыва с указанной подписью на сайте
          Дарьи Чернявской
        </span>
      </label>

      <button type="submit" disabled={status === "sending"} className="btn btn-graphite w-full !py-3 !min-h-[44px]">
        {status === "sending" ? "Отправляю…" : "Отправить отзыв"}
      </button>

      {status === "fail" && (
        <div role="alert" className="mt-4">
          <p className="font-ui text-ui text-wine">
            Не отправилось. {live.length > 0 ? "Пришлите отзыв напрямую — тоже отлично:" : "Попробуйте ещё раз."}
          </p>
          {live.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-3">
              {live.map((c) => (
                <a
                  key={c.kind}
                  href={c.href}
                  target={c.kind === "tel" ? undefined : "_blank"}
                  rel={c.kind === "tel" ? undefined : "noopener noreferrer"}
                  className="btn !py-2.5 !px-4 border border-graphite/55 font-ui text-ui"
                >
                  {c.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
