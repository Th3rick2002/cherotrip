/** URL canónica del sitio (definir NEXT_PUBLIC_SITE_URL en Vercel). */
export function getSiteUrl(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  if (site) return site
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

export const SITE_NAME = "Cherotrip"
export const SITE_DESCRIPTION =
  "Eventos y lugares del oriente de El Salvador con información verificada. Fecha, transporte, precio y canales oficiales de cada negocio."
export const SITE_THEME_COLOR = "#023E8A"
export const SITE_BACKGROUND_COLOR = "#F8F9FA"
