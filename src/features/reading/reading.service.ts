import { getScriptureReading as getScriptureReadingFromDb } from "./reading.repository"
import { mdToHtml } from "../../shared/utils/markdown"

export async function getScriptureReading(id: string) {
  const reading = await getScriptureReadingFromDb(id)
  if (!reading) return null
  return {
    ...reading,
    reading: mdToHtml(reading.reading),
  }
}
