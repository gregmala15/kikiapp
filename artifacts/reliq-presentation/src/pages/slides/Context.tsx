const base = import.meta.env.BASE_URL;

export default function Context() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg flex">
      <div className="w-[48vw] h-full relative overflow-hidden">
        <img
          src={`${base}context-stilllife.png`}
          crossOrigin="anonymous"
          alt="Curated vintage objects"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center px-[6vw]">
        <div className="flex items-center gap-[1vw] mb-[3vh]">
          <span className="block w-[2.4vw] h-[0.18vh] bg-accent" />
          <span className="font-body text-[1.2vw] tracking-[0.35em] uppercase text-muted">
            Context
          </span>
        </div>

        <h2 className="font-display font-bold text-[5.2vw] leading-[1.02] tracking-tight text-text text-balance">
          Vintage shopping is about discovery,
          <span className="italic font-normal text-accent"> not search.</span>
        </h2>

        <p className="font-body text-[1.7vw] leading-relaxed text-muted mt-[5vh] max-w-[36vw]">
          People wander racks, follow taste, and find pieces they didn&rsquo;t
          know they wanted. The internet flattened that ritual into a query box.
        </p>
      </div>
    </div>
  );
}
