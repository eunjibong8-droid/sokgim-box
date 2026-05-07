import { getApiKey, setApiKey } from '../store/storage.js'

export function initApiKey() {
  _loadApiKey()

  document.getElementById('key-status').addEventListener('click', () => {
    const inputRow = document.getElementById('key-input-row')
    inputRow.style.display = inputRow.style.display === 'none' ? 'flex' : 'none'
  })

  document.getElementById('api-key-save-btn').addEventListener('click', saveApiKey)
}

function _loadApiKey() {
  const key = getApiKey()
  const input = document.getElementById('api-key-input')
  const section = document.getElementById('api-key-section')
  const status = document.getElementById('key-status')
  const inputRow = document.getElementById('key-input-row')

  if (key) {
    input.value = key
    section.classList.add('saved')
    status.classList.add('show')
    inputRow.style.display = 'none'
  }
}

export function saveApiKey() {
  const input = document.getElementById('api-key-input')
  const section = document.getElementById('api-key-section')
  const status = document.getElementById('key-status')
  const inputRow = document.getElementById('key-input-row')
  const key = input.value.trim()

  if (!key) return
  setApiKey(key)
  section.classList.add('saved')
  status.classList.add('show')
  inputRow.style.display = 'none'
}
