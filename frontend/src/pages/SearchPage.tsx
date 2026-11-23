import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchAyahs } from '../api/quran'
import Header from '../components/Header'
import type { SearchResponse } from '../types/quran'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<{ q: string; res: SearchResponse } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const q = query.trim()

  useEffect(() => {
    if (q.length < 2) return

    let cancelled = false
    // تأخير بسيط: ما نبعتش طلب مع كل حرف
    const t = setTimeout(() => {
      searchAyahs(q)
        .then((res) => {
          if (cancelled) return
          setError(null)
          setData({ q, res })
        })
        .catch((e: Error) => {
          if (!cancelled) setError(e.message)
        })
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [q])

  const shown = q.length >= 2 && data?.q === q ? data.res : null
  const searching = q.length >= 2 && !shown && !error

  return (
    <>
      <Header title="البحث" meta={['في آيات القرآن الكريم']} showBack />

      <main className="mx-auto max-w-3xl p-4">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="اكتب كلمة أو جملة... (مثال: الرحمن)"
          className="w-full rounded-xl border border-gold-500/50 bg-white px-4 py-3 text-lg shadow-sm outline-none focus:border-gold-500 dark:bg-brand-900/60"
        />

        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
          البحث بدون تشكيل، ولا يفرّق بين أ / إ / ا أو ى / ي
        </p>

        <div className="mt-5">
          {searching && <p className="p-6 text-center">جاري البحث...</p>}
          {error && <p className="p-6 text-center text-red-600">حصل خطأ: {error}</p>}

          {shown && (
            <>
              <p className="mb-3 text-sm text-stone-600 dark:text-stone-300">
                {shown.total === 0
                  ? 'لا توجد نتائج'
                  : `${shown.total} نتيجة${shown.total > shown.results.length ? ` (عرض أول ${shown.results.length})` : ''}`}
              </p>

              <ul className="space-y-3">
                {shown.results.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/surah/${r.surah_id}?ayah=${r.number_in_surah}`}
                      className="block rounded-xl border border-gold-500/30 bg-white p-4 shadow-sm transition hover:border-gold-500 dark:bg-brand-900/60"
                    >
                      <p className="font-quran text-2xl leading-[2.2]">{r.text}</p>
                      <p className="mt-2 text-sm text-brand-700 dark:text-gold-400">
                        {r.surah_name} · الآية {r.number_in_surah}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </>
  )
}