import { useEffect } from 'react'
import { useStore } from '../store/Store.jsx'
import { IconClose, IconCheck, IconAlert, IconBox, IconTruck, IconBug } from './Icons.jsx'

const META = {
  danger: { cls: 'b-red', Icon: IconAlert },
  warning: { cls: 'b-amber', Icon: IconAlert },
  success: { cls: 'b-green', Icon: IconCheck },
  info: { cls: 'b-blue', Icon: IconBox },
}

export default function NotificationsPanel({ onClose }) {
  const { notifications, markAllRead } = useStore()

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0, alignItems: 'stretch' }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 400, maxWidth: '90vw', background: 'var(--bg-panel)', height: '100%',
          display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)',
          animation: 'slideLeft .24s cubic-bezier(.16,1,.3,1)',
        }}
      >
        <style>{`@keyframes slideLeft{from{transform:translateX(30px);opacity:0}}`}</style>
        <div className="row between" style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="bold" style={{ fontSize: 16 }}>Уведомления</div>
            <div className="muted f12">{notifications.filter((n) => !n.read).length} непрочитанных</div>
          </div>
          <div className="row gap8">
            <button className="btn btn-sm" onClick={markAllRead}>Прочитать все</button>
            <button className="icon-btn" onClick={onClose}><IconClose /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
          {notifications.map((n) => {
            const { cls, Icon } = META[n.type] || META.info
            return (
              <div key={n.id} className="row gap12" style={{
                padding: 14, marginBottom: 8, borderRadius: 12,
                background: n.read ? 'transparent' : 'var(--bg-soft)',
                border: '1px solid var(--border)', alignItems: 'flex-start',
              }}>
                <span className={`badge ${cls}`} style={{ width: 32, height: 32, padding: 0, justifyContent: 'center', borderRadius: 9, flexShrink: 0 }}>
                  <Icon size={16} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row between">
                    <span className="bold f13">{n.title}</span>
                    {!n.read && <span className="dot" style={{ background: 'var(--primary)' }} />}
                  </div>
                  <div className="text2 f12 mt4">{n.text}</div>
                  <div className="muted f12 mt4">{n.time}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
