import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useStore } from '../store/Store.jsx'
import { weekPlanFact, statusPie } from '../data/mockData.js'
import { EventItem } from '../components/shared.jsx'
import {
  IconBox, IconCheck, IconAlert, IconTrend, IconBug,
  IconMetal, IconUsers, IconGauge,
} from '../components/Icons.jsx'

function KpiCard({ ico: Ico, color, soft, label, value, unit, trend, flash }) {
  return (
    <div className={`kpi ${flash ? 'flash' : ''}`}>
      <div className="kpi-top">
        <div className="kpi-ico" style={{ background: soft, color }}>
          <Ico size={20} />
        </div>
        {trend && (
          <span className={`kpi-trend ${trend.dir}`}>
            {trend.text}
          </span>
        )}
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value mt4">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { kpi, events, flashKey } = useStore()
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    if (!flashKey) return
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 1000)
    return () => clearTimeout(t)
  }, [flashKey])

  const cards = [
    { ico: IconBox, color: 'var(--primary)', soft: 'var(--primary-soft)', label: 'Заказов в работе', value: kpi.inWork, trend: { dir: 'trend-up', text: '↑ 4 за неделю' } },
    { ico: IconCheck, color: 'var(--green)', soft: 'var(--green-soft)', label: 'Выполнено сегодня', value: kpi.doneToday, trend: { dir: 'trend-up', text: '↑ план 8' } },
    { ico: IconAlert, color: 'var(--red)', soft: 'var(--red-soft)', label: 'Просрочено', value: kpi.overdue, trend: { dir: 'trend-down', text: '↓ было 5' } },
    { ico: IconTrend, color: 'var(--green)', soft: 'var(--green-soft)', label: 'Производительность', value: kpi.productivity, unit: '%', trend: { dir: 'trend-up', text: '↑ 2%' } },
    { ico: IconBug, color: 'var(--amber)', soft: 'var(--amber-soft)', label: 'Брак', value: kpi.defect, unit: '%', trend: { dir: 'trend-down', text: '↓ 0.3%' } },
    { ico: IconMetal, color: 'var(--cyan)', soft: 'var(--cyan-soft)', label: 'Израсходовано металла', value: kpi.metalUsed, unit: 'т', trend: { dir: 'trend-flat', text: 'сегодня' } },
    { ico: IconUsers, color: 'var(--violet)', soft: 'var(--violet-soft)', label: 'Активных сотрудников', value: kpi.activeStaff, trend: { dir: 'trend-flat', text: 'из 41' } },
    { ico: IconGauge, color: 'var(--amber)', soft: 'var(--amber-soft)', label: 'Загруженность производства', value: kpi.load, unit: '%', trend: { dir: 'trend-up', text: 'высокая' } },
  ]

  return (
    <div>
      {/* KPI */}
      <div className="kpi-grid">
        {cards.map((c, i) => (
          <KpiCard key={i} {...c} flash={flash} />
        ))}
      </div>

      {/* Графики */}
      <div className="grid mt24" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <div className="card">
          <div className="card-head">
            <h3>Выполнение плана</h3>
            <span className="sub">План / Факт · текущая неделя</span>
          </div>
          <div className="card-pad" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekPlanFact} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e6e9f0', fontSize: 13 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="план" stroke="#94a3b8" strokeWidth={2.5} dot={{ r: 3 }} strokeDasharray="5 4" isAnimationActive={false} />
                <Line type="monotone" dataKey="факт" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Статусы заказов</h3>
            <span className="sub">Всего 48</span>
          </div>
          <div className="card-pad" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={92} paddingAngle={2} isAnimationActive={false}>
                  {statusPie.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e6e9f0', fontSize: 13 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11.5 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Лента событий */}
      <div className="card mt24">
        <div className="card-head">
          <h3>Последние события</h3>
          <span className="sub">Лента активности в реальном времени</span>
        </div>
        <div className="card-pad" style={{ paddingTop: 4, paddingBottom: 4, maxHeight: 360, overflow: 'auto' }}>
          {events.slice(0, 12).map((ev) => (
            <EventItem key={ev.id} ev={ev} />
          ))}
        </div>
      </div>
    </div>
  )
}
