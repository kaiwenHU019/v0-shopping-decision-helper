"use client"

import { useState, useRef } from "react"
import type { ProductCard as ProductCardType } from "@/lib/types"
import { ProductCard } from "@/components/product-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ProductCarousel({ products }: { products: ProductCardType[] }) {
  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollTo(index: number) {
    const clamped = Math.max(0, Math.min(index, products.length - 1))
    const container = scrollRef.current
    if (!container) return
    const child = container.children[clamped] as HTMLElement | undefined
    if (child) {
      container.scrollTo({ left: child.offsetLeft - container.offsetLeft, behavior: "smooth" })
    }
    setActive(clamped)
  }

  function handleScroll() {
    const container = scrollRef.current
    if (!container) return
    const center = container.scrollLeft + container.clientWidth / 2
    let closest = 0
    let closestDist = Number.POSITIVE_INFINITY
    Array.from(container.children).forEach((child, i) => {
      const el = child as HTMLElement
      const childCenter = el.offsetLeft - container.offsetLeft + el.clientWidth / 2
      const dist = Math.abs(childCenter - center)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    setActive(closest)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          <span className="font-bold text-foreground">{active + 1}</span> / {products.length} · 左右滑动翻阅
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollTo(active - 1)}
            disabled={active === 0}
            aria-label="上一个"
            className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollTo(active + 1)}
            disabled={active === products.length - 1}
            aria-label="下一个"
            className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p, i) => (
          <div key={i} className="w-[88%] shrink-0 snap-center sm:w-[400px]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5">
        {products.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`跳转到第 ${i + 1} 个`}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-5 bg-primary" : "w-2 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
