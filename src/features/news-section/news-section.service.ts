import { getNewsById as getNewsByIdFromDb } from "./news-section.repository"
import { mdToHtml } from "../../shared/utils/markdown"
import { applyFrenchTypography } from "../../shared/utils/typography"

export async function getNewsById(id: string) {
  const news = await getNewsByIdFromDb(id)
  if (!news) return null
  const { content, ...rest } = news
  return {
    ...rest,
    text: mdToHtml(applyFrenchTypography(content)),
  }
}
