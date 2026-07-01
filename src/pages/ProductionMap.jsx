import { useStore } from '../store/Store.jsx'
import { useUI } from '../App.jsx'
import { ProgressBar, STATUS_DOT } from '../components/shared.jsx'
import { IconUsers, IconBox, IconClock, IconArrowR, IconFactory } from '../components/Icons.jsx'

const STATUS_META = {
  green: { label: 'Норма', cls: 'b-green', bar: 'var(--green)' },
  amber: { label: 'Требует внимания', cls: 'b-amber', bar: 'var(--amber)' },
  red: { label: 'Критично', cls: 'b-red', bar: 'var(--red)' },
}

function SiteCard({ site, onClick }) {
  const meta = STATUS_META[site.status]
  return (
    <button
      className="card"
      onClick={onClick}
      style={{
        textAlign: 'left', padding: 0, cursor: 'pointer', border: 'none',
        borderLeft: `4px solid ${STATUS_DOT[site.status]}`,
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div className="card-pad">
        <div className="row between">
          <div className="row gap8">
            <span className="dot" style={{ background: STATUS_DOT[site.status], width: 11, height: 11 }} />
            <span className="bold" style={{ fontSize: 16 }}>{site.name}</span>
          </div>
          <span className={`badge ${meta.cls}`}>{meta.label}</span>
        </div>

        <div className="row between mt16" style={{ alignItems: 'flex-end' }}>
          <div>
            <div className="muted f12">Загрузка</div>
            <div className="bold" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>{site.load}%</div>
          </div>
          <div className="row gap16 f13 text2">
            <span className="row gap8"><IconUsers size={15} /> {site.workers} чел.</span>
            <span className="row gap8"><IconBox size={15} /> {site.queue} в очереди</span>
          </div>
        </div>

        <div className="mt12">
          <ProgressBar value={site.load} color={meta.bar} />
        </div>

        <div className="row between mt12 f12">
          <span className="text2 row gap8"><IconClock size={14} /> {site.avgTime}</span>
          <span className={site.status === 'red' ? '' : 'muted'} style={{ color: site.status === 'red' ? 'var(--red)' : undefined, fontWeight: site.status === 'red' ? 600 : 400 }}>
            {site.note}
          </span>
        </div>
      </div>
    </button>
  )
}

export default function ProductionMap() {
  const { sites } = useStore()
  const { openSite } = useUI()

  const counts = {
    green: sites.filter((s) => s.status === 'green').length,
    amber: sites.filter((s) => s.status === 'amber').length,
    red: sites.filter((s) => s.status === 'red').length,
  }

  return (
    <div>
      <div className="row gap12 wrap" style={{ marginBottom: 20 }}>
        <span className="badge b-green" style={{ padding: '6px 14px' }}>🟢 Норма: {counts.green}</span>
        <span className="badge b-amber" style={{ padding: '6px 14px' }}>🟡 Внимание: {counts.amber}</span>
        <span className="badge b-red" style={{ padding: '6px 14px' }}>🔴 Критично: {counts.red}</span>
        <span className="muted f13" style={{ marginLeft: 'auto' }}>Нажмите на участок для деталей</span>
      </div>

      {/* Технологическая цепочка */}
      <div className="card card-pad" style={{ marginBottom: 20, overflowX: 'auto' }}>
        <div className="row gap8" style={{ minWidth: 'max-content' }}>
          {sites.map((s, i) => (
            <div key={s.key} className="row gap8">
              <div className="row gap8" style={{
                background: 'var(--bg-soft)', border: `1px solid var(--border)`,
                borderRadius: 30, padding: '7px 14px', fontSize: 13, fontWeight: 600,
              }}>
                <span className="dot" style={{ background: STATUS_DOT[s.status] }} />
                {s.name}
                <span className="muted">· {s.queue}</span>
              </div>
              {i < sites.length - 1 && <IconArrowR size={16} className="muted" />}
            </div>
          ))}
        </div>
      </div>

      {/* Карточки участков */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {sites.map((s) => (
          <SiteCard key={s.key} site={s} onClick={() => openSite(s)} />
        ))}
      </div>
    </div>
  )
}
