export type SeedingPost = {
  author: string
  avatarEmoji: string
  title: string
  excerpt: string
  likes: number
}

export type ProductCard = {
  name: string
  priceRange: string
  priceLow: number
  priceHigh: number
  imagePrompt: string
  pros: string[]
  controversies: string[]
  adSignals: string[]
  suitableFor: string
  seedingPost: SeedingPost
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
