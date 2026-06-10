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
        priceLow: z.number().describe('价格区间下限的数字（人民币元），例如 89'),
        priceHigh: z.number().describe('价格区间上限的数字（人民币元），例如 129'),
        imagePrompt: z
          .string()
          .describe('用 3-6 个英文单词描述该产品的外观以便生成配图，例如 "white foldable desk lamp"'),
        pros: z
          .array(z.string())
          .describe(
            '2-4 条优点，每条尽量说明具体功能或参数，例如"可调节色温2700K-6500K""支架可伸缩折叠""续航40小时"，不要只说"质量好""性价比高"这种空话',
          ),
        controversies: z.array(z.string()).describe('2-3 条争议点或翻车点'),
        adSignals: z.array(z.string()).describe('2-3 条疑似恰饭/广告特征'),
        suitableFor: z.string().describe('一句话说明适合什么样的人'),
        seedingPost: z
          .object({
            author: z.string().describe('小红书风格的用户昵称，例如"省钱小能手Lina"'),
            avatarEmoji: z.string().describe('一个适合做头像的 emoji，例如 🐰'),
            title: z.string().describe('小红书种草帖标题，口语化、带点夸张，可含 emoji'),
            excerpt: z.string().describe('帖子正文摘录，1-2 句真实的使用感受'),
            likes: z.number().describe('点赞数，介于 200 到 99999 之间的真实感数字'),
          })
          .describe('一条网友发布的种草帖，模拟小红书真实笔记'),
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
3. 每个产品给出：优点（每条尽量说明具体功能、参数或卖点，比如台灯"可无极调光""色温2700-6500K可调""灯杆可伸缩折叠""支持Type-C充电续航40h"，而不是空泛地说"好用"）、争议或翻车点、疑似恰饭信号（提醒用户哪些表现可能意味着这是广告/软文，比如"全网清一色好评""博主只夸不提缺点""详情页话术夸张"等）、适合谁
4. 给出 priceLow 和 priceHigh 两个数字，表示价格区间，与 priceRange 一致
5. 用 imagePrompt 字段，用简短英文描述产品外观用于生成配图
6. 为每个产品附带一条 seedingPost（模拟小红书网友的真实种草笔记，有昵称、emoji头像、标题、正文摘录和点赞数）
7. 最后给一个典型用户场景下的"小编建议"，明确推荐选哪个并说明理由

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
