import { useState } from 'react'
import { parts } from '../data/mockData.js'
import { IconSearch, IconCheck, IconClock, IconArrowR } from '../components/Icons.jsx'

const STATE_META = {
  'Выполнено': { cls: 'b-green', dot: 'var(--green)' },
  'В работе': { cls: 'b-blue', dot: 'var(--primary)' },
  'Ожидает': { cls: 'b-amber', dot: 'var(--amber)' },
  'Не начато': { cls: 'b-slate', dot: 'var(--border-strong)' },
}

function RouteStep({ step, last }) {
  const meta = STATE_META[step.state]
  const done = step.state === 'Выполнено'
  const active = step.state === 'В работе'
  return (
    <div className="row gap16" style={{ alignItems: 'stretch' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0, zIndex: 1,
          background: done ? 'var(--green)' : active ? 'var(--primary)' : 'var(--bg-panel)',
          border: `2px solid ${meta.dot}`,
          color: done || active ? '#fff' : 'var(--text-3)',
          display: 'grid', placeItems: 'center',
          boxShadow: active ? '0 0 0 4px var(--primary-soft)' : 'none',
        }}>
          {done ? <IconCheck size={17} /> : active ? <IconClock size={16} /> : ''}
        </span>
        {!last && <span style={{ flex: 1, width: 2, background: done ? 'var(--green)' : 'var(--border)', minHeight: 22 }} />}
      </div>
      <div className="card card-pad" style={{ flex: 1, marginBottom: 14, boxShadow: 'none', borderColor: active ? 'var(--primary)' : 'var(--border)' }}>
        <div className="row between">
          <span className="bold" style={{ fontSize: 14 }}>{step.stage}</span>
          <span className={`badge ${meta.cls}`}>{step.state}</span>
        </div>
        {(done || active) && (
          <div className="row gap16 mt8 f12 text2 wrap">
            <span>Начало: <b>{step.start}</b></span>
            <span>Окончание: <b>{step.end}</b></span>
            <span>Ответственный: <b>{step.user}</b></span>
          </div>
        )}
        {step.comment && <div className="muted f12 mt4">💬 {step.comment}</div>}
      </div>
    </div>
  )
}

export default function PartsTracking() {
  const [q, setQ] = useState('Б-17')
  const found = parts.filter(
    (p) => `${p.mark} ${p.name}`.toLowerCase().includes(q.toLowerCase()),
  )
  const active = found[0] || null

  return (
    <div>
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="search" style={{ maxWidth: 480 }}>
          <IconSearch size={18} />
          <input placeholder="Поиск детали — например, «Балка Б-17»" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="row gap8 wrap mt12">
          {parts.map((p) => (
            <button key={p.mark} className={`btn btn-sm ${active && active.mark === p.mark ? 'btn-primary' : ''}`} onClick={() => setQ(p.mark)}>
              {p.mark}
            </button>
          ))}
        </div>
      </div>

      {active ? (
        <div className="grid" style={{ gridTemplateColumns: '320px 1fr' }}>
          <div className="card card-pad" style={{ alignSelf: 'flex-start' }}>
            <div className="muted f12">Деталь</div>
            <div className="bold" style={{ fontSize: 22 }}>{active.mark}</div>
            <div className="text2 mt4">{active.name}</div>
            <div className="mt16 row between f13" style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <span className="muted">Заказ</span>
              <span className="bold" style={{ color: 'var(--primary)' }}>{active.order}</span>
            </div>
            <div className="row between f13 mt8">
              <span className="muted">Этапов пройдено</span>
              <span className="bold">
                {active.route.filter((s) => s.state === 'Выполнено').length} / {active.route.length}
              </span>
            </div>
            <div className="row between f13 mt8">
              <span className="muted">Текущий этап</span>
              <span className="badge b-blue">
                {active.route.find((s) => s.state === 'В работе')?.stage || 'завершён'}
              </span>
            </div>
          </div>

          <div className="card card-pad">
            <div className="section-title" style={{ marginTop: 0 }}>Маршрут детали по производству</div>
            {active.route.map((s, i) => (
              <RouteStep key={i} step={s} last={i === active.route.length - 1} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card card-pad muted center" style={{ padding: 48 }}>Деталь не найдена</div>
      )}
    </div>
  )
}
