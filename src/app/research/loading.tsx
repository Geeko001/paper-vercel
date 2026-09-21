export default function ResearchLoading() {
  return (
    <div
      className="anim-fade mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6"
      aria-label="Loading writing"
    >
      <div className="shimmer h-3 w-24 rounded" />
      <div className="shimmer mt-3 h-12 w-2/3 rounded" />
      <div className="mt-8 space-y-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="anim-rise space-y-2 border-b rule pb-6"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="shimmer h-3 w-16 rounded" />
            <div className="shimmer h-5 w-3/4 rounded" />
            <div className="shimmer h-4 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
