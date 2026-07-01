// ============================================================
//  Демо-данные производства ТОО «СТАЛЬ-ЭФФЕКТ»
//  Сид-генератор — данные стабильны между перезагрузками.
// ============================================================

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rnd = mulberry32(20260701)
const pick = (arr) => arr[Math.floor(rnd() * arr.length)]
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1))

// --- Этапы производства (колонки канбана) ---
export const STAGES = [
  { key: 'received', title: 'Получен заказ', short: 'Приём' },
  { key: 'design', title: 'Проектирование', short: 'Проект' },
  { key: 'purchase', title: 'Закупка', short: 'Закупка' },
  { key: 'cutting', title: 'Резка', short: 'Резка' },
  { key: 'drilling', title: 'Сверление', short: 'Сверление' },
  { key: 'welding', title: 'Сварка', short: 'Сварка' },
  { key: 'painting', title: 'Покраска', short: 'Покраска' },
  { key: 'assembly', title: 'Сборка', short: 'Сборка' },
  { key: 'qc', title: 'Контроль качества', short: 'ОТК' },
  { key: 'shipping', title: 'Отгрузка', short: 'Отгрузка' },
]
export const stageIndex = (k) => STAGES.findIndex((s) => s.key === k)
export const stageTitle = (k) => STAGES.find((s) => s.key === k)?.title ?? k

// --- Объекты / клиенты ---
const OBJECTS = [
  'ЖК «Астана Тауэрс»', 'ТРЦ «Хан Шатыр-2»', 'Завод «АлматыСталь»',
  'Мост через Ишим', 'Школа №42', 'Больница «Нур-Султан»',
  'Стадион «Астана Арена»', 'ЖК «Экспо Сити»', 'Складской комплекс «Логист»',
  'Ангар «КазТрансОйл»', 'Автосалон «Мега Авто»', 'БЦ «Изумруд»',
  'ЖК «Северное сияние»', 'Терминал аэропорта', 'Цех №3 «КазЦинк»',
  'Паркинг «Центральный»', 'ТЭЦ-2 эстакада', 'Гипермаркет «Магнум»',
  'ЖК «Ривер Парк»', 'Депо «Астана ЛРТ»', 'Элеватор «Костанай»',
  'Птицефабрика «Алель»', 'Каркас навеса «Хоргос»', 'Резервуар «КМГ»',
  'ЖК «Хайвилл»', 'Бизнес-парк «Технопарк»', 'Крытый рынок «Барыс»',
  'Ферма КРС «Есиль»', 'Мачта связи «Казтелеком»', 'Пешеходный мост «Есиль»',
]
const CLIENTS = [
  'BI Group', 'BAZIS-A', 'Highvill Kazakhstan', 'KUAT', 'Sensata Group',
  'КазТрансОйл', 'КазЦинк', 'КМГ', 'Магнум', 'Аким. г. Астаны',
]
const PRODUCTS = [
  'Металлокаркас', 'Балки перекрытия', 'Фермы кровельные', 'Колонны',
  'Лестничные марши', 'Ограждения', 'Закладные детали', 'Опоры ЛЭП',
  'Резервуар РВС', 'Эстакада', 'Навес', 'Рамы каркаса',
]
const GRADES = ['Ст3сп', '09Г2С', 'С245', 'С255', 'С345', '20', '40Х', 'С390']
const PROFILES = ['Двутавр 30Б1', 'Швеллер 20П', 'Уголок 63×5', 'Лист 10мм', 'Труба 108×4', 'Двутавр 45Б2']

const FIRST = ['Александр', 'Дмитрий', 'Сергей', 'Ержан', 'Нурлан', 'Алексей', 'Марат', 'Данияр', 'Виктор', 'Тимур', 'Асхат', 'Роман', 'Павел', 'Бауыржан']
const LAST = ['Петров', 'Иванов', 'Ахметов', 'Смирнов', 'Кузнецов', 'Оспанов', 'Сидоров', 'Нургалиев', 'Волков', 'Жумабеков', 'Соколов', 'Исаев', 'Ким', 'Тлеубаев']
function personName() {
  const f = pick(FIRST)
  const l = pick(LAST)
  return `${l} ${f[0]}.${pick(FIRST)[0]}.`
}

