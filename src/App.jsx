import { useState, createContext, useContext } from 'react'
import { useStore } from './store/Store.jsx'
import {
  IconDashboard, IconMap, IconKanban, IconMetal, IconPart,
  IconMaster, IconDirector, IconBell, IconChevron,
} from './components/Icons.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProductionMap from './pages/ProductionMap.jsx'
import Kanban from './pages/Kanban.jsx'
import MetalControl from './pages/MetalControl.jsx'
import PartsTracking from './pages/PartsTracking.jsx'
import MasterWorkplace from './pages/MasterWorkplace.jsx'
import DirectorPanel from './pages/DirectorPanel.jsx'
import OrderCard from './components/OrderCard.jsx'
import NotificationsPanel from './components/NotificationsPanel.jsx'
import SiteModal from './components/SiteModal.jsx'

// Контекст навигации/модалок
const UICtx = createContext(null)
export const useUI = () => useContext(UICtx)

const NAV = [
  { group: 'Обзор', items: [
    { key: 'director', label: 'Панель директора', icon: IconDirector },
    { key: 'dashboard', label: 'Dashboard', icon: IconDashboard },
  ]},
  { group: 'Производство', items: [
    { key: 'map', label: 'Карта производства', icon: IconMap },
    { key: 'kanban', label: 'Канбан заказов', icon: IconKanban },
    { key: 'parts', label: 'Отслеживание деталей', icon: IconPart },
  ]},
  { group: 'Ресурсы', items: [
    { key: 'metal', label: 'Контроль металла', icon: IconMetal },
    { key: 'master', label: 'Рабочее место мастера', icon: IconMaster },
  ]},
]

const TITLES = {
  director: ['Панель директора', 'Состояние предприятия за 10 секунд'],
  dashboard: ['Dashboard', 'Ключевые показатели производства'],
  map: ['Карта производства', 'Загрузка участков в реальном времени'],
  kanban: ['Канбан заказов', 'Все заказы по этапам · перетаскивайте карточки'],
  parts: ['Отслеживание деталей', 'Полный маршрут детали по производству'],
  metal: ['Контроль металла', 'Поступления, списания и складские остатки'],
  master: ['Рабочее место мастера', 'Задачи текущей смены'],
}

const ROLES = {
  director: { name: 'Директор', short: 'ДР', role: 'Руководитель' },
  master: { name: 'Мастер участка', short: 'МС', role: 'Покраска' },
  tech: { name: 'Технолог', short: 'ТХ', role: 'Проектирование' },
}

export default function App() {
  const [page, setPage] = useState('director')
  const [order, setOrder] = useState(null)
  const [site, setSite] = useState(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const store = useStore()
  const { unread, role, setRole } = store

  // Смена роли по клику на аккаунт: Директор → Мастер → Технолог → …
  const ROLE_ORDER = ['director', 'master', 'tech']
  const ROLE_PAGE = { director: 'director', master: 'master', tech: 'dashboard' }
  const cycleRole = () => {
    const next = ROLE_ORDER[(ROLE_ORDER.indexOf(role) + 1) % ROLE_ORDER.length]
    setRole(next)
    setPage(ROLE_PAGE[next])
  }

  const ui = { page, setPage, openOrder: setOrder, openSite: setSite }
  const [title, sub] = TITLES[page] || ['', '']
  const me = ROLES[role]

  return (
    <UICtx.Provider value={ui}>
      <div className="app">
        {/* Боковое меню */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-logo">D</div>
            <div>
              <div className="brand-name">DVC Systems</div>
              <div className="brand-sub">СТАЛЬ-ЭФФЕКТ</div>
            </div>
          </div>

          {NAV.map((g) => (
            <div key={g.group}>
              <div className="nav-group-label">{g.group}</div>
              {g.items.map((it) => {
                const Icon = it.icon
                return (
                  <button
                    key={it.key}
                    className={`nav-item ${page === it.key ? 'active' : ''}`}
                    onClick={() => setPage(it.key)}
                  >
                    <Icon className="nav-ico" />
                    <span>{it.label}</span>
                  </button>
                )
              })}
            </div>
          ))}

          <div className="sidebar-foot">
            DVC Systems · v1.0<br />Цифровой двойник завода
          </div>
        </aside>

        {/* Правая часть */}
        <div className="main">
          <header className="topbar">
            <div>
              <h1>{title}</h1>
              <div className="topbar-sub">{sub}</div>
            </div>
            <div className="topbar-spacer" />

            <button className="icon-btn" onClick={() => setNotifOpen(true)}>
              <IconBell />
              {unread > 0 && <span className="count-dot">{unread}</span>}
            </button>

            <button className="user-chip" onClick={cycleRole} title="Нажмите, чтобы сменить роль">
              <div className="avatar">{me.short}</div>
              <div style={{ textAlign: 'left' }}>
                <div className="u-name">{me.name}</div>
                <div className="u-role">{me.role}</div>
              </div>
              <IconChevron size={15} style={{ color: 'var(--text-3)', marginLeft: 2 }} />
            </button>
          </header>

          <main className="content" key={page}>
            <div className="fade-in">
              {page === 'director' && <DirectorPanel />}
              {page === 'dashboard' && <Dashboard />}
              {page === 'map' && <ProductionMap />}
              {page === 'kanban' && <Kanban />}
              {page === 'parts' && <PartsTracking />}
              {page === 'metal' && <MetalControl />}
              {page === 'master' && <MasterWorkplace />}
            </div>
          </main>
        </div>

        {order && <OrderCard order={order} onClose={() => setOrder(null)} />}
        {site && <SiteModal site={site} onClose={() => setSite(null)} />}
        {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
      </div>
    </UICtx.Provider>
  )
}
