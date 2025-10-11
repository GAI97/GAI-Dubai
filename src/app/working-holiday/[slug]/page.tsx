import { fetchWorkingHolidayVisaBySlug, fetchWorkingHolidayVisas, normalizeWpMediaUrl } from "@/lib/wp-rest"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return []
}

function getArray(acf: Record<string, any>, key: string): any[] {
  const v = acf?.[key]
  return Array.isArray(v) ? v : []
}

export default async function WorkingHolidayDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const [item, all] = await Promise.all([
    fetchWorkingHolidayVisaBySlug(slug),
    fetchWorkingHolidayVisas(),
  ])
  if (!item) return notFound()
  const acf: any = (item as any)?.acf || {}

  const title = (acf?.service_name as string) || item.title?.rendered || "Working Holiday"
  const subheading = (acf?.service_subheading as string) || ""
  const description = (acf?.service_description as string) || ""
  const heroImg = normalizeWpMediaUrl((acf?.banner_image?.url as string) || undefined)
  const sectionPoints = getArray(acf, "section_points")

  const finalHeading = (acf?.["final_section_heading"] as string) || ""
  const finalDescription = (acf?.["final_section_description"] as string) || ""
  const btn1Text = (acf?.["button_1_text"] as string) || ""
  const btn1Link = (acf?.["button_1_link"]?.url as string) || "#"
  const btn2Text = (acf?.["button_2_text"] as string) || ""
  const btn2Link = (acf?.["button_2_link"]?.url as string) || "#"

  const leftSidebarImage = normalizeWpMediaUrl((acf?.["left_side_bar_image"]?.url as string) || undefined)

  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-auto">
        <div className="relative w-full h-[220px] sm:h-[280px] md:h-[340px]">
          {heroImg ? (
            <Image src={heroImg} alt={title} fill priority className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#273378] to-[#1f295f]" />
          )}
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative h-full flex items-center">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
              <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-semibold">{title}</h1>
              {subheading ? (
                <p className="mt-2 text-white/90 text-sm sm:text-base max-w-3xl">{subheading}</p>
              ) : null}
              {description ? (
                <p className="mt-4 text-white/90 text-sm sm:text-base max-w-4xl whitespace-pre-line">{description}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left nav */}
          <aside className="md:col-span-4">
            <nav className="rounded-xl bg-white ring-1 ring-black/5 overflow-hidden">
              <ul className="divide-y divide-black/5">
                {all.map((it) => {
                  const isActive = it.slug === slug
                  const iacf: any = (it as any)?.acf || {}
                  const label = (iacf?.service_name as string) || it.title?.rendered || "Working Holiday"
                  return (
                    <li key={it.id}>
                      <Link href={`/working-holiday/${it.slug}`} className={`flex items-center justify-between gap-3 px-4 py-4 text-[15px] transition ${isActive ? "bg-[#e94a4a] text-white" : "bg-white hover:bg-neutral-50 text-neutral-800"}`}>
                        <span className="truncate">{label}</span>
                        <span className={`shrink-0 ${isActive ? "text-white" : "text-neutral-400"}`}>›</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            {leftSidebarImage ? (
              <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-black/5">
                <Image src={leftSidebarImage} alt="Sidebar" width={800} height={1000} className="w-full h-auto object-cover" />
              </div>
            ) : null}
          </aside>

          {/* Right content */}
          <article className="md:col-span-8">
            {sectionPoints.map((section: any, index: number) => {
              const heading = section?.section_heading || ""
              const content = section?.contents || ""
              const imageUrl = section?.image ? normalizeWpMediaUrl(section.image.url) : undefined

              return (
                <section key={index} className={`${index === 0 ? "mt-2" : "mt-8"}`}>
                  {heading && (
                    <h2 className="text-3xl sm:text-4xl font-semibold text-[#283277] mb-4">{heading}</h2>
                  )}
                  <div className="rounded-lg bg-[#f6fbff] p-6 ring-1 ring-[#2dc0d9]/20">
                    {imageUrl && (
                      <div className="mb-6 overflow-hidden rounded-lg ring-1 ring-black/5 w-full">
                        <Image src={imageUrl} alt={heading || title} width={1200} height={600} className="w-full h-auto object-cover" />
                      </div>
                    )}
                    {content && (
                      <div
                        className="text-[15px] leading-7 text-neutral-700 prose prose-sm max-w-none prose-strong:text-[#283277] prose-strong:font-semibold prose-p:mb-4 prose-ol:list-decimal prose-ol:pl-6 prose-ul:list-disc prose-ul:pl-6"
                        dangerouslySetInnerHTML={{
                          __html: content
                            // Convert ul to ol for Application Process sections
                            .replace(/<ul[^>]*>/g, (match) => {
                              // Check if this is in an Application Process section
                              const isApplicationProcess = heading && (
                                heading.toLowerCase().includes('application process') ||
                                heading.toLowerCase().includes('process') ||
                                heading.toLowerCase().includes('steps') ||
                                heading.toLowerCase().includes('procedure')
                              )
                              if (isApplicationProcess) {
                                return '<ol class="space-y-3 list-decimal pl-6" style="list-style-type: decimal; padding-left: 1.5rem;">'
                              }
                              return '<ul class="space-y-3">'
                            })
                            // Also handle existing ol tags in Application Process sections
                            .replace(/<ol[^>]*>/g, (match) => {
                              // Check if this is in an Application Process section
                              const isApplicationProcess = heading && (
                                heading.toLowerCase().includes('application process') ||
                                heading.toLowerCase().includes('process') ||
                                heading.toLowerCase().includes('steps') ||
                                heading.toLowerCase().includes('procedure')
                              )
                              if (isApplicationProcess) {
                                return '<ol class="space-y-3 list-decimal pl-6" style="list-style-type: decimal; padding-left: 1.5rem;">'
                              }
                              return match
                            })
                            .replace(/<li[^>]*>/g, (liMatch) => {
                              // Check if this is in an Application Process section
                              const isApplicationProcess = heading && (
                                heading.toLowerCase().includes('application process') ||
                                heading.toLowerCase().includes('process') ||
                                heading.toLowerCase().includes('steps') ||
                                heading.toLowerCase().includes('procedure')
                              )
                              if (isApplicationProcess) {
                                return '<li class="text-[15px] text-neutral-800 leading-7">'
                              }
                              return '<li class="flex items-start gap-2"><svg class="h-4 w-4 mt-[2px] text-[#2dc0d9] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="text-[15px] text-neutral-800 leading-7">'
                            })
                            .replace(/<\/li>/g, (liCloseMatch) => {
                              // Check if this is in an Application Process section
                              const isApplicationProcess = heading && (
                                heading.toLowerCase().includes('application process') ||
                                heading.toLowerCase().includes('process') ||
                                heading.toLowerCase().includes('steps') ||
                                heading.toLowerCase().includes('procedure')
                              )
                              if (isApplicationProcess) {
                                return '</li>'
                              }
                              return '</span></li>'
                            })
                        }}
                      />
                    )}
                  </div>
                </section>
              )
            })}

            {(finalHeading || finalDescription || btn1Text || btn2Text) ? (
              <section className="mt-12 rounded-lg bg-[#f6fbff] p-6 ring-1 ring-[#2dc0d9]/20">
                {finalHeading ? <h2 className="text-3xl sm:text-4xl font-semibold text-[#283277]">{finalHeading}</h2> : null}
                {finalDescription ? (
                  <p className="mt-3 text-[15px] leading-7 text-neutral-700 whitespace-pre-line">{finalDescription}</p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-3">
                  {btn1Text ? (
                    <Link href={btn1Link || "#"} className="inline-flex items-center justify-center rounded-md bg-[#283277] px-5 py-2 text-white text-sm font-medium">
                      {btn1Text}
                    </Link>
                  ) : null}
                  {btn2Text ? (
                    <Link href={btn2Link || "#"} className="inline-flex items-center justify-center rounded-md border border-[#283277] px-5 py-2 text-[#283277] text-sm font-medium">
                      {btn2Text}
                    </Link>
                  ) : null}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </section>
    </>
  )
}