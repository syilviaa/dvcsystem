import { useState } from 'react'
import { useStore } from '../store/Store.jsx'
import { stageTitle, STAGES, stageIndex } from '../data/mockData.js'
import {
  ProgressBar, PriorityBadge, StageBadge, PhotoThumb, readyColor,
} from './shared.jsx'
import {
  IconClose, IconFile, IconCamera, IconClock, IconArrowR, IconCheck,
} from './Icons.jsx'

const TABS = ['Общее', 'Спецификация', 'Документы', 'Фотографии', 'История']

const DOC_COLOR = { PDF: '#dc2626', DWG: '#2563eb', XLS: '#16a34a' }

export default function OrderCard({ order: initial, onClose }) {
  const { orders, moveOrder } = useStore()
  // берём актуальную версию заказа из стора
  const order = orders.find((o) => o.id === initial.id) || initial
  const [tab, setTab] = useState('Общее')

  const idx = stageIndex(order.stage)
  const next = STAGES[idx + 1]

  const Field = ({ label, value }) => (
    <div>
      <div className="muted f12">{label}</div>
      <div className="bold mt4" style={{ fontSize: 14 }}>{value}</div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Шапка */}
        <div style={{ padding: '20px 24px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
          <div className="row between">
            <div className="row gap12">
              <span className="bold" style={{ fontSize: 20, color: 'var(--primary)' }}>{order.num}</span>
              <StageBadge stageKey={order.stage} title={stageTitle(order.stage)} />
              <PriorityBadge value={order.priority} />
              {order.overdue && <span className="badge b-red">просрочен</span>}
            </div>
            <button className="icon-btn" onClick={onClose}><IconClose /></button>
          </div>
          <div className="bold mt12" style={{ fontSize: 18 }}>{order.object}</div>
          <div className="muted">{order.product} · {order.client}</div>

          <div className="row gap16 mt16" style={{ alignItems: 'center' }}>
            <div style={{ flex: 1 }}><ProgressBar value={order.readiness} /></div>
            <span className="bold" style={{ color: readyColor(order.readiness) }}>{order.readiness}% готовность</span>
            {next && (
              <button className="btn btn-primary btn-sm" onClick={() => moveOrder(order.id, next.key, 'Вы')}>
                <IconArrowR size={15} /> На «{next.title}»
              </button>
            )}
          </div>
        </div>

        {/* Табы */}
        <div className="tabs" style={{ background: 'var(--bg-panel)' }}>
          {TABS.map((t) => (
            <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {tab === 'Общее' && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', rowGap: 22 }}>
              <Field label="Номер заказа" value={order.num} />
              <Field label="Клиент" value={order.client} />
              <Field label="Объект" value={order.object} />
              <Field label="Статус" value={stageTitle(order.stage)} />
              <Field label="Дата начала" value={order.startDate} />
              <Field label="Плановая дата" value={order.planDate} />
              <Field label="Ответственный" value={order.responsible} />
              <Field label="Приоритет" value={order.priority} />
              <Field label="Общий вес" value={`${order.weight} т`} />
            </div>
          )}

          {tab === 'Спецификация' && (
            <div className="card" style={{ boxShadow: 'none' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Марка металла</th><th>Профиль</th><th>Количество</th><th>Вес</th><th>Толщина</th>
                  </tr>
                </thead>
                <tbody>
                  {order.spec.map((r, i) => (
                    <tr key={i}>
                      <td className="bold">{r.grade}</td>
                      <td>{r.profile}</td>
                      <td>{r.qty} шт</td>
                      <td>{r.weight} т</td>
                      <td>{r.thickness} мм</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'Документы' && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {order.documents.map((d, i) => (
                <div key={i} className="card card-pad row between" style={{ boxShadow: 'none' }}>
                  <div className="row gap12">
                    <span style={{
                      width: 40, height: 48, borderRadius: 8, background: `${DOC_COLOR[d.type]}18`,
                      color: DOC_COLOR[d.type], display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 11,
                    }}>{d.type}</span>
                    <div>
                      <div className="bold f13">{d.name}</div>
                      <div className="muted f12">{d.size}</div>
                    </div>
                  </div>
                  <button className="btn btn-sm">Открыть</button>
                </div>
              ))}
            </div>
          )}

          {tab === 'Фотографии' && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))' }}>
              {order.photos.map((p) => (
                <PhotoThumb key={p.id} kind={p.kind} label={`Фото: ${p.kind}`} />
              ))}
            </div>
          )}

          {tab === 'История' && (
            <div style={{ position: 'relative', paddingLeft: 8 }}>
              {order.history.slice().reverse().map((h, i, arr) => (
                <div key={i} className="row gap12" style={{ alignItems: 'flex-start', paddingBottom: i < arr.length - 1 ? 18 : 0, position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: h.note ? 'var(--amber-soft)' : 'var(--green-soft)',
                      color: h.note ? 'var(--amber)' : 'var(--green)',
                      display: 'grid', placeItems: 'center', flexShrink: 0, zIndex: 1,
                    }}>
                      {h.note ? <IconClock size={15} /> : <IconCheck size={15} />}
                    </span>
                    {i < arr.length - 1 && <span style={{ flex: 1, width: 2, background: 'var(--border)', minHeight: 24 }} />}
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <div className="row gap8">
                      <span className="bold f13">{h.action}</span>
                      <span className="muted f12">{h.time}</span>
                    </div>
                    <div className="muted f12 mt4">
                      {h.user}{h.note ? ` · ${h.note}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
