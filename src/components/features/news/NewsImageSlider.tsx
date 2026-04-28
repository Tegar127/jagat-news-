"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NewsImageSliderProps {
  images: { id: string; url: string }[]
  title: string
}

export function NewsImageSlider({ images, title }: NewsImageSliderProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  if (images.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground">Tidak ada gambar</span>
      </div>
    )
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative h-full w-full">
      <Image src={images[activeIndex].url} alt={`${title} - gambar ${activeIndex + 1}`} fill priority className="object-cover" />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/60"
            aria-label="Gambar sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/60"
            aria-label="Gambar berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id ?? index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Pilih gambar ${index + 1}`}
                className={`h-2 w-2 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/55"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
