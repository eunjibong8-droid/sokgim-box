export const MOOD_MAP = {
  '무거운':   { emoji: '🌑', bg: '#ede0f8' },
  '가벼운':   { emoji: '🌤', bg: '#edf5ee' },
  '시적인':   { emoji: '🌸', bg: '#fef0ec' },
  '날카로운': { emoji: '⚡', bg: '#fff8e0' },
  '따뜻한':   { emoji: '🔥', bg: '#fcd5cc' },
  '쓸쓸한':   { emoji: '🌧', bg: '#dde8f5' },
  '황당한':   { emoji: '🤔', bg: '#fff3b0' },
  '조용한':   { emoji: '🍃', bg: '#c2d9c5' },
}

const SYS = `철학적 질문 자판기입니다. 아래 JSON만 출력하세요.
{"question":"질문","mood":"무드"}
mood는 반드시: 무거운|가벼운|시적인|날카로운|따뜻한|쓸쓸한|황당한|조용한 중 하나.
질문: 한국어, 15~40자, 물음표 끝, 답 없는 철학적 질문, 매번 다른 주제.
JSON 외 텍스트 절대 금지.`

const FALLBACK = [
  ['내가 기억하지 못하는 나는 아직 나인가?', '무거운'],
  ['지금 이 순간만이 진짜인가?', '조용한'],
  ['사랑받는다는 것은 증명 가능한 일인가?', '따뜻한'],
  ['완전히 혼자인 사람은 자유로운가?', '쓸쓸한'],
  ['아름답다고 느끼는 순간 세상은 바뀌는가?', '시적인'],
]

/**
 * @param {string} apiKey
 * @param {{ q: string }[]} history
 * @returns {Promise<{ question: string, mood: string }>}
 */
export async function fetchQuestion(apiKey, history = []) {
  const prev = history.length
    ? '\n중복 금지 기존 질문:\n' + history.map((h, i) => `${i + 1}. ${h.q}`).join('\n')
    : ''

  try {
    if (!apiKey) throw new Error('no key')

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        system: SYS + prev,
        messages: [{ role: 'user', content: '생성' }],
      }),
    })

    const data = await res.json()
    const raw = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(raw)
    return { question: parsed.question, mood: parsed.mood || '조용한' }
  } catch {
    const pick = FALLBACK[Math.floor(Math.random() * FALLBACK.length)]
    return { question: pick[0], mood: pick[1] }
  }
}
