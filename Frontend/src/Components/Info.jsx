// Helper function to combine class names safely
const cls = (...classes) => classes.filter(Boolean).join(" ")

// HeroSection component
export function HeroSection({ className }) {
  return (
    <section
      aria-labelledby="hero-title"
      className={cls("w-full h-[200px] -translate-y-24 ", className)}
    >
      {/* Main container with background and padding */}
      <div className="bg-lime-200 mx-auto max-w-8xl py-10  ">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-60 translate-x-60">
          
          {/* Left side: Text content */}
          <div className="md:w-5/12">
            <h1
              id="hero-title"
              className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-foreground)]"
            >
              Be the <em className="not-italic md:italic font-medium">first-in</em> on great crowdfunding projects
            </h1>

            <p className="mt-4 text-sm md:text-base leading-relaxed text-[var(--color-muted-foreground)] max-w-prose">
              We're a growing community of backers that love being the first-in on amazing crowdfunding projects.
            </p>
          </div>

          {/* Right side: Illustration image */}

          </div>
          
      </div>
              <img
                src="https://i.postimg.cc/KzpFDK5T/Chat-GPT-Image-Oct-16-2025-10-37-15-PM-Photoroom.png"
                alt="Illustration of a creator working with gadgets"
                className="relative -translate-y-[425px] translate-x-[1000px] w-[450px] object-cover"
              />
    </section>
  )
}

export default HeroSection
