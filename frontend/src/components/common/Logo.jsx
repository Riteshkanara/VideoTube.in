// Logo.jsx — Custom SVG mark + wordmark
// Place this in: src/components/common/Logo.jsx

const SIZES = {
  sm: { icon: 28, font: 16, gap: 8 },
  md: { icon: 34, font: 19, gap: 9 },
  lg: { icon: 40, font: 22, gap: 10 },
  xl: { icon: 52, font: 28, gap: 12 },
};

function PlayMark({ pixel, glow }) {
  return (
    <svg
      width={pixel}
      height={pixel}
      viewBox="0 0 40 40"
      style={{ display: 'block', filter: glow ? 'drop-shadow(0 2px 10px rgba(232,25,44,0.45))' : 'none' }}
    >
      <defs>
        <linearGradient id="vtGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff2d3d" />
          <stop offset="100%" stopColor="#c8102e" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#vtGrad)" />
      <rect x="1" y="1" width="38" height="38" rx="11" fill="white" fillOpacity="0.06" />
      <path d="M16.5 13.2c0-1.1 1.2-1.78 2.16-1.22l10.4 6.1c.95.56.95 1.94 0 2.5l-10.4 6.1c-.96.56-2.16-.12-2.16-1.22V13.2z" fill="#fff" />
    </svg>
  );
}

export default function Logo({ variant = 'default', size = 'md', showText = true }) {
  const cfg = SIZES[size] || SIZES.md;
  const glow = variant === 'premium' || variant === 'neon' || variant === 'animated';
  const iconOnly = variant === 'minimal' || showText === false;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: cfg.gap,
        cursor: 'pointer',
      }}
    >
      <PlayMark pixel={cfg.icon} glow={glow} />

      {!iconOnly && (
        <span
          style={{
            fontSize: cfg.font,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#fff',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Video<span style={{ color: '#e8192c' }}>Tube</span>
        </span>
      )}
    </div>
  );
}

// Usage:
// <Logo variant="premium" size="lg" />       -> mark + wordmark, subtle glow
// <Logo variant="minimal" size="sm" />        -> mark only
// <Logo size="md" showText={false} />         -> mark only, any variant
