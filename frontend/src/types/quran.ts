export interface Surah {
  id: number
  name_ar: string
  name_en: string
  name_translation: string | null
  revelation_type: string
  ayahs_count: number
}

export interface Ayah {
  id: number
  surah_id: number
  number_in_surah: number
  number: number
  juz: number
  page: number
  text: string
  text_clean: string | null
}

export interface SurahWithAyahs extends Surah {
  ayahs: Ayah[]
}
export interface SearchResult {
  id: number
  surah_id: number
  surah_name: string
  number_in_surah: number
  text: string
}

export interface SearchResponse {
  total: number
  results: SearchResult[]
}