import { Hono } from "hono"
import { getSynaxar } from "./synaxar.repository"
import { getVita, getSaintsByDate } from "./synaxar.service"

export const synaxarRoutes = new Hono()
  // GET /synaxar
  .get("/", async (c) => {
    const saints = await getSynaxar()
    return c.json(saints)
  })
  // GET /synaxar/:id
  .get("/:id", async (c) => {
    const id = c.req.param("id")
    const vita = await getVita(id)
    return c.json(vita)
  })
  // GET /synaxar/date/:date
  .get("/date/:date", async (c) => {
    const date = c.req.param("date")
    const saints = await getSaintsByDate(date)
    return c.json(saints)
  })
