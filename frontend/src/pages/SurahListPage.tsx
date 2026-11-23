import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSurahs } from '../api/quran'
import Header from '../components/Header'
import type { Surah } from '../types/quran'
import { getLastRead } from '../lib/lastRead'

export default function SurahListPage() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRead] = useState(() => getLastRead())

  useEffect(() => {
    getSurahs()
      .then(setSurahs)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Header title="القرآن الكريم" meta={['١١٤ سورة']} />
   
      <main className="mx-auto max-w-5xl p-4">
        <Link
  to="/search"
  className="mb-5 flex items-center gap-3 rounded-xl border border-gold-500/50 bg-white px-4 py-3 text-stone-500 shadow-sm transition hover:border-gold-500 dark:bg-brand-900/60 dark:text-stone-400"
>
  <span>🔍</span>
  <span>ابحث في القرآن الكريم...</span>
    </Link>
        {lastRead && (
  <Link
    to={`/surah/${lastRead.surahId}?ayah=${lastRead.ayah}`}
    className="mb-5 flex items-center justify-between rounded-xl border border-gold-500 bg-brand-800 p-4 text-white shadow-md transition hover:bg-brand-700 dark:bg-brand-900"
  >
    
    <div>
        
      <p className="text-xs text-white/70">كمّل القراءة</p>
      <p className="mt-1 font-quran text-xl text-gold-400">
        {lastRead.surahName}
      </p>
      <p className="mt-1 text-sm text-white/80">الآية {lastRead.ayah}</p>
    </div>
    <span className="text-2xl text-gold-400">←</span>
  </Link>
)}
        {loading && <p className="p-8 text-center">جاري التحميل...</p>}
        {error && <p className="p-8 text-center text-red-600">حصل خطأ: {error}</p>}

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {surahs.map((s) => (
            <li key={s.id}>
              <Link
  to={`/surah/${s.id}`}
  className="flex items-center gap-5 rounded-xl border border-gold-500/30 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-md dark:bg-brand-900/60 dark:hover:border-gold-400"
>
  <span className="mx-1 flex h-11 w-11 shrink-0 rotate-45 items-center justify-center rounded-md border border-gold-500 bg-brand-50 dark:bg-brand-800">
    <span className="-rotate-45 font-semibold text-brand-800 dark:text-gold-400">
      {s.id}
    </span>
  </span>

  <div className="flex-1">
    <p className="font-quran text-xl leading-tight text-brand-800 dark:text-gold-400">
      {s.name_ar}
    </p>
    <p className="mt-2 flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
      <span>{s.revelation_type === 'Meccan' ? 'مكية' : 'مدنية'}</span>
      <span className="text-gold-500">•</span>
      <span>{s.ayahs_count} آية</span>
    </p>
  </div>
</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}