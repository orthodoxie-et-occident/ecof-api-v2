import {
  getSynaxarByDate,
  getTemporalReadings,
  getSanctoralReadings,
  getTemporalEvents,
} from "./liturgical-calendar.repository"
import { getTemporalIndex, getSanctoralIndex } from "./liturgical-calendar.utils"

export async function getCalendarData(date: string) {
  const [, month, day] = date.split("-").map(Number) as [number, number, number]
  const synaxarOfDay = await getSynaxarByDate(month, day)
  const temporalIndex = getTemporalIndex(date)
  const sanctoralIndex = getSanctoralIndex(month, day)
  const temporalReadings = await getTemporalReadings(temporalIndex)
  const sanctoralReadings = await getSanctoralReadings(sanctoralIndex)
  const temporalEvents = await getTemporalEvents(temporalIndex)

  console.log(month)
  console.log(day)
  console.log(temporalIndex)
  console.log(sanctoralIndex)

  return {
    synaxar: synaxarOfDay,
    sanctoralReadings: sanctoralReadings,
    temporalReadings: temporalReadings,
    temporalEvents: temporalEvents,
  }
}
