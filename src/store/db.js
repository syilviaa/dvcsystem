// ============================================================
//  Локальная «база данных» демо (localStorage).
//  Сохраняет состояние между перезагрузками страницы.
// ============================================================
const KEY = 'dvc-systems-db-v1'

// Поднимаем версию схемы, чтобы сбросить несовместимые данные
const SCHEMA = 3

export function loadDb() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.__schema !== SCHEMA) return null
    return data
  } catch {
    return null
  }
}

export function saveDb(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ __schema: SCHEMA, ...state }))
  } catch {
    /* хранилище переполнено — пропускаем */
  }
}

export function clearDb() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
