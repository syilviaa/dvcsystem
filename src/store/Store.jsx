import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  orders as seedOrders,
  sites as seedSites,
  employees,
  kpi as seedKpi,
  initialEvents,
  initialNotifications,
  STAGES,
  stageIndex,
  stageTitle,
} from '../data/mockData'
import { loadDb, saveDb, clearDb } from './db'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

let eventId = 100
let notifId = 100
const now = () =>
  new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

const USERS = ['Иванов С.', 'Петров А.', 'Ахметов Е.', 'Смирнов Д.', 'Оспанов Н.']

// Загружаем сохранённое состояние (демо-БД) один раз при старте
const persisted = loadDb()
// Возобновляем счётчики id, чтобы не было коллизий с восстановленными данными
if (persisted) {
  eventId = Math.max(eventId, ...(persisted.events || []).map((e) => e.id || 0))
  notifId = Math.max(notifId, ...(persisted.notifications || []).map((n) => n.id || 0))
}

export function StoreProvider({ children }) {
  const [orders, setOrders] = useState(persisted?.orders ?? seedOrders)
  const [events, setEvents] = useState(persisted?.events ?? initialEvents)
  const [notifications, setNotifications] = useState(persisted?.notifications ?? initialNotifications)
  const [kpi, setKpi] = useState(persisted?.kpi ?? seedKpi)
  const [role, setRole] = useState('director') // director | master | tech
  const [live, setLive] = useState(false)
  const [flashKey, setFlashKey] = useState(0) // триггер подсветки KPI
  const timer = useRef(null)

  // Сохраняем состояние в демо-БД при любом изменении
  useEffect(() => {
    saveDb({ orders, events, notifications, kpi })
  }, [orders, events, notifications, kpi])

  // Полный сброс демо-данных
  const resetDemo = useCallback(() => {
    clearDb()
    window.location.reload()
  }, [])

  const pushEvent = useCallback((type, text, user = 'Система') => {
    setEvents((e) => [{ id: ++eventId, type, text, time: now(), user }, ...e].slice(0, 40))
  }, [])

  const pushNotification = useCallback((type, title, text) => {
    setNotifications((n) =>
      [{ id: ++notifId, type, title, text, time: 'только что', read: false }, ...n].slice(0, 30),
    )
  }, [])

  // Перемещение заказа между этапами
  const moveOrder = useCallback(
    (orderId, toStage, user = USERS[0]) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o
          const fromIdx = stageIndex(o.stage)
          const toIdx = stageIndex(toStage)
          if (toIdx === fromIdx) return o
          const readiness = Math.min(
            100,
            Math.max(3, Math.round((toIdx / (STAGES.length - 1)) * 100)),
          )
          const hist = [
            ...o.history,
            {
              time: now(),
              action:
                toIdx > fromIdx
                  ? `Передано на «${stageTitle(toStage)}»`
                  : `Возврат на «${stageTitle(toStage)}»`,
              user,
            },
          ]
          return { ...o, stage: toStage, readiness, history: hist }
        }),
      )
      const ord = seedOrders.find((o) => o.id === orderId)
      const label = ord ? ord.object : `№${orderId}`
      pushEvent('info', `Заказ №${orderId} «${label}» → «${stageTitle(toStage)}»`, user)
      if (toStage === 'shipping') {
        pushNotification('success', 'Заказ готов к отгрузке', `Заказ №${orderId} «${label}» перемещён на отгрузку`)
        setKpi((k) => ({ ...k, doneToday: k.doneToday + 1 }))
      }
      setFlashKey((f) => f + 1)
    },
    [pushEvent, pushNotification],
  )

  // Добавить комментарий к заказу (попадает в историю)
  const addComment = useCallback(
    (orderId, text, user = 'Вы') => {
      if (!text || !text.trim()) return
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, history: [...o.history, { time: now(), action: 'Комментарий', user, note: text.trim() }] }
            : o,
        ),
      )
      pushEvent('info', `Комментарий к заказу №${orderId}: ${text.trim()}`, user)
    },
    [pushEvent],
  )

  // Прикрепить фотографию к заказу
  const addPhoto = useCallback(
    (orderId, kind = 'Изделие', user = 'Вы') => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, photos: [...o.photos, { kind, id: `${orderId}-add-${o.photos.length}-${Date.now()}` }] }
            : o,
        ),
      )
      pushEvent('info', `Фотография прикреплена к заказу №${orderId}`, user)
    },
    [pushEvent],
  )

  // Сообщить о проблеме по заказу (флаг + уведомление руководителю)
  const reportProblem = useCallback(
    (orderId, note = 'Требуется вмешательство', user = 'Мастер') => {
      let label = `№${orderId}`
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o
          label = o.object
          return {
            ...o,
            problem: note,
            history: [...o.history, { time: now(), action: 'Сообщение о проблеме', user, note }],
          }
        }),
      )
      pushEvent('danger', `Проблема по заказу №${orderId} «${label}»: ${note}`, user)
      pushNotification('danger', 'Сообщение о проблеме', `Заказ №${orderId} «${label}»: ${note}`)
    },
    [pushEvent, pushNotification],
  )

  // Снять флаг проблемы
  const resolveProblem = useCallback((orderId) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, problem: null } : o)))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })))
  }, [])

  // Динамические счётчики очередей и АВТО-ЦВЕТ участков.
  // Цвет пересчитывается из загрузки и длины очереди:
  //   🟢 норма · 🟡 требует внимания · 🔴 критично
  const sites = useMemo(() => {
    return seedSites.map((s) => {
      const queue = orders.filter((o) => o.stage === s.key).length
      let status = 'green'
      if (s.load >= 90 || queue >= 12) status = 'red'
      else if (s.load >= 85 || queue >= 8) status = 'amber'
      return { ...s, queue, status }
    })
  }, [orders])

  const unread = notifications.filter((n) => !n.read).length

  // Живая симуляция: имитация синхронной работы мастеров/технологов
  useEffect(() => {
    if (!live) {
      clearInterval(timer.current)
      return
    }
    timer.current = setInterval(() => {
      setOrders((prev) => {
        const movable = prev.filter((o) => stageIndex(o.stage) < STAGES.length - 1)
        if (!movable.length) return prev
        const target = movable[Math.floor(Math.random() * movable.length)]
        const toStage = STAGES[stageIndex(target.stage) + 1].key
        const user = USERS[Math.floor(Math.random() * USERS.length)]
        // событие + уведомление за кадром
        setTimeout(() => {
          pushEvent('info', `Заказ №${target.id} «${target.object}» → «${stageTitle(toStage)}»`, user)
          if (toStage === 'shipping') {
            pushNotification('success', 'Заказ готов к отгрузке', `Заказ №${target.id} перемещён на отгрузку`)
            setKpi((k) => ({ ...k, doneToday: k.doneToday + 1 }))
          }
        }, 0)
        return prev.map((o) => {
          if (o.id !== target.id) return o
          const toIdx = stageIndex(toStage)
          return {
            ...o,
            stage: toStage,
            readiness: Math.min(100, Math.round((toIdx / (STAGES.length - 1)) * 100)),
            history: [...o.history, { time: now(), action: `Передано на «${stageTitle(toStage)}»`, user }],
          }
        })
      })
      setKpi((k) => ({
        ...k,
        load: Math.min(99, Math.max(70, k.load + (Math.random() > 0.5 ? 1 : -1))),
        productivity: Math.min(99, Math.max(88, k.productivity + (Math.random() > 0.5 ? 1 : -1))),
      }))
      setFlashKey((f) => f + 1)
    }, 3200)
    return () => clearInterval(timer.current)
  }, [live, pushEvent, pushNotification])

  const value = {
    orders, setOrders, moveOrder, addComment, addPhoto, reportProblem, resolveProblem, resetDemo,
    events, pushEvent,
    notifications, pushNotification, markAllRead, unread,
    kpi, sites, employees,
    role, setRole,
    live, setLive,
    flashKey,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