const PRIORITIES = ['обычный', 'обычный', 'обычный', 'срочный', 'срочный', 'критический']

function fmtDate(d) {
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
const TODAY = new Date('2026-07-01')

// --- Сотрудники (36) ---
const ROLES = ['Резчик', 'Оператор ЧПУ', 'Сварщик', 'Маляр', 'Сборщик', 'Контролёр ОТК', 'Стропальщик', 'Мастер', 'Технолог']
const STATUS_POOL = ['работает', 'работает', 'работает', 'работает', 'пауза', 'перегружен', 'отсутствует']

export const employees = Array.from({ length: 36 }, (_, i) => {
  const status = i < 26 ? 'работает' : pick(STATUS_POOL)
  return {
    id: i + 1,
    name: personName(),
    role: pick(ROLES),
    site: null, // проставим ниже
    status,
    shiftDone: int(2, 11),
    efficiency: int(78, 99),
  }
})

// --- Участки производства ---
export const sites = [
  {
    key: 'cutting', name: 'Резка', title: 'Резка', load: 72, status: 'green',
    workers: 5, queue: 6, avgTime: '38 мин', productivity: 96, note: 'Все по графику',
    equipment: [
      { name: 'Плазморез Hypertherm', state: 'работает' },
      { name: 'Ленточнопильный станок', state: 'работает' },
      { name: 'Гильотина НГ-16', state: 'работает' },
    ],
  },
  {
    key: 'drilling', name: 'Сверление', title: 'Сверление', load: 89, status: 'amber',
    workers: 4, queue: 9, avgTime: '52 мин', productivity: 88, note: 'Очередь увеличивается',
    equipment: [
      { name: 'Сверлильный центр Peddinghaus', state: 'работает' },
      { name: 'Радиально-сверлильный 2М55', state: 'работает' },
    ],
  },
  {
    key: 'welding', name: 'Сварка', title: 'Сварка', load: 68, status: 'green',
    workers: 8, queue: 5, avgTime: '1 ч 20 мин', productivity: 93, note: 'Все по графику',
    equipment: [
      { name: 'Полуавтомат Kemppi ×4', state: 'работает' },
      { name: 'Сварочный робот Fanuc', state: 'работает' },
      { name: 'Позиционер сварочный', state: 'работает' },
    ],
  },
  {
    key: 'painting', name: 'Покраска', title: 'Покраска', load: 97, status: 'red',
    workers: 3, queue: 14, avgTime: '2 ч 10 мин', productivity: 61, note: 'Остановка оборудования · недостаток краски',
    equipment: [
      { name: 'Окрасочная камера №1', state: 'работает' },
      { name: 'Окрасочная камера №2', state: 'простой' },
      { name: 'Сушильная камера', state: 'работает' },
    ],
  },
  {
    key: 'assembly', name: 'Сборка', title: 'Сборка', load: 64, status: 'green',
    workers: 6, queue: 4, avgTime: '3 ч 05 мин', productivity: 91, note: 'Все по графику',
    equipment: [
      { name: 'Сборочный стенд ×3', state: 'работает' },
      { name: 'Кран-балка 10т', state: 'работает' },
    ],
  },
  {
    key: 'qc', name: 'Контроль качества', title: 'ОТК', load: 55, status: 'green',
    workers: 2, queue: 3, avgTime: '25 мин', productivity: 97, note: 'Все по графику',
    equipment: [
      { name: 'УЗК-дефектоскоп', state: 'работает' },
      { name: 'Толщиномер покрытия', state: 'работает' },
    ],
  },
  {
    key: 'shipping', name: 'Отгрузка', title: 'Отгрузка', load: 41, status: 'green',
    workers: 4, queue: 2, avgTime: '1 ч 15 мин', productivity: 95, note: 'Все по графику',
    equipment: [
      { name: 'Козловой кран 20т', state: 'работает' },
      { name: 'Автопогрузчик ×2', state: 'работает' },
    ],
  },
]

// раскидываем сотрудников по участкам
let ei = 0
sites.forEach((s) => {
  for (let k = 0; k < s.workers && ei < employees.length; k++) {
    employees[ei++].site = s.name
  }
})
while (ei < employees.length) employees[ei++].site = pick(sites).name

// --- Распределение заказов по этапам (Покраска — узкое место) ---
const STAGE_DISTR = {
  received: 3, design: 4, purchase: 4, cutting: 5, drilling: 5,
  welding: 6, painting: 8, assembly: 5, qc: 4, shipping: 4,
}

const DOC_TEMPLATES = [
  { name: 'Спецификация КМ.pdf', type: 'PDF' },
  { name: 'Чертёж каркаса.dxf', type: 'DXF' },
  { name: 'Ведомость металла.xls', type: 'XLS' },
  { name: 'Схема сборки КМД.pdf', type: 'PDF' },
  { name: 'Акт ОТК.pdf', type: 'PDF' },
]
const PHOTO_KINDS = ['Готовность', 'Изделие', 'Контроль качества', 'Отгрузка']

function makeHistory(stage) {
  const idx = stageIndex(stage)
  const evs = []
  let h = 8, m = 5
  const push = (action, user, note) => {
    evs.push({ time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, action, user, note })
    m += int(20, 90)
    while (m >= 60) { m -= 60; h++ }
  }
  push('Заказ создан', personName())
  for (let i = 1; i <= idx; i++) {
    push(`Передано на «${STAGES[i].title}»`, personName())
  }
  if (stage === 'painting') push('Пауза', 'Оспанов Н.', 'Недостаток краски')
  return evs
}

let orderCounter = 180
export const orders = []
Object.entries(STAGE_DISTR).forEach(([stage, count]) => {
  for (let c = 0; c < count; c++) {
    orderCounter += int(1, 4)
    const idx = stageIndex(stage)
    const baseReady = Math.round((idx / (STAGES.length - 1)) * 100)
    const readiness = Math.min(99, Math.max(3, baseReady + int(-6, 6)))
    const priority = pick(PRIORITIES)
    // просрочки: несколько заказов с планом в прошлом
    const overdue = orders.length < 3 ? false : rnd() < 0.09
    const planOffset = overdue ? -int(1, 5) : int(1, 21)
    const planDate = new Date(TODAY)
    planDate.setDate(planDate.getDate() + planOffset)
    const startDate = new Date(TODAY)
    startDate.setDate(startDate.getDate() - int(3, 25))

    const weight = +(rnd() * 22 + 3).toFixed(1)
    const specRows = Array.from({ length: int(2, 4) }, () => {
      const w = +(rnd() * 6 + 0.6).toFixed(2)
      return {
        grade: pick(GRADES),
        profile: pick(PROFILES),
        qty: int(6, 120),
        weight: w,
        thickness: pick([6, 8, 10, 12, 14, 16, 20]),
      }
    })

    orders.push({
      id: orderCounter,
      num: `№${orderCounter}`,
      object: pick(OBJECTS),
      client: pick(CLIENTS),
      product: pick(PRODUCTS),
      stage,
      readiness,
      responsible: personName(),
      priority,
      overdue: overdue || (planOffset < 0),
      planDate: fmtDate(planDate),
      planRaw: planDate,
      startDate: fmtDate(startDate),
      weight,
      grade: specRows[0].grade,
      thickness: `${specRows[0].thickness} мм`,
      qty: specRows.reduce((a, r) => a + r.qty, 0),
      spec: specRows,
      documents: DOC_TEMPLATES.slice(0, int(3, 5)).map((d) => ({ ...d, size: `${int(120, 4200)} КБ` })),
      photos: PHOTO_KINDS.slice(0, Math.min(4, Math.max(1, Math.ceil((idx / 9) * 4)))).map((k, i) => ({
        kind: k, id: `${orderCounter}-${i}`,
      })),
      history: makeHistory(stage),
    })
  }
})

// --- KPI Dashboard ---
export const kpi = {
  inWork: 48,
  doneToday: 9,
  overdue: orders.filter((o) => o.overdue).length,
  productivity: 94,
  defect: 0.8,
  metalUsed: 18,
  activeStaff: 36,
  load: 87,
}

// --- График План/Факт по дням недели ---
export const weekPlanFact = [
  { day: 'Пн', план: 12, факт: 11 },
  { day: 'Вт', план: 13, факт: 14 },
  { day: 'Ср', план: 12, факт: 10 },
  { day: 'Чт', план: 14, факт: 13 },
  { day: 'Пт', план: 15, факт: 16 },
  { day: 'Сб', план: 9, факт: 9 },
  { day: 'Вс', план: 6, факт: 5 },
]

// --- Статусы заказов (круговая) ---
export const statusPie = [
  { name: 'В работе', value: 14, color: '#3a6099' },
  { name: 'Сварка', value: 6, color: '#4a7f8c' },
  { name: 'Покраска', value: 8, color: '#a97b38' },
  { name: 'Сборка', value: 5, color: '#6b6591' },
  { name: 'Отгрузка', value: 4, color: '#4f8a63' },
  { name: 'Завершено', value: 11, color: '#aab0b8' },
]

// --- Контроль металла ---
export const metal = {
  received: 120,
  used: 98,
  remainder: 22,
  loss: 1.4,
  consumption: [
    { day: 'Пн', расход: 14.2 },
    { day: 'Вт', расход: 16.8 },
    { day: 'Ср', расход: 12.1 },
    { day: 'Чт', расход: 18.4 },
    { day: 'Пт', расход: 19.6 },
    { day: 'Сб', расход: 9.2 },
    { day: 'Вс', расход: 7.7 },
  ],
  receipts: [
    { date: '30.06.2026', grade: '09Г2С', profile: 'Двутавр 45Б2', qty: '12.0 т', supplier: 'АрселорМиттал' },
    { date: '28.06.2026', grade: 'Ст3сп', profile: 'Лист 10мм', qty: '18.5 т', supplier: 'КазЦинк' },
    { date: '25.06.2026', grade: 'С345', profile: 'Швеллер 20П', qty: '9.3 т', supplier: 'Евраз' },
    { date: '22.06.2026', grade: 'С255', profile: 'Уголок 63×5', qty: '6.1 т', supplier: 'АрселорМиттал' },
  ],
  writeoffs: [
    { date: '01.07.2026', order: '№245', grade: '09Г2С', qty: '3.4 т', user: 'Петров А.А.' },
    { date: '01.07.2026', order: '№231', grade: 'Ст3сп', qty: '2.1 т', user: 'Иванов С.П.' },
    { date: '30.06.2026', order: '№218', grade: 'С345', qty: '5.8 т', user: 'Ахметов Е.Н.' },
    { date: '30.06.2026', order: '№207', grade: 'С255', qty: '1.9 т', user: 'Смирнов Д.А.' },
  ],
  stock: [
    { grade: '09Г2С', profile: 'Двутавр 45Б2', qty: 6.4, min: 4, unit: 'т' },
    { grade: 'Ст3сп', profile: 'Лист 10мм', qty: 8.1, min: 5, unit: 'т' },
    { grade: 'С345', profile: 'Швеллер 20П', qty: 2.2, min: 3, unit: 'т' },
    { grade: 'С255', profile: 'Уголок 63×5', qty: 3.6, min: 2, unit: 'т' },
    { grade: '20', profile: 'Труба 108×4', qty: 1.1, min: 2, unit: 'т' },
    { grade: 'С390', profile: 'Двутавр 30Б1', qty: 0.6, min: 1.5, unit: 'т' },
  ],
}

// --- Детали (отслеживание) ---
const PART_ROUTE = ['received', 'cutting', 'drilling', 'welding', 'painting', 'qc', 'assembly', 'shipping']
function makePart(mark, name, currentIdx, orderNum) {
  return {
    mark, name, order: orderNum,
    route: PART_ROUTE.map((stg, i) => {
      let state = 'Не начато'
      if (i < currentIdx) state = 'Выполнено'
      else if (i === currentIdx) state = 'В работе'
      else if (i === currentIdx + 1) state = 'Ожидает'
      const done = i <= currentIdx
      return {
        stage: stageTitle(stg),
        state,
        start: done ? `${8 + i}:${String(int(5, 55)).padStart(2, '0')}` : '—',
        end: i < currentIdx ? `${9 + i}:${String(int(5, 55)).padStart(2, '0')}` : '—',
        user: done ? personName() : '—',
        comment: stg === 'painting' && state === 'В работе' ? 'Грунтовка нанесена, сушка' : '',
      }
    }),
  }
}
export const parts = [
  makePart('Б-17', 'Балка двутавровая 45Б2', 4, '№245'),
  makePart('К-08', 'Колонна коробчатая', 6, '№231'),
  makePart('Ф-03', 'Ферма кровельная 24м', 2, '№218'),
  makePart('Л-12', 'Лестничный марш', 7, '№207'),
  makePart('О-45', 'Опора ЛЭП анкерная', 1, '№252'),
  makePart('Р-02', 'Рама каркаса РМ-2', 5, '№240'),
]

// --- Лента событий ---
export const initialEvents = [
  { id: 1, type: 'info', text: 'Заказ №245 переведён на «Покраску»', time: '14:32', user: 'Иванов С.' },
  { id: 2, type: 'success', text: 'Заказ №192 завершён и отгружен', time: '14:18', user: 'Петров А.' },
  { id: 3, type: 'info', text: 'Получено 12 тонн металла (09Г2С)', time: '13:55', user: 'Склад' },
  { id: 4, type: 'danger', text: 'Покраска остановлена — недостаток краски', time: '13:40', user: 'Оспанов Н.' },
  { id: 5, type: 'success', text: 'Завершена сварка каркаса заказа №231', time: '13:12', user: 'Смирнов Д.' },
  { id: 6, type: 'warning', text: 'Очередь на сверлении выросла до 9 заказов', time: '12:47', user: 'Система' },
  { id: 7, type: 'info', text: 'Новый заказ №253 поступил в производство', time: '12:20', user: 'Технолог' },
]

// --- Уведомления ---
export const initialNotifications = [
  { id: 1, type: 'danger', title: 'Заказ просрочен', text: 'Заказ №218 «Ферма кровельная» — срок истёк 3 дня назад', time: '5 мин назад', read: false },
  { id: 2, type: 'danger', title: 'Недостаточно металла', text: 'С390 Двутавр 30Б1 ниже минимального остатка (0.6 т)', time: '18 мин назад', read: false },
  { id: 3, type: 'warning', title: 'Оборудование простаивает', text: 'Окрасочная камера №2 в простое 42 мин', time: '25 мин назад', read: false },
  { id: 4, type: 'danger', title: 'Обнаружен брак', text: 'ОТК: заказ №207 — не соответствует толщина шва', time: '40 мин назад', read: false },
  { id: 5, type: 'success', title: 'Сотрудник завершил этап', time: '52 мин назад', text: 'Смирнов Д. завершил сварку заказа №231', read: true },
  { id: 6, type: 'info', title: 'Завтра отгрузка', text: '3 заказа запланированы к отгрузке на 02.07.2026', time: '1 ч назад', read: true },
  { id: 7, type: 'info', title: 'Новый заказ', text: 'Заказ №253 «БЦ Изумруд» поступил в производство', time: '1 ч назад', read: true },
]

// --- Ближайшие отгрузки (панель директора) ---
export const shipments = {
  today: orders.filter((o) => o.stage === 'shipping').slice(0, 3),
  tomorrow: orders.filter((o) => o.stage === 'qc').slice(0, 2),
  week: orders.filter((o) => o.stage === 'assembly').slice(0, 4),
}
