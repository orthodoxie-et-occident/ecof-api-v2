import { getVita as getVitaFromDb } from "./synaxar.repository"
import { mdToHtml } from "../../shared/utils/markdown"
import { applyFrenchTypography } from "../../shared/utils/typography"

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
    v_short: applyFrenchTypography(row.v_short ?? ""),
    v_long: mdToHtml(applyFrenchTypography(row.v_long ?? "")),
    v_liturgy: mdToHtml(applyFrenchTypography(row.v_liturgy ?? "")),
    img: has_img ? buildImageUrl(id) : null,
  }
}
