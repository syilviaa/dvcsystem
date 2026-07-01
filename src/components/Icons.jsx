// Набор иконок (stroke SVG). size по умолчанию 18.
const S = ({ children, size = 18, ...p }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    {children}
  </svg>
)

export const IconDashboard = (p) => (<S {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></S>)
export const IconMap = (p) => (<S {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></S>)
export const IconKanban = (p) => (<S {...p}><rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/></S>)
export const IconMetal = (p) => (<S {...p}><path d="M3 7 12 3l9 4-9 4-9-4Z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/></S>)
export const IconPart = (p) => (<S {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></S>)
export const IconMaster = (p) => (<S {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a2 2 0 0 0 2.8 2.8l6-6a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.4-.4-2.1 2.6-2.6Z"/></S>)
export const IconDirector = (p) => (<S {...p}><path d="M3 21V10l9-6 9 6v11"/><path d="M9 21v-6h6v6M3 21h18"/></S>)
export const IconBell = (p) => (<S {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></S>)
export const IconSearch = (p) => (<S {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></S>)
export const IconClock = (p) => (<S {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></S>)
export const IconUsers = (p) => (<S {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></S>)
export const IconTrend = (p) => (<S {...p}><path d="m3 17 6-6 4 4 8-8"/><path d="M17 7h4v4"/></S>)
export const IconCheck = (p) => (<S {...p}><path d="M20 6 9 17l-5-5"/></S>)
export const IconAlert = (p) => (<S {...p}><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></S>)
export const IconBox = (p) => (<S {...p}><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/></S>)
export const IconFactory = (p) => (<S {...p}><path d="M2 20h20M4 20V9l5 4V9l5 4V6l6 3v11"/><path d="M8 20v-4M14 20v-4"/></S>)
export const IconChart = (p) => (<S {...p}><path d="M3 3v18h18"/><path d="M7 14v3M12 9v8M17 5v12"/></S>)
export const IconFire = (p) => (<S {...p}><path d="M12 22a7 7 0 0 0 7-7c0-4-4-6-4-10 0 0-3 2-3 6 0-2-2-3-2-3s-5 3-5 8a7 7 0 0 0 7 6Z"/></S>)
export const IconTruck = (p) => (<S {...p}><path d="M14 17V6H1v11h2"/><path d="M14 8h4l3 3v6h-2"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/></S>)
export const IconPlay = (p) => (<S {...p}><path d="m6 4 14 8-14 8V4Z"/></S>)
export const IconPause = (p) => (<S {...p}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></S>)
export const IconStop = (p) => (<S {...p}><rect x="6" y="6" width="12" height="12" rx="2"/></S>)
export const IconArrowR = (p) => (<S {...p}><path d="M5 12h14M13 6l6 6-6 6"/></S>)
export const IconComment = (p) => (<S {...p}><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z"/></S>)
export const IconCamera = (p) => (<S {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></S>)
export const IconFile = (p) => (<S {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/></S>)
export const IconClose = (p) => (<S {...p}><path d="M18 6 6 18M6 6l12 12"/></S>)
export const IconMetalTons = (p) => (<S {...p}><path d="M3 7 12 3l9 4-9 4-9-4Z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/></S>)
export const IconPercent = (p) => (<S {...p}><path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></S>)
export const IconBug = (p) => (<S {...p}><rect x="8" y="6" width="8" height="14" rx="4"/><path d="M12 6V3M5 9l3 1M19 9l-3 1M4 15h4M16 15h4M6 20l2-2M18 20l-2-2"/></S>)
export const IconGauge = (p) => (<S {...p}><path d="M12 21a9 9 0 1 1 9-9"/><path d="M12 12 16 8"/></S>)
export const IconChevron = (p) => (<S {...p}><path d="m9 18 6-6-6-6"/></S>)
