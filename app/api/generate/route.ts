import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const schema = z.object({
  category: z.string().describe('对用户需求归纳出的购物品类名称'),
  summary: z.string().describe('一句话概括这个品类挑选时最该注意什么'),
  products: z
    .array(
      z.object({
        name: z.string().describe('具体的产品名称，包含品牌'),
        priceRange: z.string().describe('大致价格区间，例如 "¥89-129"'),
        pros: z.array(z.string()).describe('2-4 条优点'),
        controversies: z.array(z.string()).describe('2-3 条争议点或翻车点'),
        adSignals: z.array(z.string()).describe('2-3 条疑似恰饭/广告特征'),
        suitableFor: z.string().describe('一句话说明适合什么样的人'),
      }),
    )
    .describe('3-4 个具体的候选产品'),
  editorPick: z.object({
    scenario: z.string().describe('一个典型的用户使用场景'),
    recommendation: z.string().describe('针对该场景推荐选哪一个产品'),
    reason: z.string().describe('推荐理由'),
  }),
})

export async function POST(req: Request) {
  const { query } = await req.json()

  if (!query || typeof query !== 'string') {
    return Response.json({ error: '请输入购物需求' }, { status: 400 })
  }

  try {
    const { experimental_output } = await generateText({
      model: 'openai/gpt-5-mini',
      experimental_output: Output.object({ schema }),
      system: `你是"拔草卡"，一个帮小红书用户做购物决策的资深测评博主。你说话真诚、接地气、敢说真话，绝不当无脑安利的"恰饭号"。

针对用户给出的购物需求，你要：
1. 归纳出具体品类
2. 推荐 3-4 个真实存在、市面常见的具体产品（带品牌名）
3. 每个产品给出：优点、争议或翻车点、疑似恰饭信号（提醒用户哪些表现可能意味着这是广告/软文，比如"全网清一色好评""博主只夸不提缺点""详情页话术夸张"等）、适合谁
4. 最后给一个典型用户场景下的"小编建议"，明确推荐选哪个并说明理由

要求：信息具体、有辨识度，价格区间符合中国市场实际。所有内容用简体中文。语气像小红书博主，可以活泼但要客观。`,
      prompt: `购物需求：${query}`,
    })

    return Response.json(experimental_output)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log('[v0] 拔草卡生成失败 - 完整错误:', error)
    console.log('[v0] 错误信息:', message)
    return Response.json(
      { error: '生成失败，请稍后再试', detail: message },
      { status: 500 },
    )
  }
}
