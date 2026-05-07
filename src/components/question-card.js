import { fetchQuestion, MOOD_MAP } from '../api/claude.js'
import { getApiKey } from '../store/storage.js'
import { addToHistory, getHistory } from './history.js'

let count = 0
let busy = false

export function initQuestionCard() {
  document.getElementById('main-btn').addEventListener('click', _dispense)
}

async function _dispense() {
  if (busy) return
  busy = true

  const btn = document.getElementById('main-btn')
  const icon = document.getElementById('btn-icon')
  const ph = document.getElementById('placeholder')
  const qOut = document.getElementById('q-output')
  const wave = document.getElementById('waveform')
  const pill = document.getElementById('mood-pill')

  btn.disabled = true
  btn.classList.add('loading')
  icon.textContent = '🌀'
  qOut.classList.remove('show')
  wave.classList.remove('show')
  pill.classList.remove('show')
  ph.style.display = 'flex'
  ph.querySelector('.placeholder-icon').textContent = '🌀'
  ph.querySelector('.placeholder-text').innerHTML = '생각 중...'

  try {
    const { question, mood } = await fetchQuestion(getApiKey(), getHistory())

    count++
    ph.style.display = 'none'
    document.getElementById('q-text').textContent = question
    qOut.classList.remove('show')
    void qOut.offsetWidth
    qOut.classList.add('show')
    wave.classList.add('show')

    const m = MOOD_MAP[mood] || MOOD_MAP['조용한']
    pill.textContent = m.emoji + ' ' + mood
    pill.style.background = m.bg
    pill.classList.add('show')

    document.getElementById('sess-num').textContent = String(count).padStart(2, '0')

    const cb = document.getElementById('count-bubble')
    cb.textContent = count
    cb.classList.remove('bump')
    void cb.offsetWidth
    cb.classList.add('bump')

    const dotRow = document.getElementById('dot-row')
    dotRow.classList.add('show')
    document.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('on', i < (count % 5 || 5))
    )

    addToHistory({ q: question, mood, emoji: m.emoji, num: count })
  } finally {
    busy = false
    btn.disabled = false
    btn.classList.remove('loading')
    icon.textContent = '🪴'
  }
}
