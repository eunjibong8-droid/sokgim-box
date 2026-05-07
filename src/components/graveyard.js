import { showToast } from './toast.js'

let buried = []
let gyOpen = false
let _reviveCallback = null

export function initGraveyard() {
  document.getElementById('gy-toggle').addEventListener('click', toggleGraveyard)
}

export function setReviveCallback(fn) {
  _reviveCallback = fn
}

export function buryItem(item) {
  buried.push({ ...item, buriedId: Date.now() })
  updateGraveyard()
}

export function toggleGraveyard() {
  gyOpen = !gyOpen
  document.getElementById('gy-body').classList.toggle('open', gyOpen)
}

export function updateGraveyard() {
  const section = document.getElementById('gy-section')
  const badge = document.getElementById('gy-badge')

  if (buried.length === 0) {
    section.style.display = 'none'
    gyOpen = false
    document.getElementById('gy-body').classList.remove('open')
    return
  }

  section.style.display = 'flex'
  badge.textContent = buried.length
  badge.classList.add('show')

  const grid = document.getElementById('polaroid-grid')
  grid.innerHTML = buried.map(b => `
    <div class="polaroid-card" id="pol-${b.buriedId}" data-buried-id="${b.buriedId}">
      <div class="polaroid-img">${b.emoji}</div>
      <div class="polaroid-q">${b.q}</div>
      <div class="polaroid-mood">${b.mood}</div>
      <span class="polaroid-revive">🌱 꺼내기</span>
    </div>
  `).join('')

  // 이벤트 위임 — 클릭마다 재등록하므로 grid를 교체한 뒤 단 한 번 바인딩
  grid.addEventListener('click', _onPolaroidClick)
}

function _onPolaroidClick(e) {
  const card = e.target.closest('.polaroid-card')
  if (!card) return
  const buriedId = Number(card.dataset.buriedId)
  _revivePolaroid(buriedId)
}

function _revivePolaroid(buriedId) {
  const pol = document.getElementById(`pol-${buriedId}`)
  if (!pol) return
  pol.classList.add('reviving')

  setTimeout(() => {
    const idx = buried.findIndex(b => b.buriedId === buriedId)
    if (idx !== -1) {
      const item = buried.splice(idx, 1)[0]
      if (typeof _reviveCallback === 'function') {
        _reviveCallback(item)
      }
    }
    updateGraveyard()
    showToast()
  }, 450)
}
