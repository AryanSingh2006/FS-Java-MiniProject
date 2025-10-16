export function NewsletterHero() {
  return (
    <section
      role="region"
      aria-label="Newsletter sign-up"
      className="relative isolate w-full mt-10"
      style={{ background: "var(--bg)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-100 rounded-t-3xl "
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/af/36/45/af36457841bb931e3d1b3f32ef6979e6.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-28 text-center">
        {/* Headline */}
        <h1
          className="font-serif text-balance text-6xl leading-relaxed md:text-6xl text-black"
        >
          Discover the next big thing
        </h1>

        {/* Subhead */}
        <p className="mt-4 text-pretty text-[16px] md:text-[17px]" style={{ color: "var(--muted)" }}>
          Backer.News already 3,251 projects featured – don&apos;t miss out!
        </p>
      </div>
    </section>
  )
}

export default NewsletterHero
