import { getHistory } from './history.js'

export function initHistoryView() {
  document.getElementById('history-view-btn').addEventListener('click', openHistoryView)
  document.getElementById('hv-close').addEventListener('click', closeHistoryView)
  document.getElementById('history-view-overlay').addEventListener('click', closeHistoryView)
}

function openHistoryView() {
  renderHistoryView()
  const view = document.getElementById('history-view')
  view.classList.add('open')
  document.body.style.overflow = 'hidden'
}

function closeHistoryView() {
  document.getElementById('history-view').classList.remove('open')
  document.body.style.overflow = ''
}

function renderHistoryView() {
  const list = document.getElementById('hv-list')
  const history = getHistory()

  if (!history.length) {
    list.innerHTML = `<div class="hv-empty">아직 질문이 없어요<br>🌺 버튼을 눌러 시작해보세요</div>`
    return
  }

  const groups = _groupByDate(history)
  list.innerHTML = Object.entries(groups).map(([label, items]) => `
    <div class="hv-group">
      <div class="hv-date-label">${label}</div>
      ${items.map(h => `
        <div class="hv-item">
          <div class="hv-item-top">
            <span class="hv-emoji">${h.emoji}</span>
            <div class="hv-item-info">
              <div class="hv-item-mood">${h.mood}</div>
              <div class="hv-item-q">${h.q}</div>
            </div>
            <span class="hv-item-num">${String(h.num).padStart(2, '0')}</span>
          </div>
          ${h.memo ? `<div class="hv-item-memo">💬 ${h.memo}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('')
}

function _groupByDate(items) {
  const today = _dateKey(new Date())
  const yesterday = _dateKey(new Date(Date.now() - 86400000))
  const groups = {}

  items.forEach(item => {
    const d = new Date(item.date || Date.now())
    const key = _dateKey(d)
    let label
    if (key === today) label = '오늘'
    else if (key === yesterday) label = '어제'
    else label = d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })

    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  })

  return groups
}

function _dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}
