import { IconCheck, IconAlert, IconBox, IconTruck, IconBell } from './Icons.jsx'

// Цвет прогресс-бара по готовности
export function readyColor(v) {
  if (v >= 80) return 'var(--green)'
  if (v >= 40) return 'var(--primary)'
  return 'var(--amber)'
}

export function ProgressBar({ value, color }) {
  return (
    <div className="pbar">
      <span style={{ width: `${value}%`, background: color || readyColor(value) }} />
    </div>
  )
}

const PRIO = {
  обычный: 'b-slate',
  срочный: 'b-amber',
  критический: 'b-red',
}
export function PriorityBadge({ value }) {
  return <span className={`badge ${PRIO[value] || 'b-slate'}`}>{value}</span>
}

// Цвет бейджа по этапу
const STAGE_STYLE = {
  received: 'b-slate', design: 'b-violet', purchase: 'b-slate',
  cutting: 'b-blue', drilling: 'b-cyan', welding: 'b-blue',
  painting: 'b-amber', assembly: 'b-violet', qc: 'b-cyan', shipping: 'b-green',
}
export function StageBadge({ stageKey, title }) {
  return <span className={`badge ${STAGE_STYLE[stageKey] || 'b-slate'}`}>{title}</span>
}

// Плитка-«фотография» изделия (стилизованный плейсхолдер)
const PHOTO_GRAD = {
  Готовность: 'linear-gradient(135deg,#334155,#475569)',
  Изделие: 'linear-gradient(135deg,#1e40af,#3b82f6)',
  'Контроль качества': 'linear-gradient(135deg,#0e7490,#06b6d4)',
  Отгрузка: 'linear-gradient(135deg,#166534,#22c55e)',
}
export function PhotoThumb({ kind, label }) {
  return (
    <div
      style={{
        aspectRatio: '4/3',
        borderRadius: 12,
        background: PHOTO_GRAD[kind] || '#475569',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <svg viewBox="0 0 120 90" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <g stroke="#fff" strokeWidth="2" fill="none" opacity="0.6">
          <path d="M10 70 H110 M20 70 V30 H100 V70 M20 30 L60 12 L100 30" />
          <path d="M35 70 V40 M60 70 V25 M85 70 V40 M20 50 H100" />
        </g>
      </svg>
      <div style={{
        position: 'relative', width: '100%', padding: '8px 10px',
        background: 'linear-gradient(transparent, rgba(0,0,0,.55))',
        color: '#fff', fontSize: 11.5, fontWeight: 600,
      }}>
        {label || kind}
      </div>
    </div>
  )
}

const EV = {
  success: { cls: 'b-green', Icon: IconCheck },
  danger: { cls: 'b-red', Icon: IconAlert },
  warning: { cls: 'b-amber', Icon: IconAlert },
  info: { cls: 'b-blue', Icon: IconBox },
}
export function EventItem({ ev }) {
  const { cls, Icon } = EV[ev.type] || EV.info
  return (
    <div className="row gap12" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
      <span className={`badge ${cls}`} style={{ width: 28, height: 28, padding: 0, justifyContent: 'center', borderRadius: 9, flexShrink: 0 }}>
        <Icon size={15} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.text}</div>
        <div className="muted f12 mt4">{ev.time} · {ev.user}</div>
      </div>
    </div>
  )
}

export const STATUS_DOT = {
  green: 'var(--green)',
  amber: 'var(--amber)',
  red: 'var(--red)',
}
