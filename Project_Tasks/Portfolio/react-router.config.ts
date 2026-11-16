import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  // Server-side rendering: every page ships real HTML for search engines.
  ssr: true,
  // The Vercel preset is only applied where it matters (Vercel builds),
  // so local dev and `npm run build` stay a normal React Router app.
  presets: process.env.VERCEL ? [vercelPreset()] : [],
} satisfies Config;
