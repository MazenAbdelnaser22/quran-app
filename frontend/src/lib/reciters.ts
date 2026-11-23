export interface Reciter {
  id: string
  name: string
  bitrate: number
}

// لو قارئ ما اشتغلش، جرّب تغيّر الـ bitrate بتاعه (64 أو 128 أو 192)
export const RECITERS: Reciter[] = [
  { id: 'ar.alafasy', name: 'مشاري العفاسي', bitrate: 128 },
  { id: 'ar.husary', name: 'محمود خليل الحصري', bitrate: 128 },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي', bitrate: 128 },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط (مرتّل)', bitrate: 64 },
  { id: 'ar.abdurrahmaansudais', name: 'عبد الرحمن السديس', bitrate: 192 },
  { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي', bitrate: 128 },
]

const CDN = 'https://cdn.islamic.network/quran/audio'
const KEY = 'reciter'

export function ayahAudioUrl(ayahNumber: number, reciterId: string): string {
  const r = RECITERS.find((x) => x.id === reciterId) ?? RECITERS[0]
  return `${CDN}/${r.bitrate}/${r.id}/${ayahNumber}.mp3`
}

export function getSavedReciter(): string {
  try {
    const saved = localStorage.getItem(KEY)
    return RECITERS.some((r) => r.id === saved) ? (saved as string) : RECITERS[0].id
  } catch {
    return RECITERS[0].id
  }
}

export function saveReciter(id: string) {
  try {
    localStorage.setItem(KEY, id)
  } catch {
    /* تجاهل */
  }
}