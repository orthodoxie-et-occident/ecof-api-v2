import {
  getSynaxarByIndex,
  getTemporalReadings,
  getSanctoralReadings,
  getTemporalEvents,
} from "./liturgical-calendar.repository"
import { getTemporalIndex, getSanctoralIndex } from "./liturgical-calendar.utils"

export async function getCalendarData(date: string) {
  const [, month, day] = date.split("-").map(Number) as [number, number, number]
  const temporalIndex = getTemporalIndex(date)
  const sanctoralIndex = getSanctoralIndex(month, day)
  const synaxarOfDay = await getSynaxarByIndex(sanctoralIndex)
  const temporalReadings = await getTemporalReadings(temporalIndex)
  const sanctoralReadings = await getSanctoralReadings(sanctoralIndex)
  const temporalEvents = await getTemporalEvents(temporalIndex)
  return {
    synaxar: synaxarOfDay,
    sanctoralReadings: sanctoralReadings,
    temporalReadings: temporalReadings,
    temporalEvents: temporalEvents,
  }
}
