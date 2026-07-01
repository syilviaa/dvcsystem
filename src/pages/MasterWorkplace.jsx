import { useState } from 'react'
import { useStore } from '../store/Store.jsx'
import { useUI } from '../App.jsx'
import { STAGES, stageIndex, stageTitle } from '../data/mockData.js'
import { ProgressBar, PriorityBadge, readyColor } from '../components/shared.jsx'
import {
  IconPlay, IconPause, IconCheck, IconArrowR, IconComment,
  IconCamera, IconAlert, IconClock,
} from '../components/Icons.jsx'

const MY_STAGE = 'painting' // мастер участка «Покраска»

export default function MasterWorkplace() {
  const { orders, moveOrder, pushEvent, pushNotification } = useStore()
  const { openOrder } = useUI()
  const [work, setWork] = useState({}) // id -> 'working' | 'paused'
  const [toast, setToast] = useState(null)

  const mine = orders.filter((o) => o.stage === MY_STAGE)
  const overdue = mine.filter((o) => o.overdue)
  const waiting = mine.filter((o) => !work[o.id])
  const missingMaterials = mine.slice(0, 2) // демо: не хватает краски

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200) }

  const start = (o) => { setWork((w) => ({ ...w, [o.id]: 'working' })); pushEvent('info', `Начата покраска заказа ${o.num}`, 'Мастер'); flash(`Работа по ${o.num} начата`) }
  const pause = (o) => { setWork((w) => ({ ...w, [o.id]: 'paused' })); pushEvent('warning', `Пауза по заказу ${o.num}`, 'Мастер'); flash(`Заказ ${o.num} на паузе`) }
  const finish = (o) => { pushEvent('success', `Покраска заказа ${o.num} завершена`, 'Мастер'); flash(`Операция по ${o.num} завершена`) }
  const forward = (o) => {
    const next = STAGES[stageIndex(o.stage) + 1]
    if (next) { moveOrder(o.id, next.key, 'Мастер'); flash(`${o.num} передан на «${next.title}»`) }
    setWork((w) => { const c = { ...w }; delete c[o.id]; return c })
  }
  const problem = (o) => { pushNotification('danger', 'Сообщение о проблеме', `Мастер: проблема по заказу ${o.num} на покраске`); pushEvent('danger', `Проблема по заказу ${o.num}`, 'Мастер'); flash('Проблема отправлена руководителю') }
  const comment = (o) => { pushEvent('info', `Комментарий к заказу ${o.num} добавлен`, 'Мастер'); flash('Комментарий добавлен') }
  const photo = (o) => { pushEvent('info', `Фото прикреплено к заказу ${o.num}`, 'Мастер'); flash('Фотография прикреплена') }

  const Summary = ({ label, value, color, soft }) => (
    <div className="card card-pad">
      <div className="muted f12">{label}</div>
      <div className="bold mt4" style={{ fontSize: 26, color }}>{value}</div>
    </div>
  )

  return (
    <div>
      <div className="row between wrap" style={{ marginBottom: 18 }}>
        <div>
          <div className="bold" style={{ fontSize: 17 }}>Смена: участок «Покраска»</div>
          <div className="muted f13">Мастер · сегодня 01.07.2026 · 08:00–20:00</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        <Summary label="Задач на сегодня" value={mine.length} color="var(--primary)" />
        <Summary label="Просрочено" value={overdue.length} color="var(--red)" />
        <Summary label="Ожидает запуска" value={waiting.length} color="var(--amber)" />
        <Summary label="Нет материалов" value={missingMaterials.length} color="var(--red)" />
      </div>

      {missingMaterials.length > 0 && (
        <div className="card card-pad mt24" style={{ borderLeft: '4px solid var(--red)', background: 'var(--red-soft)' }}>
          <div className="row gap8 bold" style={{ color: 'var(--red)' }}>
            <IconAlert size={17} /> Отсутствуют материалы
          </div>
          <div className="f13 text2 mt4">Краска грунт-эмаль (серый RAL 7040) — недостаточно для {missingMaterials.length} заказов. Заявка на склад отправлена.</div>
        </div>
      )}

      <div className="section-title mt24">Сегодня необходимо выполнить</div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px,1fr))' }}>
        {mine.map((o) => {
          const st = work[o.id]
          return (
            <div key={o.id} className="card card-pad">
              <div className="row between">
                <div className="row gap8">
                  <button className="bold f13" style={{ color: 'var(--primary)', background: 'none', border: 'none', padding: 0 }} onClick={() => openOrder(o)}>{o.num}</button>
                  <PriorityBadge value={o.priority} />
                  {o.overdue && <span className="badge b-red">просрочен</span>}
                </div>
                <span className={`badge ${st === 'working' ? 'b-green' : st === 'paused' ? 'b-amber' : 'b-slate'}`}>
                  {st === 'working' ? 'в работе' : st === 'paused' ? 'на паузе' : 'ожидает'}
                </span>
              </div>
              <div className="bold mt8">{o.object}</div>
              <div className="muted f12 mt4">{o.product} · {o.weight} т</div>

              <div className="row gap12 mt12" style={{ alignItems: 'center' }}>
                <div style={{ flex: 1 }}><ProgressBar value={o.readiness} /></div>
                <span className="bold f12" style={{ color: readyColor(o.readiness) }}>{o.readiness}%</span>
              </div>
              <div className="row gap8 mt8 muted f12"><IconClock size={13} /> план {o.planDate}</div>

              <div className="row gap8 wrap mt16">
                {st !== 'working'
                  ? <button className="btn btn-green btn-sm" onClick={() => start(o)}><IconPlay size={14} /> Начать</button>
                  : <button className="btn btn-amber btn-sm" onClick={() => pause(o)}><IconPause size={14} /> Пауза</button>}
                <button className="btn btn-sm" onClick={() => finish(o)}><IconCheck size={14} /> Завершить</button>
                <button className="btn btn-primary btn-sm" onClick={() => forward(o)}><IconArrowR size={14} /> Передать далее</button>
              </div>
              <div className="row gap8 wrap mt8">
                <button className="btn btn-ghost btn-sm" onClick={() => comment(o)}><IconComment size={14} /> Комментарий</button>
                <button className="btn btn-ghost btn-sm" onClick={() => photo(o)}><IconCamera size={14} /> Фото</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => problem(o)}><IconAlert size={14} /> Проблема</button>
              </div>
            </div>
          )
        })}
      </div>

      {toast && (
        <div className="toast-in" style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text)', color: '#fff', padding: '12px 22px', borderRadius: 12,
          fontSize: 14, fontWeight: 600, boxShadow: 'var(--shadow-lg)', zIndex: 200,
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
