import { Hono } from "hono"
import { cors } from "hono/cors"
import { synaxarRoutes } from "./features/synaxar/synaxar.routes"
import { mapRoutes } from "./features/map/map.routes"
import { readingRoutes } from "./features/reading/reading.routes"
import { newsRoutes } from "./features/news-section/news-section.routes"
import { parishRoutes } from "./features/parish/parish.routes"
import { calendarRoutes } from "./features/liturgical-calendar/liturgical-calendar.route"

const app = new Hono()

app.use("*", cors())

app.route("/synaxar", synaxarRoutes)
app.route("/map", mapRoutes)
app.route("/reading", readingRoutes)
app.route("/news", newsRoutes)
app.route("/parish", parishRoutes)
app.route("/calendar", calendarRoutes)

export default app
