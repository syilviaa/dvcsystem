import { useStore } from '../store/Store.jsx'
import { ProgressBar, STATUS_DOT } from './shared.jsx'
import { IconClose, IconUsers, IconClock, IconGauge, IconBox } from './Icons.jsx'

const STATUS_LABEL = { green: 'Норма', amber: 'Требует внимания', red: 'Критическая ситуация' }
const STATUS_CLS = { green: 'b-green', amber: 'b-amber', red: 'b-red' }

export default function SiteModal({ site, onClose }) {
  const { employees, orders } = useStore()
  const workers = employees.filter((e) => e.site === site.name).slice(0, site.workers)
  const queueOrders = orders.filter((o) => o.stage === site.key)

  const Stat = ({ ico: Ico, label, value, color }) => (
    <div className="card card-pad" style={{ boxShadow: 'none' }}>
      <div className="row gap8 muted f12"><Ico size={15} /> {label}</div>
      <div className="bold mt4" style={{ fontSize: 22, color }}>{value}</div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 760 }} onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
          <div className="row gap12">
            <span className="dot" style={{ background: STATUS_DOT[site.status], width: 13, height: 13 }} />
            <div>
              <div className="bold" style={{ fontSize: 19 }}>{site.name}</div>
              <span className={`badge ${STATUS_CLS[site.status]} mt4`}>{STATUS_LABEL[site.status]}</span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><IconClose /></button>
        </div>

        <div style={{ padding: 24 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <Stat ico={IconGauge} label="Загрузка" value={`${site.load}%`} color={STATUS_DOT[site.status]} />
            <Stat ico={IconUsers} label="Работников" value={site.workers} />
            <Stat ico={IconClock} label="Среднее время" value={site.avgTime} />
            <Stat ico={IconGauge} label="Производительность" value={`${site.productivity}%`} />
          </div>
          <div className="mt12"><ProgressBar value={site.load} color={STATUS_DOT[site.status]} /></div>

          <div className="grid mt24" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* Оборудование */}
            <div className="card">
              <div className="card-head"><h3 style={{ fontSize: 14 }}>Оборудование</h3></div>
              <div style={{ padding: '4px 16px 12px' }}>
                {site.equipment.map((eq, i) => (
                  <div key={i} className="row between" style={{ padding: '10px 0', borderBottom: i < site.equipment.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span className="f13">{eq.name}</span>
                    <span className={`badge ${eq.state === 'работает' ? 'b-green' : 'b-red'}`}>{eq.state}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Работники */}
            <div className="card">
              <div className="card-head"><h3 style={{ fontSize: 14 }}>Работники смены</h3></div>
              <div style={{ padding: '4px 16px 12px' }}>
                {workers.map((w, i) => (
                  <div key={w.id} className="row between" style={{ padding: '10px 0', borderBottom: i < workers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <div className="f13 bold">{w.name}</div>
                      <div className="muted f12">{w.role}</div>
                    </div>
                    <span className={`badge ${w.status === 'работает' ? 'b-green' : w.status === 'перегружен' ? 'b-red' : w.status === 'пауза' ? 'b-amber' : 'b-slate'}`}>{w.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Очередь заказов */}
          <div className="card mt24">
            <div className="card-head">
              <h3 style={{ fontSize: 14 }}>Очередь заказов</h3>
              <span className="sub">{queueOrders.length} в очереди</span>
            </div>
            <div style={{ maxHeight: 220, overflow: 'auto' }}>
              <table className="tbl">
                <tbody>
                  {queueOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="bold">{o.num}</td>
                      <td>{o.object}</td>
                      <td className="muted">{o.product}</td>
                      <td style={{ width: 120 }}><ProgressBar value={o.readiness} /></td>
                      <td className="bold" style={{ width: 44 }}>{o.readiness}%</td>
                    </tr>
                  ))}
                  {queueOrders.length === 0 && (
                    <tr><td className="muted center" colSpan={5} style={{ padding: 24 }}>Очередь пуста</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
