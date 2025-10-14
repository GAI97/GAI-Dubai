export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const baseUrl = process.env.WP_HEADER_TOP_BAR_URL || "http://gai.local/wp-json/wp/v2/top-bar-header"
    const url = `${baseUrl}?per_page=1&orderby=modified&order=desc`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return new Response(null, { status: 204 })

    const arr = (await res.json()) as any[]
    const item = Array.isArray(arr) ? arr[0] : null
    const acf = item?.acf || {}

    // Prefer 250x250 medium (square) for favicon, fall back to original
    const rawUrl: string | undefined = acf?.favicon?.sizes?.medium || acf?.favicon?.url || acf?.favicon?.sizes?.thumbnail
    if (!rawUrl) return new Response(null, { status: 204 })

    const modified: string | undefined = item?.modified || item?.date || undefined
    const src = `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}v=${encodeURIComponent(modified || "1")}`

    const imgRes = await fetch(src, { cache: "no-store" })
    if (!imgRes.ok) return new Response(null, { status: 204 })

    const contentType = imgRes.headers.get("content-type") || "image/png"
    const buf = await imgRes.arrayBuffer()

    return new Response(buf, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=0, must-revalidate",
      },
    })
  } catch (e) {
    return new Response(null, { status: 204 })
  }
}


