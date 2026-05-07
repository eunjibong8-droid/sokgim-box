const KEY = 'anthro-api-key'

export function getApiKey() {
  return localStorage.getItem(KEY) || ''
}

export function setApiKey(key) {
  localStorage.setItem(KEY, key)
}
