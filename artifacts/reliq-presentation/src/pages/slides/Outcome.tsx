const base = import.meta.env.BASE_URL;

export default function Outcome() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg flex">
      <div className="flex-1 flex flex-col justify-center px-[6vw]">
        <div className="flex items-center gap-[1vw] mb-[3vh]">
          <span className="block w-[2.4vw] h-[0.18vh] bg-accent" />
          <span className="font-body text-[1.2vw] tracking-[0.35em] uppercase text-muted">
            Evaluation &amp; Outcome
          </span>
        </div>

        <h2 className="font-display font-bold text-[4.6vw] leading-[1.02] tracking-tight text-text text-balance">
          Did discovery feel
          <span className="italic font-normal"> wider?</span>
        </h2>

        <div className="mt-[6vh] flex flex-col gap-[3vh] max-w-[40vw]">
          <div className="flex gap-[1.5vw]">
            <span className="font-display text-[1.8vw] text-accent leading-tight">
              &mdash;
            </span>
            <p className="font-body text-[1.55vw] leading-snug text-text">
              <span className="font-bold">Discovery breadth.</span> Variety of
              shops and styles surfaced per session.
            </p>
          </div>
          <div className="flex gap-[1.5vw]">
            <span className="font-display text-[1.8vw] text-accent leading-tight">
              &mdash;
            </span>
            <p className="font-body text-[1.55vw] leading-snug text-text">
              <span className="font-bold">Usability.</span> Clarity of the
              Persona and Influence controls in user testing.
            </p>
          </div>
          <div className="flex gap-[1.5vw]">
            <span className="font-display text-[1.8vw] text-accent leading-tight">
              &mdash;
            </span>
            <p className="font-body text-[1.55vw] leading-snug text-text">
              <span className="font-bold">Relevance.</span> Whether suggested
              pieces still felt personal, not random.
            </p>
          </div>
        </div>

        <p className="font-display italic text-[1.7vw] text-muted mt-[6vh] max-w-[36vw] leading-snug">
          More diverse finds for shoppers. More visibility for the small,
          independent shops the platform exists to serve.
        </p>
      </div>

      <div className="w-[42vw] h-full relative overflow-hidden">
        <img
          src={`${base}outcome-shop.png`}
          crossOrigin="anonymous"
          alt="Independent vintage boutique interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-bg/20" />
      </div>
    </div>
  );
}
