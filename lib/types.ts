export type ProductCard = {
  name: string
  priceRange: string
  pros: string[]
  controversies: string[]
  adSignals: string[]
  suitableFor: string
}

export type BacaoResult = {
  category: string
  summary: string
  products: ProductCard[]
  editorPick: {
    scenario: string
    recommendation: string
    reason: string
  }
}
