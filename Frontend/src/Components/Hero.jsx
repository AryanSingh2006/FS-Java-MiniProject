import { useState } from "react"
import { Check } from "lucide-react"
import { Link } from "react-router";

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

      <img src="https://i.postimg.cc/RCdp8Q77/Chat-GPT-Image-Oct-16-2025-09-47-38-PM-Photoroom.png" alt="" className="object-cover w-[900px] -translate-y-16 h-[550px] " />

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
        <h4 className="font-serif text-4xl md:text-5xl lg:text-7xl font-medium text-dark-gray leading-tight text-balance">
          Collaborate on Research. Simplified.
        </h4>
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          A hub for sharing, editing, and versioning research papers with your team.
        </p>
      </div>

      {/* Email Signup Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-4">
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            to='/register'
            className="flex-1 font-medium text-lg px-4 py-3 md:py-4 rounded-full border-2 border-black/20 bg-white text-dark-gray placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-green-accent focus:ring-offset-2 transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <h1 className="ml-48">
              Get Started
            </h1>
          </Link>
          <Link
            to='/login'
            className="px-8 md:px-12 py-3 md:py-4 bg-black text-white font-medium rounded-full hover:bg-green-accent-dark transition-all duration-200 whitespace-nowrap hover:scale-105 cursor-pointer"
          >
            <h1 className="mt-1 text-base">
              Login
            </h1>

          </Link>
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
