import { db } from "../../shared/db/client"

type SynaxarRow = {
  v_short: string | null
  v_long: string | null
  v_liturgy: string | null
  has_img: boolean | null
  mois: number
  jour: number
  prefixe: string
  saint: string
}

export async function getSynaxar() {
  const rows = await db`
        SELECT saint, vies_id
        FROM synaxar
        WHERE calendrier != 2
        ORDER BY saint ASC
    `
  return rows || null
}

export async function getVita(id: string) {
  const rows = await db<SynaxarRow[]>`
        SELECT 
            v.v_short, 
            v.v_long, 
            v.v_liturgy, 
            v.has_img, 
            s.mois, 
            s.jour, 
            s.prefixe, 
            s.saint
        FROM synaxar s
        LEFT JOIN vita v ON v.vies_id = s.vies_id
        WHERE s.vies_id = ${id}
        LIMIT 1
    `
  return rows || null
}
