import { Hono } from "hono"
import { getCalendarData } from "./liturgical-calendar.service"

export const calendarRoutes = new Hono()
  // GET /calendar/:date
  .get("/:date", async (c) => {
    const date = c.req.param("date")
    const calendarData = await getCalendarData(date)
    return c.json(calendarData)
  })
