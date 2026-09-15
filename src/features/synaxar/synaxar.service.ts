import {
  getVita as getVitaFromDb,
  getSaintsByDate as getSaintsByDateFromDb,
} from "./synaxar.repository"
import { mdToHtml } from "../../shared/utils/markdown"

const R2_PUBLIC_BASE = process.env.R2_PUBLIC_URL

function buildImageUrl(id: string) {
  return `${R2_PUBLIC_BASE}/${id}.webp`
}

export async function getVita(id: string) {
  const vita = await getVitaFromDb(id)
  const row = vita?.[0]
  if (!row) return null
  const { has_img, ...rest } = row
  return {
    ...rest,
    v_short: mdToHtml(row.v_short ?? ""),
    v_long: mdToHtml(row.v_long ?? ""),
    v_liturgy: mdToHtml(row.v_liturgy ?? ""),
    img: has_img ? buildImageUrl(id) : null,
  }
}

export async function getSaintsByDate(date: string) {
  const [, month, day] = date.split("-").map(Number) as [number, number, number]
  const sanctoralIndex = 10000 + month * 100 + day
  const saints = await getSaintsByDateFromDb(sanctoralIndex)
  return saints
}
