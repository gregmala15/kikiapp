export default function Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-text flex flex-col">
      <div className="px-[6vw] pt-[8vh]">
        <div className="flex items-center gap-[1vw] mb-[3vh]">
          <span className="block w-[2.4vw] h-[0.18vh] bg-accent" />
          <span className="font-body text-[1.2vw] tracking-[0.35em] uppercase text-bg/60">
            The Solution
          </span>
        </div>
        <h2 className="font-display font-bold text-[4.8vw] leading-[1.02] tracking-tight text-bg max-w-[70vw] text-balance">
          Reliq is built for
          <span className="italic font-normal text-accent"> exploratory</span>{" "}
          shopping.
        </h2>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-[1.6vw] px-[6vw] pt-[7vh] pb-[8vh]">
        <div className="flex flex-col h-full border-t-[0.3vh] border-accent pt-[2.5vh]">
          <p className="font-display text-[2vw] leading-none text-accent">01</p>
          <p className="font-display font-bold text-[2.2vw] leading-tight text-bg mt-[3vh]">
            Shopping Persona
          </p>
          <p className="font-body text-[1.4vw] leading-relaxed text-bg/70 mt-[2vh]">
            A short onboarding sets your taste vocabulary, used to seed the
            feed.
          </p>
        </div>

        <div className="flex flex-col h-full border-t-[0.3vh] border-accent pt-[2.5vh]">
          <p className="font-display text-[2vw] leading-none text-accent">02</p>
          <p className="font-display font-bold text-[2.2vw] leading-tight text-bg mt-[3vh]">
            Style Influence
          </p>
          <p className="font-body text-[1.4vw] leading-relaxed text-bg/70 mt-[2vh]">
            Borrow another shopper&rsquo;s taste at five strengths &mdash; off
            to heavy.
          </p>
        </div>

        <div className="flex flex-col h-full border-t-[0.3vh] border-accent pt-[2.5vh]">
          <p className="font-display text-[2vw] leading-none text-accent">03</p>
          <p className="font-display font-bold text-[2.2vw] leading-tight text-bg mt-[3vh]">
            Hidden Gems
          </p>
          <p className="font-body text-[1.4vw] leading-relaxed text-bg/70 mt-[2vh]">
            A counter-feed of low-visibility pieces from independent shops.
          </p>
        </div>

        <div className="flex flex-col h-full border-t-[0.3vh] border-accent pt-[2.5vh]">
          <p className="font-display text-[2vw] leading-none text-accent">04</p>
          <p className="font-display font-bold text-[2.2vw] leading-tight text-bg mt-[3vh]">
            Shop Rack Browsing
          </p>
          <p className="font-body text-[1.4vw] leading-relaxed text-bg/70 mt-[2vh]">
            Walk a shop&rsquo;s full rack the way you would in person.
          </p>
        </div>
      </div>
    </div>
  );
}
