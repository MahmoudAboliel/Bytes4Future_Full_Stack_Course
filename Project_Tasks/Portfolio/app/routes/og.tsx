import type { MetaFunction } from "react-router";

import { site } from "~/data/site";
import { profile } from "~/data/profile";

export const meta: MetaFunction = () => [
  { title: "Open Graph image" },
  { name: "robots", content: "noindex, nofollow" },
];

/**
 * A 1200×630 social card rendered by the app itself.
 * `npm run assets:og` screenshots this route into /public/og.png.
 */
export default function OgRoute() {
  return (
    <div className="fixed inset-0 z-[999] overflow-hidden bg-[#07070b] text-white">
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(60% 70% at 12% 8%, rgba(143,123,255,0.55), transparent 65%), radial-gradient(50% 60% at 92% 18%, rgba(63,224,239,0.35), transparent 70%), radial-gradient(55% 60% at 60% 110%, rgba(83,56,232,0.4), transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black, transparent 78%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={profile.photo.avatar}
              width={400}
              height={400}
              alt=""
              className="size-14 rounded-2xl object-cover ring-1 ring-white/20"
            />
            <div>
              <p className="font-mono text-[13px] uppercase tracking-[0.32em] text-white/60">
                Portfolio
              </p>
              <p className="text-[15px] font-medium text-white/85">Damascus, Syria</p>
            </div>
          </div>
          <span className="rounded-full border border-white/15 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.22em] text-white/60">
            {site.url.replace(/^https?:\/\//, "")}
          </span>
        </div>

        <div>
          <p className="font-mono text-[14px] uppercase tracking-[0.3em] text-[#3fe0ef]">
            Full-Stack JavaScript Developer
          </p>
          <h1 className="mt-5 font-display text-[86px] font-extrabold leading-[0.95] tracking-[-0.04em]">
            Mahmoud
            <br />
            <span className="bg-gradient-to-r from-white via-[#b7aaff] to-[#3fe0ef] bg-clip-text text-transparent">
              Abulail
            </span>
          </h1>
          <p className="mt-5 max-w-[760px] text-[20px] leading-relaxed text-white/65">
            React · Next.js · Node.js · React Native — server-rendered, bilingual
            products built end to end.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {["React", "Node.js", "React Native", "MongoDB", "SSR / SEO"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-white/70"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
