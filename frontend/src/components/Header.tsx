import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'

interface Props {
  title: string
  meta?: string[]
  prevId?: number | null
  nextId?: number | null
  showBack?: boolean
}

const btn =
  'flex h-9 min-w-9 items-center justify-center rounded-lg bg-white/10 px-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-30'

export default function Header({ title, meta, prevId, nextId, showBack }: Props) {
  const { theme, toggleTheme, increaseFont, decreaseFont } = useSettings()

  return (
    <header className="sticky top-0 z-10 border-b-2 border-gold-500 bg-brand-800 text-white shadow-md dark:bg-brand-900">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-3 py-2">
        {/* يمين: السورة السابقة + الرجوع */}
        <div className="flex items-center gap-1">
          {showBack && (
            <Link to="/" className={btn} title="كل السور">
              ☰
            </Link>
          )}
          {prevId ? (
            <Link to={`/surah/${prevId}`} className={btn} title="السورة السابقة">
              →
            </Link>
          ) : null}
        </div>

        {/* الوسط: العنوان */}
        <div className="min-w-0 flex-1 py-1 text-center">
  <h1 className="truncate font-quran text-2xl leading-[1.6] text-gold-400">
    {title}
  </h1>
  {meta && (
    <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/75">
      {meta.map((m, i) => (
        <span key={i} className="flex items-center gap-4">
          {i > 0 && <span className="text-gold-500">•</span>}
          {m}
        </span>
      ))}
    </p>
  )}
</div>

        {/* يسار: الإعدادات + السورة التالية */}
        <div className="flex items-center gap-1">
          <button onClick={decreaseFont} className={btn} title="تصغير الخط">
            A-
          </button>
          <button onClick={increaseFont} className={btn} title="تكبير الخط">
            A+
          </button>
          <button onClick={toggleTheme} className={btn} title="الوضع الليلي">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {nextId ? (
            <Link to={`/surah/${nextId}`} className={btn} title="السورة التالية">
              ←
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}