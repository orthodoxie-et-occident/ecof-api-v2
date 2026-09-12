import { applyFrenchTypography } from "./typography"

export function mdToHtml(text: string | null | undefined): string | null {
  if (!text) return null

  const html = Bun.markdown.html(text)
  const withCaptions = addFigcaptions(html)
  return applyTypographyOutsideTags(withCaptions)
}

function addFigcaptions(html: string): string {
  return html.replace(
    /<img([^>]*?)\stitle="([^"]*)"([^>]*)>/g,
    (_match, before, title, after) =>
      `<figure><img${before}${after}><figcaption>${title}</figcaption></figure>`,
  )
}

function applyTypographyOutsideTags(html: string): string {
  return html
    .split(/(<[^>]+>)/g)
    .map((segment) =>
      segment.startsWith("<") ? segment : (applyFrenchTypography(segment) ?? segment),
    )
    .join("")
}
