const KEYS = {
  apiKey:  'sokgim-api-key',
  history: 'sokgim-history',
  buried:  'sokgim-buried',
}

export function getApiKey() {
  return localStorage.getItem(KEYS.apiKey) || ''
}

export function setApiKey(key) {
  localStorage.setItem(KEYS.apiKey, key)
}

export function getStoredHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.history) || '[]')
  } catch { return [] }
}

export function saveHistory(history) {
  localStorage.setItem(KEYS.history, JSON.stringify(history))
}

export function getStoredBuried() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.buried) || '[]')
  } catch { return [] }
}

export function saveBuried(buried) {
  localStorage.setItem(KEYS.buried, JSON.stringify(buried))
}
