import { db } from "../../shared/db/client"

export async function getSanctoral(sanctoralIndex: number) {
  const rows = await db`
        SELECT principal, prefixe, saint, vies_id
        FROM sanctoral
        WHERE index = ${sanctoralIndex}
        ORDER BY id ASC
    `
  return rows || null
}

export async function getTemporal(index: number) {
  const rows = await db`
      SELECT title, subtitle, content
      FROM temporal
      WHERE day_index = ${index}
    `
  return rows || []
}

export async function getReadings(temporalIndex: number, sanctoralIndex: number) {
  const rows = await db`
      SELECT readings.id, readings.book_txt, blocks.block_id, blocks.block_title
      FROM readings 
      JOIN blocks ON readings.block = blocks.block_id
      WHERE day_index IN (${temporalIndex}, ${sanctoralIndex})
      ORDER BY readings.id ASC
    `
  return rows || null
}
