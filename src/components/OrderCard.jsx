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
  const { orders, moveOrder, addComment } = useStore()
  // берём актуальную версию заказа из стора
  const order = orders.find((o) => o.id === initial.id) || initial
  const [tab, setTab] = useState('Общее')
  const [doc, setDoc] = useState(null)       // открытый документ
  const [lightbox, setLightbox] = useState(null) // открытое фото
  const [comment, setComment] = useState('')

  const idx = stageIndex(order.stage)
  const next = STAGES[idx + 1]

  const submitComment = () => {
    if (!comment.trim()) return
    addComment(order.id, comment, 'Вы')
    setComment('')
  }

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
                  <button className="btn btn-sm" onClick={() => setDoc(d)}>Открыть</button>
                </div>
              ))}
            </div>
          )}

          {tab === 'Фотографии' && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))' }}>
              {order.photos.map((p) => (
                <button key={p.id} onClick={() => setLightbox(p)} style={{ padding: 0, border: 'none', background: 'none', cursor: 'zoom-in' }}>
                  <PhotoThumb kind={p.kind} label={`Фото: ${p.kind}`} />
                </button>
              ))}
            </div>
          )}

          {tab === 'История' && (
            <div style={{ position: 'relative', paddingLeft: 8 }}>
              <div className="row gap8" style={{ marginBottom: 20 }}>
                <input
                  className="search"
                  style={{ flex: 1 }}
                  placeholder="Добавить комментарий к заказу…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                />
                <button className="btn btn-primary btn-sm" onClick={submitComment}>Добавить</button>
              </div>
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

      {doc && <DocViewer doc={doc} order={order} onClose={() => setDoc(null)} />}
      {lightbox && <Lightbox photo={lightbox} order={order} onClose={() => setLightbox(null)} />}
    </div>
  )
}

// --- Просмотрщик документов ---
function DocViewer({ doc, order, onClose }) {
  const color = DOC_COLOR[doc.type] || '#475569'
  const download = () => {
    const content = `DVC Systems — ${doc.name}\nЗаказ: ${order.num}\nОбъект: ${order.object}\nКлиент: ${order.client}\n\nСпецификация:\n${order.spec.map((r) => ` • ${r.grade} ${r.profile} — ${r.qty} шт, ${r.weight} т, ${r.thickness} мм`).join('\n')}\n`
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = doc.name.replace(/\.(pdf|dwg|xlsx)$/i, '') + '.txt'
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="modal-overlay" style={{ zIndex: 120 }} onClick={onClose}>
      <div className="modal" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
          <div className="row gap12">
            <span style={{ width: 34, height: 42, borderRadius: 7, background: `${color}18`, color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 10 }}>{doc.type}</span>
            <div>
              <div className="bold f13">{doc.name}</div>
              <div className="muted f12">{order.num} · {doc.size}</div>
            </div>
          </div>
          <div className="row gap8">
            <button className="btn btn-sm" onClick={download}>Скачать</button>
            <button className="icon-btn" onClick={onClose}><IconClose /></button>
          </div>
        </div>
        <div style={{ padding: 24, background: '#eef1f6', maxHeight: '70vh', overflow: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: 'var(--shadow)', padding: 28, minHeight: 420 }}>
            {doc.type === 'XLS' ? (
              <table className="tbl">
                <thead><tr><th>Марка</th><th>Профиль</th><th>Кол-во</th><th>Вес</th><th>Толщина</th></tr></thead>
                <tbody>
                  {order.spec.map((r, i) => (
                    <tr key={i}><td className="bold">{r.grade}</td><td>{r.profile}</td><td>{r.qty} шт</td><td>{r.weight} т</td><td>{r.thickness} мм</td></tr>
                  ))}
                </tbody>
              </table>
            ) : doc.type === 'DWG' ? (
              <svg viewBox="0 0 600 380" style={{ width: '100%' }}>
                <rect x="0.5" y="0.5" width="599" height="379" fill="none" stroke="#cbd5e1" />
                <g stroke="#1e293b" strokeWidth="2" fill="none">
                  <path d="M80 300 H520 M110 300 V120 H490 V300 M110 120 L300 60 L490 120" />
                  <path d="M180 300 V150 M300 300 V90 M420 300 V150 M110 220 H490" />
                </g>
                <g stroke="#2563eb" strokeWidth="1" strokeDasharray="4 3">
                  <path d="M80 330 H520 M60 300 V120" />
                </g>
                <text x="300" y="360" textAnchor="middle" fontSize="13" fill="#64748b">Чертёж КМД · {order.object}</text>
              </svg>
            ) : (
              <div>
                <div className="bold" style={{ fontSize: 18 }}>{order.object}</div>
                <div className="muted mt4">{doc.name.replace('.pdf', '')} · {order.client}</div>
                <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
                {['Общие данные', 'Спецификация металлопроката', 'Узлы соединений', 'Требования к сварке', 'Антикоррозийная защита'].map((s, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div className="bold f13">{i + 1}. {s}</div>
                    <div style={{ height: 8, background: '#eef1f6', borderRadius: 4, marginTop: 6, width: '92%' }} />
                    <div style={{ height: 8, background: '#eef1f6', borderRadius: 4, marginTop: 6, width: '78%' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Лайтбокс фото ---
function Lightbox({ photo, order, onClose }) {
  return (
    <div className="modal-overlay" style={{ zIndex: 120, alignItems: 'center' }} onClick={onClose}>
      <div style={{ width: 'min(720px, 92vw)' }} onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ color: '#fff', marginBottom: 12 }}>
          <div className="bold">{order.num} · {photo.kind}</div>
          <button className="icon-btn" onClick={onClose}><IconClose /></button>
        </div>
        <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          <PhotoThumb kind={photo.kind} label={`Фото ${photo.kind} · ${order.object}`} />
        </div>
      </div>
    </div>
  )
}
