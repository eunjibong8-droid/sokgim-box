import { showToast } from './toast.js'
import { getStoredBuried, saveBuried } from '../store/storage.js'

let buried = []
let gyOpen = false
let _reviveCallback = null

export function initGraveyard() {
  buried = getStoredBuried()
  document.getElementById('gy-toggle').addEventListener('click', toggleGraveyard)
  // 폴라로이드 그리드 이벤트 위임 — 단 한 번만 등록
  document.getElementById('polaroid-grid').addEventListener('click', _onPolaroidClick)
  updateGraveyard()
}

export function setReviveCallback(fn) {
  _reviveCallback = fn
}

export function buryItem(item) {
  buried.push({ ...item, buriedId: Date.now() })
  saveBuried(buried)
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
}

function _onPolaroidClick(e) {
  const card = e.target.closest('.polaroid-card')
  if (!card) return
  _revivePolaroid(Number(card.dataset.buriedId))
}

function _revivePolaroid(buriedId) {
  const pol = document.getElementById(`pol-${buriedId}`)
  if (!pol) return
  pol.classList.add('reviving')

  setTimeout(() => {
    const idx = buried.findIndex(b => b.buriedId === buriedId)
    if (idx !== -1) {
      const item = buried.splice(idx, 1)[0]
      saveBuried(buried)
      if (typeof _reviveCallback === 'function') _reviveCallback(item)
    }
    updateGraveyard()
    showToast()
  }, 450)
}
