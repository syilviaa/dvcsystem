import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'
import { useStore } from '../store/Store.jsx'
import { useUI } from '../App.jsx'
import { STAGES, stageIndex } from '../data/mockData.js'
import { STATUS_DOT } from '../components/shared.jsx'
import {
  IconFactory, IconUsers, IconFire, IconTruck, IconAlert,
  IconTrend, IconGauge, IconClock, IconChevron,
} from '../components/Icons.jsx'

export default function DirectorPanel() {
  const { orders, sites, employees, kpi, flashKey } = useStore()
  const { setPage, openOrder } = useUI()
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    if (!flashKey) return
    setFlash(true); const t = setTimeout(() => setFlash(false), 1000); return () => clearTimeout(t)
  }, [flashKey])

  // Заказов на каждом участке
  const perStage = STAGES.map((s) => ({
    name: s.short, key: s.key,
    count: orders.filter((o) => o.stage === s.key).length,
    bottleneck: orders.filter((o) => o.stage === s.key).length >= 8,
  }))

  // Сотрудники по статусу
  const staff = {
    working: employees.filter((e) => e.status === 'работает').length,
    paused: employees.filter((e) => e.status === 'пауза').length,
    absent: employees.filter((e) => e.status === 'отсутствует').length,
    overloaded: employees.filter((e) => e.status === 'перегружен').length,
  }

  const bottlenecks = sites.filter((s) => s.status !== 'green')
  const overdueOrders = orders.filter((o) => o.overdue)
  const shipToday = orders.filter((o) => o.stage === 'shipping').slice(0, 3)
  const shipTomorrow = orders.filter((o) => o.stage === 'qc').slice(0, 3)
  const shipWeek = orders.filter((o) => o.stage === 'assembly').slice(0, 4)

  const Panel = ({ icon: Ico, title, right, children, accent }) => (
    <div className="card">
      <div className="card-head">
        <span style={{ color: accent || 'var(--primary)' }}><Ico size={18} /></span>
        <h3>{title}</h3>
        {right && <span className="sub" style={{ marginLeft: 'auto' }}>{right}</span>}
      </div>
      <div className="card-pad">{children}</div>
    </div>
  )

  const StaffPill = ({ label, value, color, soft }) => (
    <div style={{ flex: 1, background: soft, borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
      <div className="bold" style={{ fontSize: 26, color }}>{value}</div>
      <div className="f12" style={{ color, fontWeight: 600 }}>{label}</div>
    </div>
  )

  const Kpi = ({ label, value, unit }) => (
    <div style={{ textAlign: 'center', padding: '4px 0' }}>
      <div className="bold" style={{ fontSize: 22 }}>{value}<span className="unit" style={{ fontSize: 13 }}>{unit}</span></div>
      <div className="muted f12">{label}</div>
    </div>
  )

  return (
    <div>
      {/* Полоса-резюме */}
      <div className={`card card-pad ${flash ? 'flash' : ''}`} style={{ marginBottom: 18 }}>
        <div className="row between wrap gap16">
          <div>
            <div className="muted f12">Состояние предприятия · 01.07.2026</div>
            <div className="bold" style={{ fontSize: 20, marginTop: 4 }}>Производство работает · {bottlenecks.length} узких мест требуют внимания</div>
          </div>
          <div className="row gap16 wrap">
            <div style={{ textAlign: 'center' }}><div className="bold" style={{ fontSize: 26 }}>{kpi.inWork}</div><div className="muted f12">в работе</div></div>
            <div style={{ textAlign: 'center' }}><div className="bold" style={{ fontSize: 26, color: 'var(--green)' }}>{kpi.doneToday}</div><div className="muted f12">готово сегодня</div></div>
            <div style={{ textAlign: 'center' }}><div className="bold" style={{ fontSize: 26, color: 'var(--red)' }}>{overdueOrders.length}</div><div className="muted f12">просрочено</div></div>
            <div style={{ textAlign: 'center' }}><div className="bold" style={{ fontSize: 26, color: 'var(--amber)' }}>{kpi.load}%</div><div className="muted f12">загрузка</div></div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        {/* Производство по участкам */}
        <Panel icon={IconFactory} title="Производство" right="заказов на участке">
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perStage} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={0} angle={-18} dy={8} height={40} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e6e9f0', fontSize: 13 }} formatter={(v) => [`${v} заказов`, 'На участке']} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {perStage.map((p, i) => <Cell key={i} fill={p.bottleneck ? '#b85a54' : '#3a6099'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Сотрудники */}
        <Panel icon={IconUsers} title="Сотрудники" right={`всего ${employees.length}`} accent="var(--violet)">
          <div className="row gap8">
            <StaffPill label="работают" value={staff.working} color="var(--green)" soft="var(--green-soft)" />
            <StaffPill label="на паузе" value={staff.paused} color="var(--amber)" soft="var(--amber-soft)" />
            <StaffPill label="отсутствуют" value={staff.absent} color="var(--slate)" soft="var(--slate-soft)" />
            <StaffPill label="перегружены" value={staff.overloaded} color="var(--red)" soft="var(--red-soft)" />
          </div>
        </Panel>

        {/* Узкие места */}
        <Panel icon={IconFire} title="Узкие места" accent="var(--red)">
          {bottlenecks.length === 0 && <div className="muted">Узких мест нет — производство идёт ровно.</div>}
          {bottlenecks.map((s) => (
            <div key={s.key} className="row between" style={{
              padding: '12px 14px', marginBottom: 8, borderRadius: 12,
              background: s.status === 'red' ? 'var(--red-soft)' : 'var(--amber-soft)',
              cursor: 'pointer',
            }} onClick={() => setPage('map')}>
              <div className="row gap12">
                <span className="dot" style={{ background: STATUS_DOT[s.status], width: 11, height: 11 }} />
                <div>
                  <div className="bold f13">{s.name}</div>
                  <div className="f12" style={{ color: s.status === 'red' ? 'var(--red)' : 'var(--amber)' }}>{s.note}</div>
                </div>
              </div>
              <div className="row gap12">
                <span className="badge b-red">Очередь {s.queue}</span>
                <IconChevron size={16} className="muted" />
              </div>
            </div>
          ))}
        </Panel>

        {/* Просрочки */}
        <Panel icon={IconAlert} title="Просрочки" right={`${overdueOrders.length} заказов`} accent="var(--red)">
          {overdueOrders.length === 0 && <div className="muted">Просроченных заказов нет.</div>}
          <table className="tbl">
            <tbody>
              {overdueOrders.map((o) => (
                <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => openOrder(o)}>
                  <td className="bold" style={{ color: 'var(--primary)' }}>{o.num}</td>
                  <td>{o.object}</td>
                  <td className="muted f12">срок {o.planDate}</td>
                  <td><span className="badge b-red">задержка ресурсов</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        {/* Ближайшие отгрузки */}
        <Panel icon={IconTruck} title="Ближайшие отгрузки" accent="var(--green)">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {[['Сегодня', shipToday], ['Завтра', shipTomorrow], ['Через неделю', shipWeek]].map(([label, list]) => (
              <div key={label}>
                <div className="section-title" style={{ margin: '0 0 8px' }}>{label} · {list.length}</div>
                {list.map((o) => (
                  <div key={o.id} className="card card-pad" style={{ boxShadow: 'none', padding: 10, marginBottom: 8, cursor: 'pointer' }} onClick={() => openOrder(o)}>
                    <div className="bold f12" style={{ color: 'var(--primary)' }}>{o.num}</div>
                    <div className="f12">{o.object}</div>
                  </div>
                ))}
                {list.length === 0 && <div className="muted f12">—</div>}
              </div>
            ))}
          </div>
        </Panel>

        {/* KPI */}
        <Panel icon={IconGauge} title="KPI предприятия" accent="var(--cyan)">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', rowGap: 18 }}>
            <Kpi label="Производительность" value={kpi.productivity} unit="%" />
            <Kpi label="Брак" value={kpi.defect} unit="%" />
            <Kpi label="Скорость произв." value={kpi.doneToday} unit=" зак/д" />
            <Kpi label="Среднее время заказа" value="6.2" unit=" дн" />
            <Kpi label="Использование обор." value="83" unit="%" />
            <Kpi label="Загрузка персонала" value="87" unit="%" />
          </div>
        </Panel>
      </div>
    </div>
  )
}
