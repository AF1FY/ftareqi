/**
 * Subtle topographic / wavy dark-grey lines that flow across the page.
 * Rendered as a fixed, full-viewport SVG behind all content with a very
 * slow continuous pan. Lines are layered contour-style with low opacity.
 */
export function WavesBackground() {
  // Generate a family of horizontal contour-like wave paths.
  const lines = Array.from({ length: 16 });

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Radial accent glow anchored top-center */}
      <div
        className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />

      <svg
        className="animate-wave-pan absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 1440 1200"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="waveFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f3f46" stopOpacity="0" />
            <stop offset="45%" stopColor="#52525b" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3f3f46" stopOpacity="0" />
          </linearGradient>
        </defs>
        {lines.map((_, i) => {
          const y = 80 + i * 70;
          const amp = 26 + (i % 5) * 10;
          const phase = i * 40;
          const d = `M -100 ${y}
            C 260 ${y - amp + phase * 0.04}, 480 ${y + amp}, 720 ${y - amp * 0.6}
            S 1180 ${y + amp}, 1540 ${y - amp * 0.3}`;
          return (
            <path
              key={i}
              d={d}
              stroke="url(#waveFade)"
              strokeWidth="1"
              strokeOpacity={0.25 + (i % 4) * 0.06}
            />
          );
        })}
      </svg>

      {/* Vignette so edges fall into pure black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 40%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
