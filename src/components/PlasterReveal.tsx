"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "venetian" | "photo";

/**
 * «Штукатурка» — фирменная фишка сайта (порт демо-эффекта 08.07 под светлую гамму).
 * Фон секции — голая оштукатуренная стена; курсор — валик, вдоль движения проявляется:
 *   mode="venetian" — декоративная венецианка (генеративный мрамор с золотыми прожилками);
 *   mode="photo"    — фотография интерьера (проп image).
 *
 * Валик работает там, где есть мышь и не запрошено reduced-motion.
 * Иначе слой рисуется сразу полностью (тихий статичный фон) — заявке ничего не мешает.
 */
export default function PlasterReveal({
  mode = "venetian",
  image = "",
}: {
  mode?: Mode;
  image?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const [interactive, setInteractive] = useState(false);
  const [hinted, setHinted] = useState(false);

  useEffect(() => {
    if (!wrapRef.current || !sceneRef.current) return;
    const wrap: HTMLDivElement = wrapRef.current;
    const scene: HTMLCanvasElement = sceneRef.current;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // экономия данных / слабый CPU (мобильные) — эффект не строим вовсе
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    const weak = conn?.saveData === true || (navigator.hardwareConcurrency || 8) <= 4;
    const live = fine && !noMotion && !weak;
    setInteractive(live);
    // Без валика (тач/reduced-motion/saveData) canvas НЕ монтируем:
    // рисовать 1,5-Мпикс мрамор ради неинтерактивной картинки на телефоне — расточительно.
    // Фолбэк — статичная CSS-полоса кости (см. return).
    if (!live) return;

    const sctx = scene.getContext("2d")!;
    // offscreen-слои: стена / проявляемый слой / маска укрытия / буфер маскирования
    const wall = document.createElement("canvas");
    const reveal = document.createElement("canvas");
    const mask = document.createElement("canvas");
    const tmp = document.createElement("canvas");
    const wctx = wall.getContext("2d")!;
    const rctx = reveal.getContext("2d")!;
    const mctx = mask.getContext("2d")!;
    const tctx = tmp.getContext("2d")!;

    let W = 0;
    let H = 0;
    let DPR = 1;
    let dirty = true;
    let raf = 0;
    let px = -1;
    let py = -1;
    let prevX = -1;
    let prevY = -1;
    let painted = false; // валик уже макнули в штукатурку

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const img = new Image();
    let imgReady = false;
    if (mode === "photo" && image) {
      img.onload = () => {
        imgReady = true;
        buildReveal();
        dirty = true;
      };
      img.src = image;
    }

    // голая стена под нанесение: ровная светлая база с зерном и лёгкими тенями
    function buildWall() {
      wall.width = W;
      wall.height = H;
      const g = wctx.createLinearGradient(0, 0, W * 0.3, H);
      g.addColorStop(0, "#EAE1CF");
      g.addColorStop(0.55, "#E3D8C2");
      g.addColorStop(1, "#DACDB4");
      wctx.fillStyle = g;
      wctx.fillRect(0, 0, W, H);
      for (let i = 0; i < (W * H) / 1800; i++) {
        wctx.fillStyle = `rgba(${Math.random() < 0.5 ? "255,252,244" : "120,104,82"},${rnd(0.03, 0.09).toFixed(3)})`;
        wctx.fillRect(Math.random() * W, Math.random() * H, rnd(1, 2.2), rnd(1, 2.2));
      }
      for (let i = 0; i < 18; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const rg = wctx.createRadialGradient(x, y, 0, x, y, rnd(60, 240));
        rg.addColorStop(0, `rgba(96,82,62,${rnd(0.03, 0.09).toFixed(3)})`);
        rg.addColorStop(1, "rgba(96,82,62,0)");
        wctx.fillStyle = rg;
        wctx.fillRect(0, 0, W, H);
      }
    }

    // ——— декоративная венецианка (порт из демо): мрамор + золотые прожилки ———
    function buildVenetian() {
      const c = rctx;
      c.filter = "none";

      // светлая кремовая база — чуть светлее и «дороже» голой стены
      const g = c.createLinearGradient(0, 0, W * 0.2, H);
      g.addColorStop(0, "#F7F2E9");
      g.addColorStop(0.5, "#EEE5D6");
      g.addColorStop(1, "#E4DAC8");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);

      // мраморные разводы: мягкие массы → размываем в облака
      const cloud = document.createElement("canvas");
      cloud.width = W;
      cloud.height = H;
      const cc = cloud.getContext("2d")!;
      const masses = ["255,253,248", "236,228,213", "224,216,201", "196,184,165", "160,148,130"];
      const ang = -0.62;
      const dx = Math.cos(ang);
      const dy = Math.sin(ang);
      for (let i = 0; i < 48; i++) {
        const cx = Math.random() * W;
        const cy = Math.random() * H;
        const m = masses[(Math.random() * masses.length) | 0];
        const rad = rnd(130, 470) * (DPR / 1.4);
        for (let s = -1; s <= 1; s++) {
          const mx = cx + dx * rad * 0.5 * s;
          const my = cy + dy * rad * 0.5 * s;
          const rg = cc.createRadialGradient(mx, my, 0, mx, my, rad);
          rg.addColorStop(0, `rgba(${m},${rnd(0.32, 0.7).toFixed(3)})`);
          rg.addColorStop(1, `rgba(${m},0)`);
          cc.fillStyle = rg;
          cc.beginPath();
          cc.arc(mx, my, rad, 0, 6.283);
          cc.fill();
        }
      }
      // дымчатые разводы — структура мрамора
      cc.lineJoin = "round";
      cc.lineCap = "round";
      for (let i = 0; i < 10; i++) {
        let x = rnd(-0.1, 0.6) * W;
        let y = rnd(0, 1) * H;
        let a = ang + rnd(-0.5, 0.5);
        cc.strokeStyle = `rgba(${Math.random() < 0.5 ? "130,118,100," : "104,93,79,"}${rnd(0.16, 0.3).toFixed(3)})`;
        cc.lineWidth = rnd(20, 70) * DPR;
        cc.beginPath();
        cc.moveTo(x, y);
        for (let s = 0; s < 6; s++) {
          a += rnd(-0.4, 0.4);
          x += Math.cos(a) * W * 0.16;
          y += Math.sin(a) * W * 0.16;
          cc.lineTo(x, y);
        }
        cc.stroke();
      }
      c.filter = `blur(${13 * DPR}px)`;
      c.drawImage(cloud, 0, 0);
      c.filter = "none";

      // золотые прожилки с ветвлением — сигнатура венецианки
      function vein(x0: number, y0: number, angle: number, length: number, width: number, depth: number) {
        const pts: { x: number; y: number }[] = [];
        let x = x0;
        let y = y0;
        let a = angle;
        const steps = Math.max(6, (length / (28 * DPR)) | 0);
        for (let s = 0; s <= steps; s++) {
          pts.push({ x, y });
          a += rnd(-0.36, 0.36);
          const step = length / steps;
          x += Math.cos(a) * step;
          y += Math.sin(a) * step;
        }
        const stroke = (w: number, style: string) => {
          c.lineJoin = "round";
          c.lineCap = "round";
          c.lineWidth = w;
          c.strokeStyle = style;
          c.beginPath();
          c.moveTo(pts[0].x, pts[0].y);
          for (let s = 1; s < pts.length; s++) c.lineTo(pts[s].x, pts[s].y);
          c.stroke();
        };
        stroke(width * 2.6, "rgba(120,86,40,0.14)");
        stroke(width * 1.3, "rgba(198,152,82,0.45)");
        stroke(width * 0.5, "rgba(248,232,182,0.55)");
        if (depth > 0) {
          for (let b = 0; b < 2; b++) {
            const idx = Math.max(1, (rnd(0.3, 0.8) * pts.length) | 0);
            const prev = pts[idx - 1];
            const ba = Math.atan2(pts[idx].y - prev.y, pts[idx].x - prev.x) + rnd(-0.9, 0.9);
            vein(pts[idx].x, pts[idx].y, ba, length * rnd(0.3, 0.5), width * 0.7, depth - 1);
          }
        }
      }
      for (let i = 0; i < 5; i++) {
        vein(rnd(-0.1, 0.5) * W, rnd(0, 1) * H, ang + rnd(-0.5, 0.5), rnd(0.35, 0.75) * W, rnd(1.4, 2.6) * DPR, 1);
      }

      // перламутровый блеск
      for (let i = 0; i < 3; i++) {
        const x = rnd(0, W);
        const y = rnd(0, H);
        const rg = c.createRadialGradient(x, y, 0, x, y, rnd(320, 680) * (DPR / 1.4));
        rg.addColorStop(0, "rgba(255,252,244,0.12)");
        rg.addColorStop(1, "rgba(255,252,244,0)");
        c.fillStyle = rg;
        c.fillRect(0, 0, W, H);
      }

      // мелкое зерно
      for (let i = 0; i < (W * H) / 2800; i++) {
        c.fillStyle = `rgba(${Math.random() < 0.5 ? "255,252,244," : "120,102,78,"}${rnd(0.015, 0.05).toFixed(3)})`;
        c.fillRect(Math.random() * W, Math.random() * H, 1, 1);
      }
    }

    function buildPhoto() {
      rctx.clearRect(0, 0, W, H);
      if (!imgReady || !img.width) return;
      const s = Math.max(W / img.width, H / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      rctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      // вуаль кости, чтобы фото не спорило с формой
      rctx.fillStyle = "rgba(247,243,235,0.35)";
      rctx.fillRect(0, 0, W, H);
    }

    function buildReveal() {
      reveal.width = W;
      reveal.height = H;
      if (mode === "venetian") buildVenetian();
      else buildPhoto();
    }

    function resize() {
      const r = wrap.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(r.width * DPR));
      H = Math.max(1, Math.round(r.height * DPR));
      scene.width = W;
      scene.height = H;
      mask.width = W;
      mask.height = H;
      if (!live) {
        // без валика слой виден сразу целиком
        mctx.fillStyle = "#fff";
        mctx.fillRect(0, 0, W, H);
      }
      buildWall();
      buildReveal();
      dirty = true;
    }

    // мазок валика в маску: мягкие штампы вдоль отрезка, lighten — без тёмных кругов;
    // по краю — пара случайных под-штампов («шубка» оставляет рваный, живой след)
    function stamp(x: number, y: number, r: number) {
      const g = mctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.55, "rgba(255,255,255,0.92)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      mctx.globalCompositeOperation = "lighten";
      mctx.fillStyle = g;
      mctx.beginPath();
      mctx.arc(x, y, r, 0, 6.283);
      mctx.fill();
      for (let i = 0; i < 2; i++) {
        const a = Math.random() * 6.283;
        const rx = x + Math.cos(a) * r * rnd(0.55, 0.85);
        const ry = y + Math.sin(a) * r * rnd(0.55, 0.85);
        const rr = r * rnd(0.2, 0.4);
        const gg = mctx.createRadialGradient(rx, ry, 0, rx, ry, rr);
        gg.addColorStop(0, "rgba(255,255,255,0.85)");
        gg.addColorStop(1, "rgba(255,255,255,0)");
        mctx.fillStyle = gg;
        mctx.beginPath();
        mctx.arc(rx, ry, rr, 0, 6.283);
        mctx.fill();
      }
    }
    function smear(x0: number, y0: number, x1: number, y1: number, r: number) {
      const dist = Math.hypot(x1 - x0, y1 - y0);
      const steps = Math.max(1, Math.ceil(dist / (r * 0.33)));
      for (let s = 0; s <= steps; s++) {
        stamp(x0 + ((x1 - x0) * s) / steps, y0 + ((y1 - y0) * s) / steps, r);
      }
      dirty = true;
    }

    // валик-курсор: шубка-цилиндр + ручка
    function drawRoller(x: number, y: number) {
      const s = DPR;
      sctx.save();
      sctx.translate(x, y);
      sctx.rotate(-0.35);
      sctx.strokeStyle = "rgba(62,44,35,0.85)";
      sctx.lineWidth = 3.5 * s;
      sctx.lineCap = "round";
      sctx.beginPath();
      sctx.moveTo(0, 0);
      sctx.quadraticCurveTo(16 * s, 26 * s, 34 * s, 34 * s);
      sctx.stroke();
      const w = 46 * s;
      const h = 16 * s;
      // после первого мазка шубка «в штукатурке» — тёплый мраморный крем
      const grad = sctx.createLinearGradient(-w / 2, -h / 2, -w / 2, h / 2);
      if (painted) {
        grad.addColorStop(0, "#FFFDF6");
        grad.addColorStop(0.5, "#F2E9D8");
        grad.addColorStop(1, "#D9CBAF");
      } else {
        grad.addColorStop(0, "#FBF7EF");
        grad.addColorStop(0.5, "#E8DFCC");
        grad.addColorStop(1, "#C9BCA1");
      }
      sctx.fillStyle = grad;
      sctx.strokeStyle = "rgba(62,44,35,0.5)";
      sctx.lineWidth = 1 * s;
      const r = h / 2;
      sctx.beginPath();
      sctx.moveTo(-w / 2 + r, -h / 2);
      sctx.arcTo(w / 2, -h / 2, w / 2, h / 2, r);
      sctx.arcTo(w / 2, h / 2, -w / 2, h / 2, r);
      sctx.arcTo(-w / 2, h / 2, -w / 2, -h / 2, r);
      sctx.arcTo(-w / 2, -h / 2, w / 2, -h / 2, r);
      sctx.closePath();
      sctx.fill();
      sctx.stroke();
      sctx.restore();
    }

    // композит: стена + проявляемый слой сквозь маску (+ валик)
    function composite() {
      tmp.width = W;
      tmp.height = H;
      tctx.clearRect(0, 0, W, H);
      tctx.globalCompositeOperation = "source-over";
      tctx.drawImage(reveal, 0, 0);
      tctx.globalCompositeOperation = "destination-in";
      tctx.drawImage(mask, 0, 0);

      sctx.globalCompositeOperation = "source-over";
      sctx.drawImage(wall, 0, 0);
      sctx.drawImage(tmp, 0, 0);
      if (px >= 0) drawRoller(px, py);
    }

    let onScreen = true; // rAF крутим только пока секция в кадре
    function loop() {
      if (onScreen && dirty) {
        composite();
        dirty = false;
      }
      raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) * DPR;
      const y = (e.clientY - r.top) * DPR;
      if (prevX >= 0) {
        smear(prevX, prevY, x, y, 42 * DPR);
        painted = true;
      }
      prevX = x;
      prevY = y;
      px = x;
      py = y;
      dirty = true;
      setHinted(true);
    }
    function onLeave() {
      prevX = -1;
      prevY = -1;
      px = -1;
      py = -1;
      dirty = true;
    }

    // ResizeObserver дебаунсим и пересобираем ТОЛЬКО при смене ширины —
    // адресная строка мобилы дёргает высоту на каждый скролл, мрамор пересобирать не нужно.
    let lastW = -1;
    let rt = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(rt);
      rt = window.setTimeout(() => {
        const w = Math.round(wrap.getBoundingClientRect().width);
        if (w !== lastW) {
          lastW = w;
          resize();
        }
      }, 200);
    });
    ro.observe(wrap);
    lastW = Math.round(wrap.getBoundingClientRect().width);
    resize();

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
    });
    io.observe(wrap);

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [mode, image]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* фолбэк без валика (тач/reduced-motion/saveData): статичная полоса кости, без canvas */}
      {!interactive && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg,#F7F2E9 0%,#EEE5D6 45%,#E4DAC8 100%)",
          }}
        />
      )}
      {interactive && (
        <>
          <canvas ref={sceneRef} className="absolute inset-0 w-full h-full" style={{ cursor: "none" }} />
          <span
            className={`caps-wide absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-graphite/45
              transition-opacity duration-700 ${hinted ? "opacity-0" : "opacity-100"}`}
          >
            {mode === "venetian"
              ? "проведите валиком — нанесите декоративную штукатурку"
              : "проведите валиком по стене — проявится интерьер"}
          </span>
        </>
      )}
    </div>
  );
}
