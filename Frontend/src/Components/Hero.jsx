import { useState } from "react"
import { Check } from "lucide-react"

function BookIcon() {
  return (
    <img
      src="https://i.postimg.cc/8CyVTQWR/image-Photoroom-8.png"
      className="object-cover h-28 w-28"
    />
  )
}

function IllustrationRow() {
  return (
    <div className="relative w-full flex justify-center px-4">
      
      <img src="https://i.postimg.cc/RCdp8Q77/Chat-GPT-Image-Oct-16-2025-09-47-38-PM-Photoroom.png" alt="" className="object-cover w-[900px] -translate-y-32 h-[550px] "  />
     
    </div>
  )
}

export default function HeroSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail("")
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  return (
    <main className="min-h-fit max-w-8xl mx-auto bg-cream flex flex-col items-center justify-center px-4 py-5">
      {/* Top Icon */}
      <div className="mb-8 md:mb-12">
        <BookIcon />
      </div>

      {/* Headline */}
      <div className="max-w-7xl text-center mb-8 md:mb-12">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-medium text-dark-gray leading-tight text-balance">
          A weekly digest of the <span className="italic font-serif">newest and greatest</span> crowdfunding projects
        </h1>
      </div>

      {/* Email Signup Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-4">
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 md:py-4 rounded-full border border-light-gray bg-white text-dark-gray placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-green-accent focus:ring-offset-2 transition-all"
          />
          <button
            type="submit"
            className="px-6 md:px-8 py-3 md:py-4 bg-black text-white font-medium rounded-full hover:bg-green-accent-dark transition-colors whitespace-nowrap"
          >
            {isSubmitted ? "Subscribed!" : "Subscribe"}
          </button>
        </div>
      </form>

      {/* Privacy Text */}
      <div className="flex items-center gap-2 text-xs text-muted-text max-w-2xl justify-center mb-12 md:mb-16">
        <Check size={14} className="flex-shrink-0" />
        <span>
          By subscribing you agree to{" "}
          <a href="#" className="underline hover:text-dark-gray transition-colors">
            Backer.News Privacy Policy
          </a>
        </span>
      </div>

      {/* Illustrations */}
      <div className="w-full">
        <IllustrationRow />
      </div>
    </main>
  )
}
