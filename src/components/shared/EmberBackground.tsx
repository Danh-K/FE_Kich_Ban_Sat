function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

const PARTICLE_COUNT = 55;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const duration = 15 + seededRandom(i * 3 + 3) * 10;
  const flickerDuration = 1.2 + seededRandom(i * 11 + 17) * 1.6;
  return {
    left: seededRandom(i * 3 + 1) * 100,
    drift: (seededRandom(i * 3 + 2) - 0.5) * 40,
    duration,
    // negative delay starts each particle mid-flight so the very first paint
    // already looks staggered instead of every ember appearing in sync
    delay: seededRandom(i * 7 + 11) * duration * -1,
    flickerDuration,
    flickerDelay: seededRandom(i * 13 + 19) * flickerDuration * -1,
    size: 2 + seededRandom(i * 5 + 13) * 3.5,
  };
});

export function EmberBackground() {
  return (
    <div
      id="ember-layer"
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="ember-particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s, ${p.flickerDuration}s`,
            animationDelay: `${p.delay}s, ${p.flickerDelay}s`,
            ["--ember-drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
