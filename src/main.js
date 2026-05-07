import './styles/base.css'
import './styles/components/card.css'
import './styles/components/history.css'
import './styles/components/graveyard.css'
import './styles/components/toast.css'
import { initQuestionCard } from './components/question-card.js'
import { initGraveyard, setReviveCallback } from './components/graveyard.js'
import { initHistory, addToHistory } from './components/history.js'

document.addEventListener('DOMContentLoaded', () => {
  initQuestionCard()
  initHistory()
  initGraveyard()
  // 묘지에서 꺼낸 항목을 히스토리에 다시 추가 (addToHistory가 renderHistory 포함)
  setReviveCallback((item) => {
    addToHistory(item)
  })
})
