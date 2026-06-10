import type { ProductCard as ProductCardType } from "@/lib/types"
import { ThumbsUp, TriangleAlert, BadgeDollarSign, UserRound, Heart } from "lucide-react"

function Section({
  icon,
  label,
  items,
  tone,
}: {
  icon: React.ReactNode
  label: string
  items: string[]
  tone: "pros" | "con" | "ad"
}) {
  const toneStyles = {
    pros: "text-emerald-700",
    con: "text-amber-700",
    ad: "text-primary",
  }[tone]

  return (
    <div className="flex flex-col gap-1.5">
      <div className={`flex items-center gap-1.5 text-sm font-semibold ${toneStyles}`}>
        {icon}
        <span>{label}</span>
      </div>
      <ul className="flex flex-col gap-1 pl-0.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-1.5 text-sm leading-relaxed text-foreground/80">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" aria-hidden />
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProductCard({ product, index }: { product: ProductCardType; index: number }) {
  const imageUrl = `/placeholder.svg?height=320&width=480&query=${encodeURIComponent(
    product.imagePrompt + " product photo on clean white background",
  )}`

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      {/* Product image */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="size-full object-cover"
        />
        <span className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow">
          {index + 1}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-bold text-primary shadow backdrop-blur">
          {product.priceRange}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="text-balance text-base font-bold leading-tight text-foreground">{product.name}</h3>

        <Section tone="pros" icon={<ThumbsUp className="size-4" />} label="优点" items={product.pros} />
        <Section
          tone="con"
          icon={<TriangleAlert className="size-4" />}
          label="争议或翻车点"
          items={product.controversies}
        />
        <Section
          tone="ad"
          icon={<BadgeDollarSign className="size-4" />}
          label="疑似恰饭信号"
          items={product.adSignals}
        />

        <div className="flex items-start gap-1.5 rounded-2xl bg-secondary px-3 py-2.5">
          <UserRound className="mt-0.5 size-4 shrink-0 text-secondary-foreground" />
          <p className="text-sm leading-relaxed text-secondary-foreground">
            <span className="font-semibold">适合谁：</span>
            {product.suitableFor}
          </p>
        </div>

        {/* Seeding post */}
        <div className="mt-auto rounded-2xl border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="flex size-7 items-center justify-center rounded-full bg-accent text-base leading-none"
              aria-hidden
            >
              {product.seedingPost.avatarEmoji}
            </span>
            <span className="text-xs font-semibold text-foreground">{product.seedingPost.author}</span>
            <span className="ml-auto flex items-center gap-1 text-xs text-primary">
              <Heart className="size-3.5 fill-primary" />
              {product.seedingPost.likes.toLocaleString("zh-CN")}
            </span>
          </div>
          <p className="text-pretty text-sm font-semibold leading-snug text-foreground">
            {product.seedingPost.title}
          </p>
          <p className="mt-1 text-pretty text-xs leading-relaxed text-muted-foreground">
            {product.seedingPost.excerpt}
          </p>
        </div>
      </div>
    </article>
  )
}
