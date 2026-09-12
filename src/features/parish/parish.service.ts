import ical from "node-ical"
import type { CalendarComponent, ParameterValue, VEvent } from "node-ical"

const calendars: Record<string, string> = {
  angers:
    "https://calendar.google.com/calendar/ical/a0b13b9efa661c4e7043a1e1393ab17998b1c203459e612f07b454163b8c1471%40group.calendar.google.com/public/basic.ics",
  bordeaux:
    "https://calendar.google.com/calendar/ical/daba7ddef4ffb00d8fb28e21aab4cd5a63b1f895bac030fef1c375f99873dd60@group.calendar.google.com/public/basic.ics",
  amboise:
    "https://calendar.google.com/calendar/ical/02c5d4a8aa1e221ea68a73bb6c6843b6c1406b6305ffe2709342f939f8af9c3d@group.calendar.google.com/public/basic.ics",
  nantes:
    "https://calendar.google.com/calendar/ical/73bad447c0fade6c9e4fd38e50fd3d661de808ca5833249c3c4eda05fedc8550@group.calendar.google.com/public/basic.ics",
  orleans:
    "https://calendar.google.com/calendar/ical/a619baa6e99f4d08abee8429129ed7c3f508140214b7c63650a67a1e5111f503@group.calendar.google.com/public/basic.ics",
  stloup:
    "https://calendar.google.com/calendar/ical/fe0500e4cb7f078423e6384532189da56fd79192b150997a12417fa9b0aab91e@group.calendar.google.com/public/basic.ics",
  vannes:
    "https://calendar.google.com/calendar/ical/5f85b9b3b200d75b471e0cb23d2caa25acf6dba6f01af9f05f70763cb170707d@group.calendar.google.com/public/basic.ics",
  paris:
    "https://calendar.google.com/calendar/ical/7236a9f3fe473b7df99018e4a6142c51dc1fee1cbd3904aa1fc594ec61503b47@group.calendar.google.com/public/basic.ics",
  stebaume:
    "https://calendar.google.com/calendar/ical/755ebdf4c6e1600dd39b9d226557923b6d0029d2b079610a0fa77b69d2748ed7%40group.calendar.google.com/private-4e70e32b7b40b2f597ae7dc02384bef0/basic.ics",
  poitiers:
    "https://calendar.google.com/calendar/ical/38a124bdb03a1be8ceda0be59b4fb4e29cb7287e7ea22f5fe3c8a6e7b8130cd8@group.calendar.google.com/public/basic.ics",
  lyon: "https://calendar.google.com/calendar/ical/20b89722813c59cd0a2fdc2ef3a81b257f240f616fc5638330f10ed5d010f765%40group.calendar.google.com/public/basic.ics",
  grenoble:
    "https://p126-caldav.icloud.com/published/2/MTIwNjA2MTU3OTEyMDYwNslsLAbTXDEyQ3nzhZH4CU-QMn3vxNaC9YK5Y-YGcahz7E5HLEPO2r3F3gMviLU1cngfNABRAK2LEfTtWzgZ1io",
  montpellier:
    "https://calendar.google.com/calendar/ical/paroissetheophanie.ecof%40gmail.com/public/basic.ics",
  lisieux:
    "https://calendar.google.com/calendar/ical/2f99103a78d9eb2c14d2ca0bb7b9f0ca1a9381c5f2875689f08503b7c8d6af3c@group.calendar.google.com/public/basic.ics",
}

interface ParishEvent {
  title: string
  start: string
  end: string
  allDay: boolean
  description: string
  location?: string
  uid: string
}

export interface ParishInfo {
  events: ParishEvent[]
}

function toText(value: ParameterValue | undefined): string {
  if (value === undefined) return ""
  if (typeof value === "string") return value
  return value.val ?? ""
}

function cleanDescription(raw: string): string {
  if (!raw) return ""
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

function dateToString(date: Date, isFullDay: boolean): string {
  if (isFullDay) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T00:00:00`
  }

  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "00"
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

interface BuildEventInput {
  summary: ParameterValue | undefined
  description: ParameterValue | undefined
  location: ParameterValue | undefined
  uid: string
  start: Date
  end: Date
  isFullDay: boolean
}

function buildEvent({
  summary,
  description,
  location,
  uid,
  start,
  end,
  isFullDay,
}: BuildEventInput): ParishEvent {
  const displayEnd = isFullDay ? addDays(end, -1) : end

  return {
    title: toText(summary),
    start: dateToString(start, isFullDay),
    end: dateToString(displayEnd, isFullDay),
    allDay: isFullDay,
    description: cleanDescription(toText(description)),
    location: toText(location) || undefined,
    uid,
  }
}

function isVEvent(component: CalendarComponent): component is VEvent {
  return component.type === "VEVENT"
}

export async function getParishInfo(city: string): Promise<ParishInfo> {
  const url = calendars[city]

  if (!url) {
    throw new Error(`City not found: ${city}`)
  }

  const response = await fetch(url)
  const icsText = await response.text()
  const data = ical.sync.parseICS(icsText)

  const now = new Date()
  const maxDate = new Date(now)
  maxDate.setFullYear(maxDate.getFullYear() + 1)

  const nowString = dateToString(now, false)

  const allEvents: ParishEvent[] = []

  for (const component of Object.values(data)) {
    if (!component || !isVEvent(component)) continue

    if (component.rrule) {
      // expandRecurringEvent gère nativement les EXDATE et les
      // instances modifiées (RECURRENCE-ID / component.recurrences).
      const instances = ical.expandRecurringEvent(component, {
        from: now,
        to: maxDate,
        expandOngoing: true, // inclut une occurrence commencée avant "now" mais toujours en cours
      })

      for (const instance of instances) {
        allEvents.push(
          buildEvent({
            summary: instance.summary,
            description: instance.event.description,
            location: instance.event.location,
            uid: component.uid,
            start: instance.start,
            end: instance.end,
            isFullDay: instance.isFullDay,
          }),
        )
      }
    } else {
      const isFullDay = Boolean((component.start as { dateOnly?: true } | undefined)?.dateOnly)
      allEvents.push(
        buildEvent({
          summary: component.summary,
          description: component.description,
          location: component.location,
          uid: component.uid,
          start: component.start,
          end: component.end ?? component.start,
          isFullDay,
        }),
      )
    }
  }

  const upcomingEvents = allEvents.filter((event) => event.end >= nowString)
  upcomingEvents.sort((a, b) => a.start.localeCompare(b.start))

  return { events: upcomingEvents }
}
