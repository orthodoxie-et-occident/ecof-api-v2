import { db } from "../../shared/db/client"

export async function getSynaxarByIndex(sanctoralIndex: number) {
  const rows = await db`
        SELECT id, prefixe, saint, vies_id
        FROM synaxar
        WHERE index = ${sanctoralIndex}
        ORDER BY id ASC
    `
  return rows || null
}

export async function getTemporalReadings(index: number) {
  const rows = await db`
      SELECT readings.id, readings.block, readings.book_txt, blocks.block_title
      FROM readings 
      JOIN blocks ON readings.block = blocks.block_id
      WHERE day_index = ${index}
      ORDER BY readings.id ASC
    `
  return rows || null
}

export async function getSanctoralReadings(index: number) {
  const rows = await db`
      SELECT readings.id, readings.block, readings.book_txt, blocks.block_title
      FROM readings 
      JOIN blocks ON readings.block = block_id
      WHERE day_index = ${index}
      ORDER BY readings.id ASC
    `
  return rows || null
}

export async function getTemporalEvents(index: number) {
  const rows = await db`
      SELECT id, content
      FROM temporal
      WHERE day_index = ${index}
      ORDER BY id ASC
    `
  return rows || []
}
