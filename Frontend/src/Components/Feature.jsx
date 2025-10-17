export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: "Just Launched",
      description: "Get alerts on the next trending projects while early bird rewards are still up for grabs.",
      icon: "https://i.pinimg.com/1200x/68/c5/08/68c508d9026bf3036bab16f7c6239b19.jpg",
    },
    {
      id: 2,
      title: "Exciting News",
      description: "Crowdfunding project creators share insights and post campaign secrets stories.",
      icon: "https://i.pinimg.com/736x/40/ee/d1/40eed1976d0bf3adf766d1f7c8203a53.jpg",
    },
    {
      id: 3,
      title: "Insider Stories",
      description: "Cultivated updates on the projects that are about to rock, before time runs out.",
      icon: "https://i.pinimg.com/1200x/53/c3/60/53c36003e19cabb700b8803a4dbb92ec.jpg",
    },
    {
      id: 4,
      title: "Exclusive Freebies",
      description: "Get a complimentary extra special freebies when pledging to our featured projects.",
      icon: "https://i.pinimg.com/736x/71/fd/b9/71fdb947ffd6d89701bfca1db24ab378.jpg",
    },
  ]

  return (
    <section className="w-full bg-white px-4 py-12 md:py-16 lg:py-20 -translate-y-32">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-6xl font-normal leading-tight text-[#111111]">
            Exclusive <em className="italic">features</em> for the next
            <br />
            groundbreaking <em className="italic">project.</em>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {features.map((feature) => (
            <article key={feature.id} className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="mb-4 flex h-20 w-20 items-center justify-center md:h-16 md:w-16 lg:h-80 lg:w-80">
                <img
                  src={feature.icon}
                  alt={`${feature.title} icon`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="mb-3 font-sans text-sm font-bold uppercase tracking-wide text-[#111111] md:text-xs lg:text-sm">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-xs leading-relaxed text-[#666666] md:text-xs lg:text-sm max-w-xs">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
