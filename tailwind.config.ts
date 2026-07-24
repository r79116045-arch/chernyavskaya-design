import type { Config } from "tailwindcss";

// Палитра направления IV «Синтез» (мудборд 09.07, выбор Дарьи):
// кость ~70% / графит ~20% / вино ~7% / шоколад ~3%
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        // текстовые ступени — в rem, растут вместе с флюидным корнем
        // (в скобках: 360px / 1920px / 3200px = монитор 1920 при зуме 60%)
        micro: ["0.78rem", { lineHeight: "1.45" }], // 13.3 / 15.9 / 18.7
        label: ["0.82rem", { lineHeight: "1.4", letterSpacing: "0.16em" }], // 13.9 / 16.7 / 19.7
        ui: ["0.9rem", { lineHeight: "1.55" }], // 15.3 / 18.4 / 21.6
        body: ["1rem", { lineHeight: "1.6" }], // 17.0 / 20.4 / 24.0
        lead: ["1.18rem", { lineHeight: "1.5" }], // 20.1 / 24.1 / 28.3
        // дисплейные — свой clamp в px+vw: диапазон шире, чем даёт корень
        card: ["clamp(20px, 1vw + 12px, 34px)", { lineHeight: "1.2" }],
        h3: ["clamp(22px, 0.9vw + 14px, 34px)", { lineHeight: "1.25" }],
        h2: ["clamp(26px, 1.5vw + 12px, 52px)", { lineHeight: "1.15" }],
        h1: ["clamp(30px, 2.2vw + 12px, 66px)", { lineHeight: "1.08" }],
        hero: ["clamp(40px, 4.4vw + 8px, 120px)", { lineHeight: "1.04" }],
      },
      colors: {
        ivory: { DEFAULT: "#F7F3EB", light: "#FFFDF8", dark: "#EFE8DA" },
        graphite: "#26262A",
        wine: { DEFAULT: "#7E3B47", dark: "#6E2639" },
        choco: "#3E2C23",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["Georgia", "Times New Roman", "serif"],
        ui: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        caps: "0.16em",
        capsWide: "0.2em",
      },
      maxWidth: {
        // текст и UI: 1120 до ~1510px, дальше плавно до 1440
        page: "clamp(1120px, 74vw, 1440px)",
        // фото-сетки: 1126 на 1280 → 1690 на 1920 → 2200 (ширина мастер-файлов) от 2500
        wide: "clamp(1120px, 88vw, 2200px)",
      },
    },
  },
  plugins: [],
};

export default config;
