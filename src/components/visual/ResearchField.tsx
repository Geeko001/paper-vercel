/**
 * Abstract mathematical line-field — topographic / wireframe data landscape.
 * Pure SVG, paths precomputed once at build time (server component: zero
 * client JS, no hydration cost).
 */
function buildFieldLines(): string[] {
  const rows = 28;
  const cols = 90;
  const paths: string[] = [];
  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1);
    let d = "";
    for (let c = 0; c <= cols; c++) {
      const x = (c / cols) * 800;
      const ridge =
        Math.sin(c * 0.11 + r * 0.35) * 22 * Math.sin(t * Math.PI) +
        Math.sin(c * 0.031 - r * 0.12) * 46 +
        Math.exp(-Math.pow((c / cols - 0.62) / 0.16, 2)) * -86 * Math.sin(t * 2.4 + 0.6) +
        Math.exp(-Math.pow((c / cols - 0.35) / 0.22, 2)) * -40 * Math.sin(t * 1.8);
      const y = 40 + t * 300 + ridge * (0.35 + t * 0.9);
      d += `${c === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
    }
    paths.push(d);
  }
  return paths;
}

const FIELD_LINES = buildFieldLines();

export function ResearchField({ className = "" }: { className?: string }) {

  return (
    <svg
      viewBox="0 0 800 360"
      role="img"
      aria-label="Abstract topographic research visualization"
      className={`research-field h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111315" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#111315" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#111315" stopOpacity="0.12" />
        </linearGradient>
        <mask id="soft">
          <rect x="0" y="0" width="800" height="360" fill="url(#fadeMask)" />
        </mask>
        <linearGradient id="fadeMask" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="25%" stopColor="black" stopOpacity="1" />
          <stop offset="100%" stopColor="black" stopOpacity="1" />
        </linearGradient>
      </defs>
      <g mask="url(#soft)" fill="none" stroke="url(#fade)" strokeWidth="0.9">
        {FIELD_LINES.map((d, i) => (
          <path key={i} d={d} opacity={0.28 + (i / FIELD_LINES.length) * 0.6} />
        ))}
      </g>
    </svg>
  );
}

export function MountainLines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 300"
      aria-hidden="true"
      className={`h-full w-full ${className}`}
      preserveAspectRatio="xMidYMax slice"
    >
      <g fill="none" stroke="#111315" strokeWidth="0.8" opacity="0.22">
        {Array.from({ length: 18 }).map((_, r) => {
          const base = 250 - r * 9;
          return (
            <path
              key={r}
              d={`M80,${base} L260,${base - 90 + r * 3} L360,${base - 30} L470,${base - 120 + r * 2} L620,${base - 20} L730,${base - 60}`}
              opacity={0.35 + (r / 18) * 0.65}
            />
          );
        })}
      </g>
    </svg>
  );
}
