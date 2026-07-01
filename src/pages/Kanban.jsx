import { useState } from 'react'
import { useStore } from '../store/Store.jsx'
import { useUI } from '../App.jsx'
import { STAGES } from '../data/mockData.js'
import { ProgressBar, PriorityBadge, readyColor } from '../components/shared.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { IconClock, IconAlert, IconUsers } from '../components/Icons.jsx'

function OrderMini({ order, onDragStart, onClick }) {
  const prioBar = order.priority === 'критический' ? 'var(--red)'
    : order.priority === 'срочный' ? 'var(--amber)' : 'var(--border-strong)'
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, order)}
      onClick={onClick}
      className="card"
      style={{
        padding: 0, marginBottom: 10, cursor: 'grab', boxShadow: 'var(--shadow-sm)',
        borderLeft: `3px solid ${prioBar}`, userSelect: 'none', overflow: 'hidden',
      }}
    >
      <ProductImage product={order.product} height={72} radius={0} label={order.product} />
      <div style={{ padding: '11px 13px' }}>
        <div className="row between">
          <span className="bold f13" style={{ color: 'var(--primary)' }}>{order.num}</span>
          {order.overdue
            ? <span className="badge b-red"><IconAlert size={12} /> просрочен</span>
            : <PriorityBadge value={order.priority} />}
        </div>
        <div className="bold mt8" style={{ fontSize: 13.5, lineHeight: 1.3 }}>{order.object}</div>
        <div className="muted f12 mt4">{order.product}</div>

        <div className="row between mt12 f12 text2">
          <span className="row gap8"><IconUsers size={13} /> {order.responsible}</span>
        </div>
        <div className="row between mt8" style={{ alignItems: 'center' }}>
          <div style={{ flex: 1, marginRight: 10 }}><ProgressBar value={order.readiness} /></div>
          <span className="bold f12" style={{ color: readyColor(order.readiness) }}>{order.readiness}%</span>
        </div>
        <div className="row gap8 mt8 muted f12">
          <IconClock size={13} /> план {order.planDate}
        </div>
      </div>
    </div>
  )
}

export default function Kanban() {
  const { orders, moveOrder } = useStore()
  const { openOrder } = useUI()
  const [dragId, setDragId] = useState(null)
  const [overCol, setOverCol] = useState(null)

  const onDragStart = (e, order) => {
    setDragId(order.id)
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDrop = (stageKey) => {
    if (dragId != null) moveOrder(dragId, stageKey, 'Вы')
    setDragId(null)
    setOverCol(null)
  }

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 12 }}>
      <div className="row gap12" style={{ alignItems: 'flex-start', minWidth: 'max-content' }}>
        {STAGES.map((stage) => {
          const list = orders.filter((o) => o.stage === stage.key)
          const isBottleneck = list.length >= 8
          const over = overCol === stage.key
          return (
            <div
              key={stage.key}
              onDragOver={(e) => { e.preventDefault(); setOverCol(stage.key) }}
              onDragLeave={() => setOverCol((c) => (c === stage.key ? null : c))}
              onDrop={() => onDrop(stage.key)}
              style={{
                width: 268, flexShrink: 0,
                background: over ? 'var(--primary-soft)' : 'var(--bg-soft)',
                border: over ? '2px dashed var(--primary)' : '1px solid var(--border)',
                borderRadius: 14, padding: 10, transition: 'background .15s, border-color .15s',
              }}
            >
              <div className="row between" style={{ padding: '2px 4px 10px' }}>
                <div className="row gap8">
                  <span className="bold f13">{stage.title}</span>
                  <span className="badge b-slate">{list.length}</span>
                </div>
                {isBottleneck && <span className="badge b-red">узкое место</span>}
              </div>
              <div style={{ maxHeight: 'calc(100vh - 230px)', overflowY: 'auto', paddingRight: 2 }}>
                {list.map((o) => (
                  <OrderMini
                    key={o.id}
                    order={o}
                    onDragStart={onDragStart}
                    onClick={() => openOrder(o)}
                  />
                ))}
                {list.length === 0 && (
                  <div className="muted center f12" style={{ padding: '24px 0' }}>—</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
