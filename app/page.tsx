"use client"

import type React from "react"
import { useState, useMemo } from "react"
import type { BacaoResult } from "@/lib/types"
import { ProductCarousel } from "@/components/product-carousel"
import { EditorPick } from "@/components/editor-pick"
import { Slider } from "@/components/ui/slider"
import { Sparkles, Search, Loader2, SlidersHorizontal } from "lucide-react"

const SUGGESTIONS = ["敏感肌防晒", "平价通勤背包", "学生党护眼台灯", "油皮夏季粉底液", "千元降噪耳机"]

const PRICE_MIN = 0
const PRICE_MAX = 2000

export default function Page() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BacaoResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX])

  async function generate(q: string) {
    const trimmed = q.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.log("[v0] 接口返回错误:", data)
        throw new Error(data.detail || data.error || "生成失败")
      }
      const data: BacaoResult = await res.json()
      setResult(data)
      setPriceRange([PRICE_MIN, PRICE_MAX])
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后再试")
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    generate(query)
  }

  const filteredProducts = useMemo(() => {
    if (!result) return []
    return result.products.filter(
      (p) => p.priceHigh >= priceRange[0] && p.priceLow <= priceRange[1],
    )
  }, [result, priceRange])

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-16 pt-8 sm:pt-12">
      {/* Header */}
      <header className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Sparkles className="size-6" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">拔草卡</h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          输入购物需求，AI 帮你对比候选、识破恰饭，理性拔草不踩雷
        </p>
      </header>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-primary">
          <Search className="ml-2 size-5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="如：敏感肌防晒、平价通勤背包…"
            aria-label="购物需求"
            className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              正在生成拔草卡…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              生成拔草卡
            </>
          )}
        </button>
      </form>

      {/* Suggestions */}
      {!result && !loading && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuery(s)
                generate(s)
              }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-primary hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-6 rounded-2xl bg-accent px-4 py-3 text-center text-sm text-accent-foreground" role="alert">
          {error}
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-8 flex flex-col gap-4" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl border border-border bg-card" />
          ))}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-bold text-foreground">
              {result.category}
              <span className="ml-2 text-sm font-normal text-muted-foreground">候选清单</span>
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
          </div>

          {/* Price range slider */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <SlidersHorizontal className="size-4 text-primary" />
                价格范围
              </span>
              <span className="text-sm font-bold text-primary">
                ¥{priceRange[0]} - ¥{priceRange[1]}
                {priceRange[1] === PRICE_MAX ? "+" : ""}
              </span>
            </div>
            <Slider
              value={priceRange}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={50}
              onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
              aria-label="价格范围"
            />
          </div>

          {filteredProducts.length > 0 ? (
            <ProductCarousel key={`${result.category}-${priceRange[0]}-${priceRange[1]}`} products={filteredProducts} />
          ) : (
            <p className="rounded-2xl bg-accent px-4 py-6 text-center text-sm text-accent-foreground">
              该价格范围内没有候选产品，试试拉宽价格区间～
            </p>
          )}

          <EditorPick pick={result.editorPick} />

          <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
            内容由 AI 生成，仅供参考，请结合实际情况理性决策
          </p>
        </div>
      )}
    </main>
  )
}
