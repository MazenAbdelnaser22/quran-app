
import type { Surah, SurahWithAyahs, SearchResponse } from '../types/quran'

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export const getSurahs = () => get<Surah[]>('/api/surahs')
export const getSurah = (id: number) => get<SurahWithAyahs>(`/api/surahs/${id}`)


export const searchAyahs = (q: string) =>
  get<SearchResponse>(`/api/search?q=${encodeURIComponent(q)}`)