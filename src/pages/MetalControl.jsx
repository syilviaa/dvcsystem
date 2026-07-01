import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { metal } from '../data/mockData.js'
import { ProgressBar } from '../components/shared.jsx'
import { IconMetal, IconSearch, IconArrowR } from '../components/Icons.jsx'

function Stat({ label, value, unit, color, soft }) {
  return (
    <div className="kpi">
      <div className="kpi-top">
        <div className="kpi-ico" style={{ background: soft, color }}><IconMetal size={20} /></div>
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value mt4">{value}<span className="unit">{unit}</span></div>
    </div>
  )
}

export default function MetalControl() {
  const [q, setQ] = useState('')
  const stock = metal.stock.filter(
    (s) => (s.grade + s.profile).toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div>
      <div className="kpi-grid">
        <Stat label="Получено" value={metal.received} unit="т" color="var(--primary)" soft="var(--primary-soft)" />
        <Stat label="Использовано" value={metal.used} unit="т" color="var(--cyan)" soft="var(--cyan-soft)" />
        <Stat label="Остаток" value={metal.remainder} unit="т" color="var(--green)" soft="var(--green-soft)" />
        <Stat label="Потери" value={metal.loss} unit="т" color="var(--red)" soft="var(--red-soft)" />
      </div>

      <div className="card mt24">
        <div className="card-head">
          <h3>График расхода металла</h3>
          <span className="sub">тонн в день · текущая неделя</span>
        </div>
        <div className="card-pad" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metal.consumption} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e6e9f0', fontSize: 13 }} formatter={(v) => [`${v} т`, 'Расход']} />
              <Area type="monotone" dataKey="расход" stroke="#2563eb" strokeWidth={3} fill="url(#gm)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid mt24" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="card-head"><h3>Последние поступления</h3></div>
          <table className="tbl">
            <thead><tr><th>Дата</th><th>Марка</th><th>Профиль</th><th>Кол-во</th><th>Поставщик</th></tr></thead>
            <tbody>
              {metal.receipts.map((r, i) => (
                <tr key={i}>
                  <td className="muted">{r.date}</td>
                  <td className="bold">{r.grade}</td>
                  <td>{r.profile}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 700 }}>+{r.qty}</td>
                  <td className="muted">{r.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head"><h3>Последние списания</h3></div>
          <table className="tbl">
            <thead><tr><th>Дата</th><th>Заказ</th><th>Марка</th><th>Кол-во</th><th>Кто</th></tr></thead>
            <tbody>
              {metal.writeoffs.map((r, i) => (
                <tr key={i}>
                  <td className="muted">{r.date}</td>
                  <td className="bold" style={{ color: 'var(--primary)' }}>{r.order}</td>
                  <td>{r.grade}</td>
                  <td style={{ color: 'var(--red)', fontWeight: 700 }}>−{r.qty}</td>
                  <td className="muted">{r.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt24">
        <div className="card-head">
          <h3>Складские остатки</h3>
          <div style={{ marginLeft: 'auto', width: 280 }}>
            <div className="search">
              <IconSearch size={16} />
              <input placeholder="Поиск по материалам…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
        </div>
        <table className="tbl">
          <thead><tr><th>Марка</th><th>Профиль</th><th>Остаток</th><th>Мин. запас</th><th style={{ width: 220 }}>Уровень</th><th>Статус</th></tr></thead>
          <tbody>
            {stock.map((s, i) => {
              const low = s.qty < s.min
              const pct = Math.min(100, (s.qty / (s.min * 2)) * 100)
              return (
                <tr key={i}>
                  <td className="bold">{s.grade}</td>
                  <td>{s.profile}</td>
                  <td className="bold">{s.qty} {s.unit}</td>
                  <td className="muted">{s.min} {s.unit}</td>
                  <td><ProgressBar value={pct} color={low ? 'var(--red)' : 'var(--green)'} /></td>
                  <td><span className={`badge ${low ? 'b-red' : 'b-green'}`}>{low ? 'ниже минимума' : 'в норме'}</span></td>
                </tr>
              )
            })}
            {stock.length === 0 && <tr><td colSpan={6} className="muted center" style={{ padding: 24 }}>Ничего не найдено</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
