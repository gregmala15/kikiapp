const base = import.meta.env.BASE_URL;

export default function Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <img
        src={`${base}hero-vintage.png`}
        crossOrigin="anonymous"
        alt="Editorial vintage fashion"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.85)] via-[rgba(26,26,26,0.35)] to-[rgba(26,26,26,0.55)]" />

      <div className="absolute top-[6vh] left-[6vw] flex items-center gap-[1vw]">
        <span className="block w-[2.4vw] h-[0.18vh] bg-accent" />
        <span className="font-body text-[1.3vw] tracking-[0.4em] uppercase text-bg/90">
          Final Year Project
        </span>
      </div>

      <div className="absolute bottom-[12vh] left-[6vw] right-[6vw] flex flex-col">
        <h1 className="font-display font-bold text-[14vw] leading-[0.92] tracking-tight text-bg">
          RELIQ
        </h1>
        <p className="font-display italic text-[2.6vw] leading-tight text-bg/95 mt-[2vh] max-w-[60vw]">
          A discovery-first vintage marketplace.
        </p>
      </div>

      <div className="absolute bottom-[6vh] right-[6vw] text-right">
        <p className="font-body text-[1.2vw] tracking-[0.25em] uppercase text-bg/70">
          Independent fashion · Vintage finds
        </p>
      </div>
    </div>
  );
}
