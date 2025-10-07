/*
  About Us page
  - Fetches WP page data from REST (expects ACF fields shown in the prompt)
  - Renders banner, about sections, reasons, and work process
  - Uses basic <img> to avoid remote image domain config requirements
*/

import { BadgeCheck, ClipboardCheck, Zap, GraduationCap, Globe } from "lucide-react"

type WPMedia = {
  url?: string
  sizes?: Record<string, string>
  width?: number
  height?: number
  alt?: string
}

type WPItem = {
  acf?: any
  title?: { rendered?: string }
}

async function fetchAboutData(): Promise<WPItem | null> {
  const endpoint =
    process.env.WP_ABOUT_PAGE_ENDPOINT ||
    'https://temp.globalallianceimmigration.com/wp-json/wp/v2/pages/542'
  try {
    const res = await fetch(endpoint, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    // Endpoint may return an array or an object depending on query; normalize
    return Array.isArray(data) ? data[0] : data
  } catch {
    return null
  }
}

function imgUrl(media?: WPMedia): string | undefined {
  if (!media) return undefined
  return media.url || media.sizes?.medium_large || media.sizes?.large
}

export default async function AboutUsPage() {
  const item = await fetchAboutData()
  const acf = item?.acf || {}

  const bannerUrl: string | undefined = imgUrl(acf.banner_image)
  const aboutHeading: string = acf.about_heading || 'About Us'
  const aboutSubheading: string = acf.about_subheading || ''

  const s2Sub: string = acf['2nd_section_sub_heading'] || ''
  const s2Head: string = acf['2nd_section_heading'] || ''
  const s2Desc: string = acf['2nd_section_description'] || ''
  const s2Img: string | undefined = imgUrl(acf['2nd_section_image'])

  const s3Sub: string = acf['3rd_section_subheading'] || ''
  const s3Head: string = acf['3rd_section_heading'] || ''
  const s3Desc: string = acf['3rd_section_description'] || ''
  const s3Points: Array<any> = Array.isArray(acf['3rd_section_points'])
    ? acf['3rd_section_points']
    : []
  const s3Img: string | undefined = imgUrl(acf['3rd_section_image'])

  const s4Sub: string = acf['4th_section_subheading'] || acf['4th_section_heading'] || ''
  const s4Head: string = acf['4th_section_heading'] || ''
  const s4Bg: string | undefined = imgUrl(acf['4th_section_background'])
  const s4Points: Array<any> = Array.isArray(acf['4th_section_points'])
    ? acf['4th_section_points']
    : []

  const s5Head: string = acf['5th_section_heading'] || ''
  const s5Desc: string = acf['5th_section_description'] || ''
  const s5Points: Array<any> = Array.isArray(acf['5th_section_points'])
    ? acf['5th_section_points']
    : []

  const pickIcon = (label: string) => {
    const t = String(label || '').toLowerCase()
    if (t.includes('eligibil')) return <BadgeCheck className="h-5 w-5 text-[#e94a4a]" />
    if (t.includes('exam')) return <ClipboardCheck className="h-5 w-5 text-[#e94a4a]" />
    if (t.includes('process') || t.includes('fastest') || t.includes('form')) return <Zap className="h-5 w-5 text-[#e94a4a]" />
    if (t.includes('education') || t.includes('universit') || t.includes('institution')) return <GraduationCap className="h-5 w-5 text-[#e94a4a]" />
    if (t.includes('world')) return <Globe className="h-5 w-5 text-[#e94a4a]" />
    return <BadgeCheck className="h-5 w-5 text-[#e94a4a]" />
  }

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <section className="w-full">
        <div
          className="relative w-full h-56 md:h-72 lg:h-[320px] bg-cover bg-center"
          style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/20" />
          <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold text-white drop-shadow">
                {aboutHeading}
              </h1>
              {aboutSubheading ? (
                <p className="text-white/90 mt-3 text-lg">{aboutSubheading}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      {(s2Head || s2Desc) && (
        <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-16">
          {/* Head + copy split */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              {s2Sub ? <p className="text-sm tracking-wide" style={{color:'#2dc0d9'}}>{s2Sub}</p> : null}
              {s2Head ? <h2 className="text-3xl md:text-5xl font-semibold mt-3 leading-tight" style={{color:'#283277'}}>{s2Head}</h2> : null}
            </div>
            <div>
              {s2Desc ? (
                <div className="space-y-4 text-neutral-700 text-[15px] leading-7">
                  {String(s2Desc).split(/\n+/).filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Large image below */}
          {s2Img ? (
            <div className="mt-10 overflow-hidden rounded-xl ring-1 ring-black/5 w-full">
              <img src={s2Img} alt="About section" className="w-full h-auto object-cover" />
            </div>
          ) : null}
        </section>
      )}

      {/* Highlights / bullets */}
      {(s3Head || s3Points.length > 0) && (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left image */}
            <div className="order-2 md:order-1">
              {s3Img ? (
                <div className="overflow-hidden rounded-2xl ring-1 ring-black/5 w-full max-w-lg md:max-w-xl">
                  <img src={s3Img} alt="About highlight" className="w-full h-auto object-cover" />
                </div>
              ) : null}
            </div>

            {/* Right copy and feature blocks */}
            <div className="order-1 md:order-2">
              {s3Sub ? <p className="text-sm tracking-wide" style={{color:'#2dc0d9'}}>{s3Sub}</p> : null}
              {s3Head ? <h3 className="text-3xl md:text-4xl font-semibold mt-3" style={{color:'#283277'}}>{s3Head}</h3> : null}
              {s3Desc ? <p className="mt-4 text-[15px] leading-7 text-neutral-700 whitespace-pre-line">{s3Desc}</p> : null}

              {/* Feature pills (all items) */}
              <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6">
                {s3Points.map((p, i) => {
                  const label = p?.['3rd_section_bullet_points']
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className="inline-flex h-14 w-14 aspect-square flex-none items-center justify-center rounded-full bg-[#fdeceb] ring-1 ring-[#e94a4a]/20 shadow-sm">
                        {pickIcon(label)}
                      </span>
                      <div>
                        <div className="font-semibold" style={{color:'#283277'}}>{label}</div>
                        <div className="text-sm text-neutral-600">&nbsp;</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* CTA */}
              {acf?.button_text ? (
                <div className="mt-8">
                  <a href={(acf?.button_link?.url as string) || '#'} className="inline-flex items-center rounded-full bg-[#e94a4a] px-6 py-3 text-white font-medium">
                    {acf?.button_text}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* Reasons / features with background */}
      {(s4Head || s4Points.length > 0) && (
        <section
          className="relative py-28 md:py-32"
          style={s4Bg ? { backgroundImage: `url(${s4Bg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        >
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
            {s4Sub ? <p className="text-center text-sm tracking-wide text-white/90">{s4Sub}</p> : null}
            {s4Head ? <h3 className="text-center text-3xl md:text-4xl font-semibold mt-3 text-white">{s4Head}</h3> : null}
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              {s4Points.map((p, i) => {
                const title = p?.['4th_section_bullet_heading']
                const desc = p?.['4th_section_bullet_description']
                const IconPill = pickIcon(title)
                return (
                  <div key={i} className="bg-white/95 rounded-2xl p-6 ring-1 ring-black/5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fdeceb] ring-1 ring-[#e94a4a]/20 mb-4">
                      {IconPill}
                    </span>
                    <div className="font-semibold" style={{color:'#283277'}}>{title}</div>
                    {desc ? <div className="text-sm mt-2 text-neutral-700">{desc}</div> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Work process */}
      {(s5Head || s5Points.length > 0) && (
        <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-20">
          {s5Head ? <h3 className="text-center text-3xl md:text-4xl font-semibold" style={{color:'#283277'}}>{s5Head}</h3> : null}
          {s5Desc ? <p className="text-center mt-4 text-neutral-700">{s5Desc}</p> : null}
          <div className="grid md:grid-cols-3 gap-12 mt-12">
            {s5Points.map((p, i) => (
              <div key={i} className="text-center">
                {imgUrl(p?.['5th_section_bullets_image']) ? (
                  <img
                    src={imgUrl(p?.['5th_section_bullets_image'])}
                    alt={p?.['5th_section_bullet_heading'] || 'process'}
                    className="mx-auto rounded-full w-64 h-64 object-cover"
                  />
                ) : null}
                <div className="mt-4 font-semibold">{p?.['5th_section_bullet_heading']}</div>
                <div className="text-sm mt-2 text-neutral-700">{p?.['5th_section_bullet_description']}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}


