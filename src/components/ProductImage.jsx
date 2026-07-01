// ============================================================
//  «Фотографии» изделий — реальные фото (Unsplash) по типу
//  снимка (готовность / изделие / контроль / отгрузка).
//  Если фото не загрузилось — показываем векторный запасной
//  вариант (SVG-сцена по типу металлоконструкции).
// ============================================================
import { useId, useState } from 'react'

// Фото по виду снимка заказа
const PHOTO_BY_KIND = {
  'Готовность': 'photo-1531834685032-c34bf0d84c77',       // монтаж каркаса / арматура
  'Изделие': 'photo-1504328345606-18bbc8c9d7d1',          // сварка металлоконструкции
  'Контроль качества': 'photo-1621905251189-08b45d6a269e', // замер / контроль
  'Отгрузка': 'photo-1565793298595-6a879b1d9492',          // отгрузка / логистика
}
// Запасные фото (общие производственные кадры)
const FALLBACK_PHOTOS = [
  'photo-1504307651254-35680f356dfd', // стройплощадка
  'photo-1516937941344-00b4e0337589', // завод
  'photo-1517646287270-a5a9ca602e5c', // металлообработка
  'photo-1541888946425-d81bb19240f5', // каркас
]

function photoUrl(id, w = 900) {
  return `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`
}

function pickPhotoId(kind, product) {
  if (kind && PHOTO_BY_KIND[kind]) return PHOTO_BY_KIND[kind]
  // стабильный выбор запасного фото по строке продукта
  const s = (product || '') + (kind || '')
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return FALLBACK_PHOTOS[h % FALLBACK_PHOTOS.length]
}

// ---- Векторный запасной вариант (если фото не загрузилось) ----
function sceneKey(product = '') {
  const p = product.toLowerCase()
  if (p.includes('ферм')) return 'truss'
  if (p.includes('балк')) return 'beams'
  if (p.includes('колонн')) return 'columns'
  if (p.includes('лестн')) return 'stairs'
  if (p.includes('огражд')) return 'railing'
  if (p.includes('заклад')) return 'plate'
  if (p.includes('опор') || p.includes('лэп')) return 'tower'
  if (p.includes('резервуар') || p.includes('рвс')) return 'tank'
  if (p.includes('эстакад')) return 'trestle'
  if (p.includes('навес')) return 'canopy'
  return 'frame'
}
const SKY = {
  frame: ['#1e3a8a', '#3b82f6'], beams: ['#334155', '#64748b'], truss: ['#0e7490', '#22d3ee'],
  columns: ['#3730a3', '#6366f1'], stairs: ['#7c2d12', '#ea580c'], railing: ['#155e75', '#0891b2'],
  plate: ['#374151', '#6b7280'], tower: ['#1e40af', '#60a5fa'], tank: ['#065f46', '#10b981'],
  trestle: ['#4c1d95', '#8b5cf6'], canopy: ['#9a3412', '#f59e0b'],
}
function Scene({ k }) {
  const steel = '#e2e8f0', steelDark = '#94a3b8'
  const S = { stroke: steel, strokeWidth: 2.4, fill: 'none', strokeLinejoin: 'round', strokeLinecap: 'round' }
  const F = { fill: 'rgba(226,232,240,.9)', stroke: steelDark, strokeWidth: 1 }
  switch (k) {
    case 'beams': return (<g>{[0, 1, 2].map((r) => (<g key={r} transform={`translate(${20 + r * 6}, ${86 - r * 22})`}><rect x="0" y="0" width="120" height="6" {...F} /><rect x="55" y="6" width="10" height="10" {...F} /><rect x="0" y="16" width="120" height="6" {...F} /></g>))}</g>)
    case 'truss': return (<g {...S}><path d="M15 85 L145 85 M15 85 L80 30 L145 85" /><path d="M45 85 L62 57 M75 85 L80 45 M105 85 L98 57 M62 57 L98 57 M80 45 L62 57 M80 45 L98 57" /></g>)
    case 'columns': return (<g>{[30, 65, 100].map((x) => (<g key={x} transform={`translate(${x},18)`} {...F}><rect x="0" y="0" width="26" height="6" /><rect x="9" y="6" width="8" height="72" /><rect x="0" y="78" width="26" height="6" /></g>))}</g>)
    case 'stairs': return (<g {...S}><path d="M20 92 L20 62 L50 62 L50 47 L80 47 L80 32 L110 32 L110 17 L140 17" /><path d="M20 92 L140 62" /></g>)
    case 'railing': return (<g {...S}><path d="M12 40 L148 40 M12 78 L148 78" />{[24, 44, 64, 84, 104, 124, 144].map((x) => <path key={x} d={`M${x} 40 L${x} 90`} />)}</g>)
    case 'plate': return (<g><rect x="34" y="30" width="92" height="60" rx="3" {...F} />{[[52, 48], [108, 48], [52, 72], [108, 72]].map(([cx, cy], i) => (<circle key={i} cx={cx} cy={cy} r="6" fill="#334155" stroke="#e2e8f0" strokeWidth="2" />))}</g>)
    case 'tower': return (<g {...S}><path d="M55 90 L72 20 L88 20 L105 90 M60 66 L100 66 M65 46 L95 46" /><path d="M40 30 L120 30 M55 90 L100 66 M105 90 L60 66" /></g>)
    case 'tank': return (<g><rect x="42" y="30" width="76" height="58" rx="4" {...F} /><ellipse cx="80" cy="30" rx="38" ry="9" {...F} /></g>)
    case 'trestle': return (<g {...S}><path d="M10 45 L150 45 M10 55 L150 55" />{[28, 60, 92, 124].map((x) => (<path key={x} d={`M${x} 55 L${x - 8} 90 M${x} 55 L${x + 8} 90`} />))}</g>)
    case 'canopy': return (<g {...S}><path d="M18 40 L142 30 L142 38 L18 48 Z" fill="rgba(226,232,240,.85)" /><path d="M30 48 L30 90 M130 38 L130 90" strokeWidth="3" /></g>)
    default: return (<g {...S}><rect x="30" y="20" width="100" height="72" /><path d="M30 44 L130 44 M30 68 L130 68 M63 20 L63 92 M97 20 L97 92" /></g>)
  }
}

export default function ProductImage({ product, kind, label, height, radius = 12, style }) {
  const id = useId().replace(/:/g, '')
  const [err, setErr] = useState(false)
  const photoId = pickPhotoId(kind, product)
  const wrap = {
    position: 'relative', width: '100%', height, aspectRatio: height ? undefined : '4/3',
    borderRadius: radius, overflow: 'hidden', background: '#1e293b', ...style,
  }

  return (
    <div style={wrap}>
      {!err ? (
        <img
          src={photoUrl(photoId, height && height > 300 ? 1200 : 800)}
          alt={label || kind || product || 'фото изделия'}
          onError={() => setErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={(SKY[sceneKey(product)] || SKY.frame)[0]} />
              <stop offset="100%" stopColor={(SKY[sceneKey(product)] || SKY.frame)[1]} />
            </linearGradient>
          </defs>
          <rect width="160" height="120" fill={`url(#sky${id})`} />
          <rect y="92" width="160" height="28" fill="rgba(0,0,0,0.22)" />
          <Scene k={sceneKey(product)} />
        </svg>
      )}
      {(label || kind) && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, padding: '6px 9px',
          background: 'linear-gradient(transparent, rgba(0,0,0,.65))',
          color: '#fff', fontSize: 11, fontWeight: 600,
        }}>
          {label || kind}
        </div>
      )}
    </div>
  )
}
