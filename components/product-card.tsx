import type { ProductCard as ProductCardType } from "@/lib/types"
import { ThumbsUp, TriangleAlert, BadgeDollarSign, UserRound } from "lucide-react"

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
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {index + 1}
          </span>
          <h3 className="text-balance text-base font-bold leading-tight text-foreground">{product.name}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
          {product.priceRange}
        </span>
      </header>

      <div className="flex flex-col gap-4">
        <Section
          tone="pros"
          icon={<ThumbsUp className="size-4" />}
          label="优点"
          items={product.pros}
        />
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
      </div>

      <footer className="flex items-start gap-1.5 rounded-2xl bg-secondary px-3 py-2.5">
        <UserRound className="mt-0.5 size-4 shrink-0 text-secondary-foreground" />
        <p className="text-sm leading-relaxed text-secondary-foreground">
          <span className="font-semibold">适合谁：</span>
          {product.suitableFor}
        </p>
      </footer>
    </article>
  )
}
