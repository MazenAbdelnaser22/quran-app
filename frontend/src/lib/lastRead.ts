export interface LastRead {
  surahId: number
  surahName: string
  ayah: number
}

const KEY = 'lastRead'

export function getLastRead(): LastRead | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LastRead) : null
  } catch {
    return null
  }
}

export function saveLastRead(value: LastRead) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    /* تجاهل لو التخزين ممتلئ أو ممنوع */
  }
}