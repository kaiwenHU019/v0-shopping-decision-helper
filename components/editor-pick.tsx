import type { BacaoResult } from "@/lib/types"
import { Sparkles } from "lucide-react"

export function EditorPick({ pick }: { pick: BacaoResult["editorPick"] }) {
  return (
    <section className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-5">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <h2 className="text-base font-bold text-primary">小编建议</h2>
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary/70">典型场景</span>
          <p className="text-pretty text-sm leading-relaxed text-foreground">{pick.scenario}</p>
        </div>

        <div className="rounded-2xl bg-card p-3.5">
          <p className="text-pretty text-sm font-bold leading-relaxed text-foreground">
            👉 {pick.recommendation}
          </p>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-foreground/80">{pick.reason}</p>
        </div>
      </div>
    </section>
  )
}
