"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import type { Promo } from "@/types/promo"

interface PromoBannerProps {
  promos: Promo[]
}

export function PromoBanner({ promos }: PromoBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const nextSlide = React.useCallback(() => {
    if (promos.length > 0) {
      setCurrentIndex((prev) => (prev === promos.length - 1 ? 0 : prev + 1))
    }
  }, [promos.length])

  React.useEffect(() => {
    if (promos.length === 0) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide, promos.length])

  if (promos.length === 0) {
    return null
  }

  const currentSlide = promos[currentIndex]

  return (
    <section className="relative my-8 h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl shadow-blue-500/10 md:h-[450px] lg:h-[500px]">
      {promos.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={
              slide.imageUrl ||
              "https://placehold.co/1200x500/3B82F6/FFFFFF?text=Jagat+News"
            }
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent"></div>
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col items-start justify-center p-8 text-white md:p-12 lg:p-16 xl:p-24">
        <h2 className="mb-4 max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl animate-slide-up">
          {currentSlide.title}
        </h2>
        {currentSlide.subtitle && (
          <p className="mb-8 max-w-xl text-lg opacity-90 md:text-xl lg:text-2xl animate-fade-in-left">
            {currentSlide.subtitle}
          </p>
        )}
        <Link
          href={currentSlide.buttonLink || "#"}
          className="rounded-full bg-blue-600 px-8 py-3.5 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-500 hover:shadow-blue-500/50 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          {currentSlide.buttonText || "Baca Selengkapnya"}
        </Link>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? "w-8 bg-blue-500" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
