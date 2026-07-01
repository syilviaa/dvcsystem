// ============================================================
//  Генерация реальных файлов для скачивания (PDF / XLS / DXF).
//  PDF рисуется через canvas — кириллица отображается корректно.
// ============================================================
import { jsPDF } from 'jspdf'

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const baseName = (name) => name.replace(/\.[^.]+$/, '')

// ---------- PDF ----------
export function downloadPdf(order, doc) {
  // Рисуем страницу А4 (144 dpi) на canvas, затем вставляем в PDF как изображение
  const W = 1190, H = 1684
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const c = cv.getContext('2d')
  c.fillStyle = '#ffffff'; c.fillRect(0, 0, W, H)

  // Шапка
  c.fillStyle = '#0f172a'; c.fillRect(0, 0, W, 150)
  c.fillStyle = '#2563eb'; c.fillRect(80, 45, 60, 60)
  c.fillStyle = '#ffffff'; c.font = 'bold 40px Arial'; c.fillText('D', 96, 90)
  c.font = 'bold 34px Arial'; c.fillText('DVC Systems', 165, 78)
  c.fillStyle = '#94a3b8'; c.font = '22px Arial'; c.fillText('ТОО «СТАЛЬ-ЭФФЕКТ» · цифровой двойник производства', 165, 112)

  // Заголовок документа
  c.fillStyle = '#0f172a'; c.font = 'bold 44px Arial'; c.fillText(baseName(doc.name), 80, 240)
  c.fillStyle = '#475569'; c.font = '26px Arial'
  c.fillText(`Заказ ${order.num} · ${order.object}`, 80, 285)
  c.fillText(`Клиент: ${order.client}   ·   Изделие: ${order.product}`, 80, 325)

  c.strokeStyle = '#e6e9f0'; c.lineWidth = 2
  c.beginPath(); c.moveTo(80, 360); c.lineTo(W - 80, 360); c.stroke()

  // Параметры
  const params = [
    ['Статус', order.statusTitle || '—'],
    ['Дата начала', order.startDate],
    ['Плановая дата', order.planDate],
    ['Ответственный', order.responsible],
    ['Приоритет', order.priority],
    ['Общий вес', `${order.weight} т`],
  ]
  c.font = '24px Arial'
  let y = 420
  params.forEach((p, i) => {
    const x = 80 + (i % 2) * 540
    if (i % 2 === 0 && i > 0) y += 60
    c.fillStyle = '#94a3b8'; c.fillText(p[0], x, y)
    c.fillStyle = '#0f172a'; c.font = 'bold 26px Arial'; c.fillText(String(p[1]), x, y + 34)
    c.font = '24px Arial'
  })

  // Таблица спецификации
  y += 120
  c.fillStyle = '#0f172a'; c.font = 'bold 30px Arial'; c.fillText('Спецификация металлопроката', 80, y)
  y += 30
  const cols = ['Марка', 'Профиль', 'Кол-во', 'Вес', 'Толщина']
  const cx = [80, 320, 640, 800, 960]
  c.fillStyle = '#f1f5f9'; c.fillRect(80, y, W - 160, 50)
  c.fillStyle = '#475569'; c.font = 'bold 22px Arial'
  cols.forEach((h, i) => c.fillText(h, cx[i] + 14, y + 33))
  y += 50
  c.font = '24px Arial'
  order.spec.forEach((r) => {
    c.fillStyle = '#0f172a'
    const row = [r.grade, r.profile, `${r.qty} шт`, `${r.weight} т`, `${r.thickness} мм`]
    row.forEach((val, i) => c.fillText(String(val), cx[i] + 14, y + 33))
    c.strokeStyle = '#e6e9f0'; c.beginPath(); c.moveTo(80, y + 50); c.lineTo(W - 80, y + 50); c.stroke()
    y += 50
  })

  // Подвал
  c.fillStyle = '#94a3b8'; c.font = '20px Arial'
  c.fillText(`Сформировано DVC Systems · ${new Date().toLocaleString('ru-RU')}`, 80, H - 60)

  const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
  pdf.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 595, 842)
  pdf.save(baseName(doc.name) + '.pdf')
}

// ---------- Excel (SpreadsheetML 2003, открывается в Excel) ----------
export function downloadXls(order, doc) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const cell = (v, type = 'String') => `<Cell><Data ss:Type="${type}">${esc(v)}</Data></Cell>`
  const row = (cells) => `<Row>${cells}</Row>`
  const header = row(['Марка', 'Профиль', 'Количество, шт', 'Вес, т', 'Толщина, мм'].map((h) => cell(h)).join(''))
  const body = order.spec
    .map((r) => row(cell(r.grade) + cell(r.profile) + cell(r.qty, 'Number') + cell(r.weight, 'Number') + cell(r.thickness, 'Number')))
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Ведомость металла">
  <Table>
   ${row(cell(`Заказ ${order.num} — ${order.object}`))}
   ${row(cell(`Клиент: ${order.client}`))}
   ${row('')}
   ${header}
   ${body}
  </Table>
 </Worksheet>
</Workbook>`
  triggerDownload(new Blob(['﻿' + xml], { type: 'application/vnd.ms-excel;charset=utf-8' }), baseName(doc.name) + '.xls')
}

// ---------- DXF (векторный чертёж, открывается в AutoCAD/LibreCAD) ----------
export function downloadDxf(order, doc) {
  const L = (x1, y1, x2, y2) => `0\nLINE\n8\n0\n10\n${x1}\n20\n${y1}\n11\n${x2}\n21\n${y2}\n`
  const T = (x, y, h, txt) => `0\nTEXT\n8\n0\n10\n${x}\n20\n${y}\n40\n${h}\n1\n${txt}\n`
  // Простой каркас-рама
  let ent = ''
  ent += L(0, 0, 400, 0) + L(400, 0, 400, 300) + L(400, 300, 0, 300) + L(0, 300, 0, 0) // контур
  ent += L(0, 300, 200, 380) + L(200, 380, 400, 300) // кровля
  ent += L(100, 0, 100, 300) + L(200, 0, 200, 300) + L(300, 0, 300, 300) // стойки
  ent += L(0, 150, 400, 150) // ригель
  ent += T(10, 400, 18, `DVC Systems - ${order.num}`)
  const dxf = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${ent}0\nENDSEC\n0\nEOF\n`
  triggerDownload(new Blob([dxf], { type: 'application/dxf' }), baseName(doc.name) + '.dxf')
}

export function downloadDoc(order, doc) {
  if (doc.type === 'XLS') return downloadXls(order, doc)
  if (doc.type === 'DXF' || doc.type === 'DWG') return downloadDxf(order, doc)
  return downloadPdf(order, doc)
}
