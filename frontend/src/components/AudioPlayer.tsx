import { useRef, useState } from 'react'
import { RECITERS, ayahAudioUrl } from '../lib/reciters'
import type { Ayah } from '../types/quran'

interface Props {
  ayahs: Ayah[]
  current: number | null // رقم الآية داخل السورة
  onSelect: (ayah: number | null) => void
  reciterId: string
  onReciterChange: (id: string) => void
}

const btn =
  'flex h-10 min-w-10 items-center justify-center rounded-lg bg-white/10 px-3 text-white transition hover:bg-white/20 disabled:opacity-30'

export default function AudioPlayer({
  ayahs,
  current,
  onSelect,
  reciterId,
  onReciterChange,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  const index = ayahs.findIndex((a) => a.number_in_surah === current)
  const ayah = index >= 0 ? ayahs[index] : null
  const url = ayah ? ayahAudioUrl(ayah.number, reciterId) : null

  function go(n: number) {
    setFailed(false)
    onSelect(n)
  }

  function prev() {
    if (index > 0) go(ayahs[index - 1].number_in_surah)
  }

  function next() {
    if (index >= 0 && index < ayahs.length - 1) {
      go(ayahs[index + 1].number_in_surah)
    } else {
      setPlaying(false)
      onSelect(null) // خلصت السورة
    }
  }

  function toggle() {
    if (!ayah) {
      go(ayahs[0].number_in_surah)
      return
    }
    const el = audioRef.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
  }

  function changeReciter(id: string) {
    setFailed(false)
    onReciterChange(id)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t-2 border-gold-500 bg-brand-800 text-white shadow-[0_-4px_12px_rgba(0,0,0,0.2)] dark:bg-brand-900">
      {url && (
        <audio
          ref={audioRef}
          src={url}
          autoPlay
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={next}
          onError={() => {
            setPlaying(false)
            setFailed(true)
          }}
        />
      )}

      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-3 py-2">
        <div className="flex items-center gap-1">
          <button onClick={prev} disabled={index <= 0} className={btn} title="الآية السابقة">
            →
          </button>
          <button onClick={toggle} className={btn + ' w-12 text-lg'} title="تشغيل / إيقاف">
            {playing ? '⏸' : '▶'}
          </button>
          <button onClick={next} disabled={index < 0} className={btn} title="الآية التالية">
            ←
          </button>
        </div>

        <div className="min-w-0 flex-1 text-center text-sm">
          {failed ? (
            <span className="text-red-300">تعذّر تحميل الصوت، جرّب قارئ آخر</span>
          ) : ayah ? (
            <span className="text-gold-400">
              الآية {ayah.number_in_surah} من {ayahs.length}
            </span>
          ) : (
            <span className="text-white/70">اضغط تشغيل أو اختر آية</span>
          )}
        </div>

        <select
          value={reciterId}
          onChange={(e) => changeReciter(e.target.value)}
          className="max-w-36 rounded-lg border border-white/20 bg-brand-900 px-2 py-2 text-sm text-white"
          title="القارئ"
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}