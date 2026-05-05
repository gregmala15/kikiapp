export default function Existing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg flex flex-col">
      <div className="px-[6vw] pt-[8vh]">
        <div className="flex items-center gap-[1vw] mb-[3vh]">
          <span className="block w-[2.4vw] h-[0.18vh] bg-accent" />
          <span className="font-body text-[1.2vw] tracking-[0.35em] uppercase text-muted">
            Existing Platforms
          </span>
        </div>
        <h2 className="font-display font-bold text-[4.6vw] leading-[1.02] tracking-tight text-text max-w-[68vw] text-balance">
          Built for search and resale,
          <span className="italic font-normal"> not for browsing.</span>
        </h2>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-[2vw] px-[6vw] pt-[8vh] pb-[10vh]">
        <div className="bg-card p-[3vw] flex flex-col h-full border-t-[0.3vh] border-text/15">
          <p className="font-display text-[3vw] leading-none text-text">Vinted</p>
          <p className="font-body text-[1.2vw] tracking-[0.3em] uppercase text-muted mt-[1.5vh]">
            Peer Resale
          </p>
          <div className="flex-1" />
          <p className="font-body text-[1.55vw] leading-relaxed text-text">
            Search-led. Cheapest-first listings. No editorial point of view.
          </p>
        </div>

        <div className="bg-card p-[3vw] flex flex-col h-full border-t-[0.3vh] border-accent">
          <p className="font-display text-[3vw] leading-none text-text">Depop</p>
          <p className="font-body text-[1.2vw] tracking-[0.3em] uppercase text-muted mt-[1.5vh]">
            Engagement Feed
          </p>
          <div className="flex-1" />
          <p className="font-body text-[1.55vw] leading-relaxed text-text">
            Optimised for follows and likes. Surfaces the same viral pieces.
          </p>
        </div>

        <div className="bg-card p-[3vw] flex flex-col h-full border-t-[0.3vh] border-text/15">
          <p className="font-display text-[3vw] leading-none text-text">Etsy</p>
          <p className="font-body text-[1.2vw] tracking-[0.3em] uppercase text-muted mt-[1.5vh]">
            Marketplace
          </p>
          <div className="flex-1" />
          <p className="font-body text-[1.55vw] leading-relaxed text-text">
            Vast catalogue, keyword-driven. Discovery requires knowing what to
            type.
          </p>
        </div>
      </div>
    </div>
  );
}
