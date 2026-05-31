export function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-arcade-black"
    >
      <div className="animated-arcade-gradient absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(94,210,156,0.16),transparent_32%),radial-gradient(circle_at_18%_35%,rgba(6,182,212,0.12),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.24),rgba(7,11,10,0.95)_78%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,10,0.88)_0%,rgba(7,11,10,0.36)_44%,rgba(7,11,10,0.82)_100%)]" />

      <div className="hidden lg:block">
        <div className="absolute inset-y-0 left-1/4 w-px bg-white/10" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-white/10" />
      </div>

      <svg
        className="absolute left-1/2 top-[-150px] h-[430px] w-[780px] -translate-x-1/2 opacity-80"
        viewBox="0 0 780 430"
        role="presentation"
      >
        <defs>
          <filter
            id="monitorGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="46" />
          </filter>
          <linearGradient id="monitorGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.55" />
            <stop offset="54%" stopColor="#5ed29c" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <ellipse
          cx="390"
          cy="210"
          rx="260"
          ry="82"
          fill="url(#monitorGradient)"
          filter="url(#monitorGlow)"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-arcade-black via-arcade-black/72 to-transparent" />
    </div>
  )
}
