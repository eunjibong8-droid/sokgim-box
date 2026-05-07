export function showToast(message = '🌱 질문이 다시 돌아왔어요') {
  const toast = document.getElementById('revive-toast')
  if (!toast) return
  toast.textContent = message
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 2200)
}
