import { buryItem, updateGraveyard } from './graveyard.js'
import { getStoredHistory, saveHistory } from '../store/storage.js'

let history = []

export function initHistory() {
  history = getStoredHistory()
  renderHistory()
  document.getElementById('hist-list').addEventListener('click', _onListClick)
}

/**
 * 히스토리 맨 앞에 항목 추가. 전체 localStorage에 저장, 메인 뷰는 최근 8개만 표시.
 */
export function addToHistory(item) {
  const entry = { ...item, date: item.date || new Date().toISOString() }
  history.unshift(entry)
  saveHistory(history)
  renderHistory()
}

export function getHistory() {
  return history
}

export function renderHistory() {
  const label = document.getElementById('hist-label')
  const list = document.getElementById('hist-list')
  // 메인 뷰: 현재 질문(index 0) 제외, 최근 8개
  const prev = history.slice(1, 9)

  if (!prev.length) {
    label.classList.remove('show')
    list.innerHTML = ''
    return
  }

  label.classList.add('show')
  list.innerHTML = prev.map((h, i) => {
    const idx = i + 1
    const hasMemo = h.memo && h.memo.trim()
    return `
      <div class="history-card ${hasMemo ? 'has-memo' : ''}" id="hcard-${idx}">
        <div class="h-card-top" data-toggle-memo="${idx}">
          <span class="h-emoji">${h.emoji}</span>
          <div class="h-info">
            <div class="h-mood">${h.mood}</div>
            <div class="h-q">${h.q}</div>
            ${hasMemo ? `<div class="h-memo-preview">💬 ${h.memo}</div>` : ''}
          </div>
          <span class="h-num">${String(h.num).padStart(2, '0')}</span>
        </div>
        ${!hasMemo ? `<div class="h-tap-hint" data-toggle-memo="${idx}">탭해서 생각 적기 ✏️</div>` : ''}
        <div class="h-memo-wrap" id="hmemo-${idx}">
          <div class="h-memo-inner">
            <textarea class="h-memo-textarea" id="hta-${idx}" placeholder="지금 떠오르는 생각을 적어보세요...">${h.memo || ''}</textarea>
            <div class="h-memo-footer">
              <span class="h-memo-saved" id="hsaved-${idx}">저장됐어요 🌿</span>
              <button class="h-save-btn" data-save-memo="${idx}">저장</button>
            </div>
          </div>
        </div>
        <div class="h-actions">
          <button class="bury-btn" data-bury-idx="${idx}">🪦 묻어두기</button>
        </div>
      </div>
    `
  }).join('')
}

function _onListClick(e) {
  // 저장 버튼은 h-memo-wrap 안에 있으므로 반드시 먼저 확인
  const saveBtn = e.target.closest('[data-save-memo]')
  if (saveBtn) {
    e.stopPropagation()
    _saveMemo(Number(saveBtn.dataset.saveMemo))
    return
  }

  // 저장 버튼 외 메모 영역 클릭은 전파 차단
  if (e.target.closest('.h-memo-wrap')) {
    e.stopPropagation()
    return
  }

  const buryBtn = e.target.closest('[data-bury-idx]')
  if (buryBtn) {
    e.stopPropagation()
    _buryCard(Number(buryBtn.dataset.buryIdx))
    return
  }

  const toggleEl = e.target.closest('[data-toggle-memo]')
  if (toggleEl) {
    _toggleMemo(Number(toggleEl.dataset.toggleMemo))
  }
}

function _toggleMemo(idx) {
  const wrap = document.getElementById(`hmemo-${idx}`)
  const card = document.getElementById(`hcard-${idx}`)
  const isOpen = wrap.classList.contains('open')

  if (isOpen) {
    wrap.classList.remove('open')
    card.classList.remove('open')
  } else {
    wrap.classList.add('open')
    card.classList.add('open')
    setTimeout(() => document.getElementById(`hta-${idx}`)?.focus(), 350)
  }
}

function _saveMemo(idx) {
  const ta = document.getElementById(`hta-${idx}`)
  const saved = document.getElementById(`hsaved-${idx}`)
  const text = ta.value.trim()

  history[idx].memo = text
  saveHistory(history)

  saved.classList.add('show')
  setTimeout(() => {
    saved.classList.remove('show')
    const wrap = document.getElementById(`hmemo-${idx}`)
    const card = document.getElementById(`hcard-${idx}`)
    wrap.classList.remove('open')
    card.classList.remove('open')
    renderHistory()
  }, 1200)
}

function _buryCard(idx) {
  const item = history[idx]
  if (!item) return

  const card = document.getElementById(`hcard-${idx}`)
  if (card) {
    card.classList.add('burying')
    setTimeout(() => {
      history.splice(idx, 1)
      saveHistory(history)
      buryItem(item)
      updateGraveyard()
      renderHistory()
    }, 600)
  }
}
