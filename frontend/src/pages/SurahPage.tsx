import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getSurah } from '../api/quran'
import AudioPlayer from '../components/AudioPlayer'
import Header from '../components/Header'
import { useSettings } from '../context/SettingsContext'
import { getLastRead, saveLastRead } from '../lib/lastRead'
import { getSavedReciter, saveReciter } from '../lib/reciters'
import type { SurahWithAyahs } from '../types/quran'

const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'

type Result =
  | { id: number; surah: SurahWithAyahs; error: null }
  | { id: number; surah: null; error: string }

export default function SurahPage() {
  const { id } = useParams()
  const surahId = Number(id)
  const { fontSize } = useSettings()
  const [searchParams] = useSearchParams()
  const timer = useRef<number | undefined>(undefined)

  const [result, setResult] = useState<Result | null>(null)
  const [playing, setPlaying] = useState<{ surahId: number; ayah: number } | null>(null)
  const [reciterId, setReciterId] = useState(getSavedReciter)

  // النتيجة تُعتبر صالحة بس لو هي للسورة الحالية
  const current = result && result.id === surahId ? result : null
  const surah = current?.surah ?? null
  const error = current?.error ?? null
  const loading = current === null

  // الآية اللي بتتقرأ (بس لو هي في السورة الحالية)
  const currentAyah = playing && playing.surahId === surahId ? playing.ayah : null

  // 1) جلب السورة
  useEffect(() => {
    let cancelled = false

    getSurah(surahId)
      .then((data) => {
        if (cancelled) return
        setResult({ id: surahId, surah: data, error: null })
        window.scrollTo(0, 0)
      })
      .catch((e: Error) => {
        if (cancelled) return
        setResult({ id: surahId, surah: null, error: e.message })
      })

    return () => {
      cancelled = true
    }
  }, [surahId])

  // 2) النزول للآية المطلوبة (من الرابط ?ayah=5 أو من آخر موضع محفوظ)
  useEffect(() => {
    if (!surah) return

    const fromUrl = Number(searchParams.get('ayah'))
    const saved = getLastRead()
    const target =
      fromUrl > 0 ? fromUrl : saved && saved.surahId === surah.id ? saved.ayah : 0

    if (target > 1) {
      requestAnimationFrame(() => {
        document
          .getElementById(`ayah-${target}`)
          ?.scrollIntoView({ block: 'start' })
      })
    }
  }, [surah, searchParams])

  // 3) حفظ الآية الظاهرة أثناء التمرير
  useEffect(() => {
    if (!surah) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]

        if (!visible) return
        const ayah = Number(visible.target.getAttribute('data-ayah'))

        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => {
          saveLastRead({ surahId: surah.id, surahName: surah.name_ar, ayah })
        }, 600)
      },
      { rootMargin: '-80px 0px -70% 0px' },
    )

    document.querySelectorAll('[data-ayah]').forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      window.clearTimeout(timer.current)
    }
  }, [surah, fontSize])

  // 4) النزول للآية اللي بتتقرأ
  useEffect(() => {
    if (currentAyah === null) return
    document
      .getElementById(`ayah-${currentAyah}`)
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [currentAyah])

  function changeReciter(rid: string) {
    setReciterId(rid)
    saveReciter(rid)
  }

  // الفاتحة: البسملة آية فعلية. التوبة: مفيش بسملة.
  const showBasmala = surah ? surah.id !== 1 && surah.id !== 9 : false

  return (
    <>
      <Header
        title={surah?.name_ar ?? '...'}
        meta={
          surah
            ? [
                `سورة رقم ${surah.id}`,
                surah.revelation_type === 'Meccan' ? 'مكية' : 'مدنية',
                `${surah.ayahs_count} آية`,
              ]
            : undefined
        }
        prevId={surahId > 1 ? surahId - 1 : null}
        nextId={surahId < 114 ? surahId + 1 : null}
        showBack
      />

      <main className="mx-auto max-w-3xl px-5 pt-8 pb-32">
        {loading && <p className="p-8 text-center">جاري التحميل...</p>}
        {error && <p className="p-8 text-center text-red-600">حصل خطأ: {error}</p>}

        {surah && (
          <>
            {showBasmala && (
              <p
                className="mb-8 border-y border-gold-500/40 py-4 text-center font-quran text-brand-800 dark:text-gold-400"
                style={{ fontSize: fontSize + 4 }}
              >
                {BASMALA}
              </p>
            )}

            <div
              className="text-justify font-quran"
              style={{ fontSize, lineHeight: 2.4 }}
            >
              {surah.ayahs.map((a) => (
                <span
                  key={a.id}
                  id={`ayah-${a.number_in_surah}`}
                  data-ayah={a.number_in_surah}
                  onClick={() => setPlaying({ surahId: surah.id, ayah: a.number_in_surah })}
                  className={
                    'scroll-mt-28 cursor-pointer rounded-lg box-decoration-clone transition-colors ' +
                    (currentAyah === a.number_in_surah ? 'bg-gold-500/20' : '')
                  }
                >
                  {a.text}{' '}
                  <span
                    className="mx-1 inline-flex items-center justify-center rounded-full border border-gold-500 align-middle font-ui text-gold-600 dark:text-gold-400"
                    style={{
                      width: fontSize * 0.95,
                      height: fontSize * 0.95,
                      fontSize: fontSize * 0.42,
                    }}
                  >
                    {a.number_in_surah}
                  </span>{' '}
                </span>
              ))}
            </div>

            <nav className="mt-12 flex items-center justify-between gap-3 border-t border-gold-500/40 pt-6">
              {surahId > 1 ? (
                <Link
                  to={`/surah/${surahId - 1}`}
                  className="rounded-lg bg-brand-800 px-4 py-2 text-white transition hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600"
                >
                  → السورة السابقة
                </Link>
              ) : (
                <span />
              )}

              <Link
                to="/"
                className="rounded-lg border border-gold-500 px-3 py-2 text-brand-800 transition hover:bg-gold-500/10 dark:text-gold-400"
              >
                ☰ السور
              </Link>

              {surahId < 114 ? (
                <Link
                  to={`/surah/${surahId + 1}`}
                  className="rounded-lg bg-brand-800 px-4 py-2 text-white transition hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600"
                >
                  السورة التالية ←
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </>
        )}
      </main>

      {surah && (
        <AudioPlayer
          ayahs={surah.ayahs}
          current={currentAyah}
          onSelect={(ayah) =>
            setPlaying(ayah === null ? null : { surahId: surah.id, ayah })
          }
          reciterId={reciterId}
          onReciterChange={changeReciter}
        />
      )}
    </>
  )
}