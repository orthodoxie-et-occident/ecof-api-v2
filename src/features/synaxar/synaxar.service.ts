import { getVita as getVitaFromDb } from "./synaxar.repository"
import { mdToHtml } from "../../shared/utils/markdown"
import { applyFrenchTypography } from "../../shared/utils/typography"

export async function getVita(id: string) {
  const vita = await getVitaFromDb(id)
  const row = vita?.[0]
  if (!row) return null
  return {
    ...row,
    v_short: applyFrenchTypography(row.v_short),
    v_long: mdToHtml(applyFrenchTypography(row.v_long)),
    v_liturgy: mdToHtml(applyFrenchTypography(row.v_liturgy)),
  }
}
