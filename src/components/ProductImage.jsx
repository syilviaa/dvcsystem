// ============================================================
//  «Фотографии» изделий — детальные SVG-иллюстрации по типу
//  металлоконструкции. Надёжно (векторные), всегда доступны.
// ============================================================
import { useId } from 'react'

// Соответствие типа изделия → сцена
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
  return 'frame' // Металлокаркас / Рамы каркаса и по умолчанию
}

const SKY = {
  frame: ['#1e3a8a', '#3b82f6'],
  beams: ['#334155', '#64748b'],
  truss: ['#0e7490', '#22d3ee'],
  columns: ['#3730a3', '#6366f1'],
  stairs: ['#7c2d12', '#ea580c'],
  railing: ['#155e75', '#0891b2'],
  plate: ['#374151', '#6b7280'],
  tower: ['#1e40af', '#60a5fa'],
  tank: ['#065f46', '#10b981'],
  trestle: ['#4c1d95', '#8b5cf6'],
  canopy: ['#9a3412', '#f59e0b'],
}

function Scene({ k }) {
  const steel = '#e2e8f0'
  const steelDark = '#94a3b8'
  const S = { stroke: steel, strokeWidth: 2.4, fill: 'none', strokeLinejoin: 'round', strokeLinecap: 'round' }
  const F = { fill: 'rgba(226,232,240,.9)', stroke: steelDark, strokeWidth: 1 }
  switch (k) {
    case 'beams': // двутавровые балки штабелем
      return (
        <g>
          {[0, 1, 2].map((r) => (
            <g key={r} transform={`translate(${20 + r * 6}, ${86 - r * 22})`}>
              <rect x="0" y="0" width="120" height="6" {...F} />
              <rect x="55" y="6" width="10" height="10" {...F} />
              <rect x="0" y="16" width="120" height="6" {...F} />
            </g>
          ))}
        </g>
      )
    case 'truss': // кровельная ферма
      return (
        <g {...S}>
          <path d="M15 85 L145 85 M15 85 L80 30 L145 85" />
          <path d="M45 85 L62 57 M75 85 L80 45 M105 85 L98 57 M62 57 L98 57 M80 45 L62 57 M80 45 L98 57" />
          <path d="M15 90 L145 90" strokeDasharray="4 4" opacity="0.5" />
        </g>
      )
    case 'columns': // колонны H-профиля
      return (
        <g>
          {[30, 65, 100].map((x) => (
            <g key={x} transform={`translate(${x},18)`} {...F}>
              <rect x="0" y="0" width="26" height="6" />
              <rect x="9" y="6" width="8" height="72" />
              <rect x="0" y="78" width="26" height="6" />
            </g>
          ))}
          <path d="M12 92 L148 92" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
        </g>
      )
    case 'stairs': // лестничный марш
      return (
        <g {...S}>
          <path d="M20 92 L20 62 L50 62 L50 47 L80 47 L80 32 L110 32 L110 17 L140 17" />
          <path d="M20 92 L140 62" />
          <path d="M35 77 L35 92 M65 62 L65 92 M95 47 L95 92 M125 32 L125 92" opacity="0.7" />
        </g>
      )
    case 'railing': // ограждение
      return (
        <g {...S}>
          <path d="M12 40 L148 40 M12 78 L148 78" />
          {[24, 44, 64, 84, 104, 124, 144].map((x) => <path key={x} d={`M${x} 40 L${x} 90`} />)}
          <path d="M12 90 L148 90" strokeWidth="3" />
        </g>
      )
    case 'plate': // закладная деталь (пластина с отверстиями)
      return (
        <g>
          <rect x="34" y="30" width="92" height="60" rx="3" {...F} />
          {[[52, 48], [108, 48], [52, 72], [108, 72]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="6" fill="#334155" stroke="#e2e8f0" strokeWidth="2" />
          ))}
          <path d="M80 30 L80 90" stroke="#94a3b8" strokeDasharray="3 3" opacity="0.5" />
        </g>
      )
    case 'tower': // опора ЛЭП
      return (
        <g {...S}>
          <path d="M55 90 L72 20 L88 20 L105 90 M60 66 L100 66 M65 46 L95 46" />
          <path d="M72 20 L88 20 M40 30 L120 30 M46 22 L114 22" />
          <path d="M55 90 L100 66 M105 90 L60 66 M60 66 L95 46 M100 66 L65 46" opacity="0.8" />
        </g>
      )
    case 'tank': // резервуар РВС
      return (
        <g>
          <rect x="42" y="30" width="76" height="58" rx="4" {...F} />
          <ellipse cx="80" cy="30" rx="38" ry="9" {...F} />
          <path d="M42 50 L118 50 M42 68 L118 68" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M80 21 L80 15 L90 15" {...S} />
        </g>
      )
    case 'trestle': // эстакада
      return (
        <g {...S}>
          <path d="M10 45 L150 45 M10 55 L150 55" />
          {[28, 60, 92, 124].map((x) => (
            <path key={x} d={`M${x} 55 L${x - 8} 90 M${x} 55 L${x + 8} 90 M${x - 5} 74 L${x + 5} 74`} />
          ))}
        </g>
      )
    case 'canopy': // навес
      return (
        <g {...S}>
          <path d="M18 40 L142 30 L142 38 L18 48 Z" fill="rgba(226,232,240,.85)" />
          <path d="M30 48 L30 90 M130 38 L130 90" strokeWidth="3" />
          <path d="M30 60 L130 50" opacity="0.6" />
          <path d="M14 92 L148 92" strokeDasharray="4 4" opacity="0.5" />
        </g>
      )
    default: // frame — металлокаркас здания
      return (
        <g {...S}>
          <rect x="30" y="20" width="100" height="72" />
          <path d="M30 44 L130 44 M30 68 L130 68 M63 20 L63 92 M97 20 L97 92" />
          <path d="M30 44 L63 20 M63 44 L97 20 M97 44 L130 20" opacity="0.55" />
        </g>
      )
  }
}

export default function ProductImage({ product, kind, label, height, radius = 12, style }) {
  const id = useId().replace(/:/g, '')
  const k = sceneKey(product)
  const [c1, c2] = SKY[k] || SKY.frame
  return (
    <div style={{ position: 'relative', width: '100%', height, aspectRatio: height ? undefined : '4/3', borderRadius: radius, overflow: 'hidden', ...style }}>
      <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
          <radialGradient id={`vig${id}`} cx="50%" cy="35%" r="75%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </radialGradient>
        </defs>
        <rect width="160" height="120" fill={`url(#sky${id})`} />
        {/* пол цеха */}
        <rect y="92" width="160" height="28" fill="rgba(0,0,0,0.22)" />
        <Scene k={k} />
        <rect width="160" height="120" fill={`url(#vig${id})`} />
      </svg>
      {(label || kind) && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, padding: '6px 9px',
          background: 'linear-gradient(transparent, rgba(0,0,0,.6))',
          color: '#fff', fontSize: 11, fontWeight: 600,
        }}>
          {label || kind}
        </div>
      )}
    </div>
  )
}
