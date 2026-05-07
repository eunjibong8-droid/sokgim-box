import './styles/base.css'
import './styles/components/card.css'
import './styles/components/history.css'
import './styles/components/graveyard.css'
import './styles/components/toast.css'
import './styles/components/history-view.css'

import { initQuestionCard } from './components/question-card.js'
import { initGraveyard, setReviveCallback } from './components/graveyard.js'
import { initHistory, addToHistory } from './components/history.js'
import { initHistoryView } from './components/history-view.js'

document.addEventListener('DOMContentLoaded', () => {
  initHistory()
  initQuestionCard()
  initGraveyard()
  initHistoryView()
  setReviveCallback((item) => {
    addToHistory(item)
  })
})
