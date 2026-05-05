const base = import.meta.env.BASE_URL;

export default function Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <img
        src={`${base}problem-grid.png`}
        crossOrigin="anonymous"
        alt="Repetitive grid of identical items"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(250,249,247,0.96)] via-[rgba(250,249,247,0.75)] to-[rgba(250,249,247,0.15)]" />

      <div className="relative z-10 h-full flex flex-col justify-center px-[6vw] max-w-[62vw]">
        <div className="flex items-center gap-[1vw] mb-[3vh]">
          <span className="block w-[2.4vw] h-[0.18vh] bg-accent" />
          <span className="font-body text-[1.2vw] tracking-[0.35em] uppercase text-muted">
            The Problem
          </span>
        </div>

        <h2 className="font-display font-bold text-[5vw] leading-[1.02] tracking-tight text-text text-balance">
          Online vintage feels
          <span className="italic font-normal"> repetitive,</span>
          <span className="italic font-normal"> narrow,</span>
          <span className="italic font-normal"> over&#8209;personalised.</span>
        </h2>

        <div className="mt-[6vh] grid grid-cols-3 gap-[2.5vw] max-w-[56vw]">
          <div>
            <p className="font-display text-[3.6vw] leading-none text-accent">01</p>
            <p className="font-body text-[1.5vw] leading-snug text-text mt-[1.5vh]">
              The same trending pieces, surfaced to everyone.
            </p>
          </div>
          <div>
            <p className="font-display text-[3.6vw] leading-none text-accent">02</p>
            <p className="font-body text-[1.5vw] leading-snug text-text mt-[1.5vh]">
              Algorithms collapse taste into a single lane.
            </p>
          </div>
          <div>
            <p className="font-display text-[3.6vw] leading-none text-accent">03</p>
            <p className="font-body text-[1.5vw] leading-snug text-text mt-[1.5vh]">
              Independent shops disappear behind keywords.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
