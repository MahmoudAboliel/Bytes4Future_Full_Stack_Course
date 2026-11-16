import type { ProjectArt as ProjectArtType } from "~/data/types";
import { cn } from "~/lib/utils";

/**
 * Project covers are drawn with CSS + SVG instead of bitmap images:
 * they stay sharp on every screen, weigh nothing and adapt to both themes.
 */
export function ProjectArt({
  variant,
  className,
}: {
  variant: ProjectArtType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-bg-elev",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/12 via-transparent to-accent-2/14" />
      <div className="absolute inset-0 bg-dots opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/45 via-transparent to-transparent" />
      <div className="absolute inset-0 grid place-items-center p-6 sm:p-10">
        {variant === "seats" && <SeatsArt />}
        {variant === "map" && <MapArt />}
        {variant === "cloud" && <CloudArt />}
        {variant === "school" && <SchoolArt />}
        {variant === "panels" && <PanelsArt />}
      </div>
    </div>
  );
}

const rows = [0, 1, 2, 3, 4, 5];
const seats = [
  { x: 58, c: 0 },
  { x: 84, c: 1 },
  { x: 196, c: 2 },
];

function SeatsArt() {
  return (
    <svg viewBox="0 0 280 220" className="h-full w-full max-w-[340px]">
      <defs>
        <linearGradient id="seatFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* cabin */}
      <rect
        x="28"
        y="16"
        width="224"
        height="192"
        rx="26"
        fill="var(--bg)"
        fillOpacity="0.55"
        stroke="var(--line-strong)"
        strokeWidth="1.2"
      />

      {/* windshield */}
      <path
        d="M48 40c0-8 6-14 14-14h156c8 0 14 6 14 14"
        fill="none"
        stroke="var(--line-strong)"
        strokeWidth="1.2"
        strokeDasharray="3 5"
      />

      {/* driver */}
      <g transform="translate(214 34)">
        <circle r="10" fill="none" stroke="var(--line-strong)" strokeWidth="1.4" />
        <circle r="4" fill="var(--accent)" fillOpacity="0.85" />
        <path d="M-10 0h20" stroke="var(--line-strong)" strokeWidth="1.4" />
      </g>

      {/* aisle */}
      <path
        d="M158 52v142"
        stroke="var(--line-strong)"
        strokeWidth="1"
        strokeDasharray="2 8"
      />

      {rows.map((row) =>
        seats.map((seat) => {
          const taken = (row * 3 + seat.c) % 4 === 0;
          const selected = (row * 5 + seat.c) % 11 === 0;
          const y = 58 + row * 24;
          return (
            <g key={`${row}-${seat.c}`}>
              <rect
                x={seat.x}
                y={y}
                width="22"
                height="16"
                rx="5"
                fill={taken ? "url(#seatFill)" : "var(--bg)"}
                stroke={taken ? "transparent" : "var(--line-strong)"}
                strokeWidth="1.2"
                opacity={taken ? 0.9 : 0.85}
              />
              {selected && (
                <rect
                  x={seat.x - 3}
                  y={y - 3}
                  width="28"
                  height="22"
                  rx="7"
                  fill="none"
                  stroke="var(--accent-2)"
                  strokeWidth="1.4"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          );
        }),
      )}

      <text
        x="140"
        y="204"
        textAnchor="middle"
        fill="var(--muted)"
        fontSize="8"
        fontFamily="var(--font-mono)"
        letterSpacing="1.6"
      >
        2 + 1 · 45 SEATS
      </text>
    </svg>
  );
}

function MapArt() {
  return (
    <svg viewBox="0 0 300 210" className="h-full w-full max-w-[360px]">
      <g stroke="var(--line-strong)" strokeWidth="0.8" opacity="0.55">
        <path d="M0 60h300M0 130h300M70 0v210M180 0v210M245 0v210" />
      </g>

      <g fill="var(--bg)" fillOpacity="0.6" stroke="var(--line-strong)" strokeWidth="0.9">
        <rect x="86" y="72" width="60" height="42" rx="5" />
        <rect x="196" y="76" width="70" height="34" rx="5" />
        <rect x="100" y="146" width="46" height="38" rx="5" />
        <rect x="212" y="150" width="52" height="30" rx="5" />
      </g>

      <path
        d="M44 178c34-4 44-40 74-42 26-2 34 22 58 12 20-8 28-38 62-48"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />

      {[
        { x: 44, y: 178, strong: true },
        { x: 238, y: 100, strong: false },
      ].map((pin, index) => (
        <g key={index} transform={`translate(${pin.x} ${pin.y})`}>
          <circle r="16" fill="var(--accent)" fillOpacity="0.1" />
          <circle
            r="9"
            fill={pin.strong ? "var(--accent)" : "var(--accent-2)"}
            fillOpacity="0.9"
          />
          <circle r="3" fill="var(--bg)" />
        </g>
      ))}

      <g transform="translate(150 96)">
        <circle r="26" fill="none" stroke="var(--accent-2)" strokeWidth="1" strokeOpacity="0.5" />
        <circle r="17" fill="none" stroke="var(--accent-2)" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M-6 0h12M0-6v12" stroke="var(--accent-2)" strokeWidth="1.2" />
      </g>

      <text
        x="150"
        y="204"
        textAnchor="middle"
        fill="var(--muted)"
        fontSize="8"
        fontFamily="var(--font-mono)"
        letterSpacing="1.6"
      >
        LIVE · POSTGIS
      </text>
    </svg>
  );
}

function CloudArt() {
  return (
    <svg viewBox="0 0 300 210" className="h-full w-full max-w-[360px]">
      <desc>Stacked browser windows</desc>
      {[
        { x: 40, y: 118, w: 180, h: 60, o: 0.35 },
        { x: 56, y: 94, w: 180, h: 60, o: 0.55 },
        { x: 72, y: 62, w: 180, h: 74, o: 0.95 },
      ].map((win, index) => (
        <g key={index} opacity={win.o}>
          <rect
            x={win.x}
            y={win.y}
            width={win.w}
            height={win.h}
            rx="10"
            fill="var(--bg)"
            stroke="var(--line-strong)"
            strokeWidth="1.1"
          />
          <path
            d={`M${win.x} ${win.y + 16}h${win.w}`}
            stroke="var(--line-strong)"
            strokeWidth="1"
          />
          <circle cx={win.x + 12} cy={win.y + 8} r="2.2" fill="var(--accent)" />
          <circle cx={win.x + 20} cy={win.y + 8} r="2.2" fill="var(--muted)" fillOpacity="0.6" />
          <circle cx={win.x + 28} cy={win.y + 8} r="2.2" fill="var(--muted)" fillOpacity="0.4" />
          {index === 2 && (
            <>
              <rect x={win.x + 16} y={win.y + 30} width="92" height="7" rx="3.5" fill="var(--accent)" fillOpacity="0.7" />
              <rect x={win.x + 16} y={win.y + 45} width="140" height="5" rx="2.5" fill="var(--muted)" fillOpacity="0.35" />
              <rect x={win.x + 16} y={win.y + 56} width="112" height="5" rx="2.5" fill="var(--muted)" fillOpacity="0.25" />
            </>
          )}
        </g>
      ))}

      <g transform="translate(238 44)" stroke="var(--accent-2)" fill="none" strokeWidth="1.6">
        <path d="M-11 6a7 7 0 0 1 1-14 9 9 0 0 1 17-2 6 6 0 0 1 0 12H-6" strokeLinejoin="round" />
      </g>

      <text
        x="150"
        y="200"
        textAnchor="middle"
        fill="var(--muted)"
        fontSize="8"
        fontFamily="var(--font-mono)"
        letterSpacing="1.6"
      >
        SSR · EDGE READY
      </text>
    </svg>
  );
}

function SchoolArt() {
  return (
    <svg viewBox="0 0 300 210" className="h-full w-full max-w-[360px]">
      <g>
        <rect x="52" y="44" width="196" height="128" rx="14" fill="var(--bg)" fillOpacity="0.85" stroke="var(--line-strong)" />
        <path d="M52 68h196" stroke="var(--line-strong)" />
        <circle cx="70" cy="56" r="3" fill="var(--accent)" />
        <rect x="80" y="54" width="46" height="4" rx="2" fill="var(--muted)" fillOpacity="0.4" />

        {[0, 1, 2, 3].map((row) => (
          <g key={row} transform={`translate(0 ${82 + row * 22})`}>
            <circle cx="72" cy="0" r="6.5" fill="var(--accent)" fillOpacity={0.18 + row * 0.08} />
            <rect x="88" y="-3" width={82 - row * 8} height="6" rx="3" fill="var(--muted)" fillOpacity="0.28" />
            <rect x="186" y="-6" width="24" height="12" rx="6" fill="var(--accent-2)" fillOpacity={row === 1 ? 0.85 : 0.28} />
            <rect x="218" y="-6" width="20" height="12" rx="6" fill="var(--accent)" fillOpacity={row === 2 ? 0.8 : 0.2} />
          </g>
        ))}
      </g>

      <g transform="translate(230 32)" stroke="var(--accent-2)" strokeWidth="1.5" fill="none">
        <path d="m-16 0 16-8 16 8-16 8-16-8Z" strokeLinejoin="round" />
        <path d="M-8 4v6c0 2 4 4 8 4s8-2 8-4V4" />
      </g>

      <text
        x="150"
        y="198"
        textAnchor="middle"
        fill="var(--muted)"
        fontSize="8"
        fontFamily="var(--font-mono)"
        letterSpacing="1.6"
      >
        ROLES · PERMISSIONS
      </text>
    </svg>
  );
}

function PanelsArt() {
  return (
    <svg viewBox="0 0 300 210" className="h-full w-full max-w-[360px]">
      <rect x="36" y="38" width="182" height="120" rx="12" fill="var(--bg)" stroke="var(--line-strong)" />
      <path d="M36 56h182" stroke="var(--line-strong)" />
      <circle cx="50" cy="47" r="2.4" fill="var(--accent)" />
      <circle cx="58" cy="47" r="2.4" fill="var(--muted)" fillOpacity="0.5" />
      <circle cx="66" cy="47" r="2.4" fill="var(--muted)" fillOpacity="0.3" />

      <rect x="48" y="68" width="52" height="6" rx="3" fill="var(--accent)" fillOpacity="0.75" />
      <rect x="48" y="82" width="160" height="4" rx="2" fill="var(--muted)" fillOpacity="0.3" />
      <rect x="48" y="92" width="132" height="4" rx="2" fill="var(--muted)" fillOpacity="0.22" />

      <rect x="48" y="110" width="48" height="36" rx="7" fill="var(--accent)" fillOpacity="0.12" stroke="var(--accent)" strokeOpacity="0.35" />
      <rect x="104" y="110" width="48" height="36" rx="7" fill="var(--bg)" stroke="var(--line-strong)" />
      <rect x="160" y="110" width="48" height="36" rx="7" fill="var(--bg)" stroke="var(--line-strong)" />

      {/* phone */}
      <g transform="translate(196 96)">
        <rect width="72" height="104" rx="14" fill="var(--bg)" stroke="var(--line-strong)" strokeWidth="1.2" />
        <rect x="6" y="7" width="60" height="90" rx="10" fill="var(--bg-elev)" stroke="var(--line)" />
        <rect x="14" y="18" width="30" height="5" rx="2.5" fill="var(--accent)" fillOpacity="0.8" />
        <rect x="14" y="30" width="44" height="3.5" rx="1.75" fill="var(--muted)" fillOpacity="0.35" />
        <rect x="14" y="44" width="44" height="26" rx="5" fill="var(--accent-2)" fillOpacity="0.16" />
        <rect x="14" y="78" width="44" height="10" rx="5" fill="var(--fg)" fillOpacity="0.85" />
        <rect x="28" y="97" width="16" height="2.5" rx="1.25" fill="var(--muted)" fillOpacity="0.5" />
      </g>

      <text
        x="150"
        y="200"
        textAnchor="middle"
        fill="var(--muted)"
        fontSize="8"
        fontFamily="var(--font-mono)"
        letterSpacing="1.6"
      >
        SSR · RTL · DARK MODE
      </text>
    </svg>
  );
}
