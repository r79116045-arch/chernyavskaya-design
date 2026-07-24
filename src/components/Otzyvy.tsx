import otzyvy from "@/data/otzyvy.json";

/**
 * Отзывы — ТОЛЬКО настоящие, от реальных заказчиков (решение 23.07: выдуманные
 * не публикуем — это подстава для Дарьи по закону о рекламе и доверию).
 * Секция сама появится на сайте, как только в src/data/otzyvy.json ляжет
 * первый отзыв. Формат записи:
 *   { "name": "Имя", "object": "квартира 68 м², Тюмень", "text": "…", "date": "2026-08" }
 * name можно сокращать («Елена К.»), object — как клиент разрешил.
 */
type Otzyv = { name: string; object?: string; text: string; date?: string };

export default function Otzyvy() {
  const items = otzyvy as Otzyv[];
  if (!items.length) return null;

  return (
    <section className="max-w-page mx-auto px-5 py-20">
      <h2 data-reveal className="font-display text-h2 mb-9">
        Отзывы
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {items.map((o, i) => (
          <figure
            key={i}
            data-reveal
            className="rounded-[20px] bg-ivory-light border border-graphite/10 p-7"
          >
            <blockquote className="font-body text-body text-graphite/90">
              «{o.text}»
            </blockquote>
            <figcaption className="mt-5 flex items-baseline justify-between gap-3">
              <span className="font-display text-card font-medium">{o.name}</span>
              {o.object && (
                <span className="font-ui text-label text-graphite/70">{o.object}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
