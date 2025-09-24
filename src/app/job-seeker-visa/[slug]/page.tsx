import { fetchJobSeekerVisaBySlug, fetchJobSeekerVisas } from "@/lib/wp-rest"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
	return []
}

function getArray(acf: Record<string, any>, key: string): any[] {
	const v = acf?.[key]
	return Array.isArray(v) ? v : []
}

export default async function JobSeekerVisaDetail(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params
    const [item, all] = await Promise.all([
        fetchJobSeekerVisaBySlug(slug),
        fetchJobSeekerVisas(),
    ])
	if (!item) return notFound()
	const acf: any = (item as any)?.acf || {}

	const title = (acf?.service_name as string) || item.title?.rendered || "Job Seeker Visa"
	const subheading = (acf?.service_subheading as string) || ""
	const description = (acf?.service_description as string) || ""
	const heroImg = acf?.service_image?.url as string | undefined

	const sec2Heading = (acf?.["2nd_section_heading"] as string) || ""
	const sec2Points = getArray(acf, "2nd_section_points").map((p) => String(p?.["2nd_section_bullet_points"] || "")).filter(Boolean)

	const sec3Heading = (acf?.["3rd_section_heading"] as string) || ""
	const sec3Points = getArray(acf, "3rd_section_points").map((p) => String(p?.["3rd_section_bullet_points"] || "")).filter(Boolean)
	const sec3Image = (acf?.["3rd_section_images"]?.url as string) || undefined

	const sec4Heading = (acf?.["4th_section_heading"] as string) || ""
	const sec4Points = getArray(acf, "4th_section_points").map((p) => String(p?.["4th_section_bullet_points"] || "")).filter(Boolean)

	const sec5Heading = (acf?.["5th_section_heading"] as string) || ""
	const sec5Points = getArray(acf, "5th_section_points").map((p) => String(p?.["5th_section_bullet_points"] || "")).filter(Boolean)

	const sec6Heading = (acf?.["6th_section_heading"] as string) || ""
	const sec6Points = getArray(acf, "6th_section_points").map((p) => String(p?.["6th_section_bullet_points"] || "")).filter(Boolean)

	const sec7Heading = (acf?.["7th_section_heading"] as string) || ""
	const sec7Points = getArray(acf, "7th_section_points").map((p) => String(p?.["7th_section_bullet_points"] || "")).filter(Boolean)
	const sec7Image = (acf?.["7th_section_image"]?.url as string) || undefined

	const finalHeading = (acf?.["final_section_heading"] as string) || ""
	const finalDescription = (acf?.["final_section_description"] as string) || ""
	const btn1Text = (acf?.["button_1_text"] as string) || ""
	const btn1Link = (acf?.["button_1_link"]?.url as string) || "#"
	const btn2Text = (acf?.["button_2_text"] as string) || ""
	const btn2Link = (acf?.["button_2_link"]?.url as string) || "#"

	const leftSidebarImage = (acf?.["left_side_bar_image"]?.url as string) || undefined

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
									const label = (iacf?.service_name as string) || it.title?.rendered || "Job Seeker Visa"
									return (
										<li key={it.id}>
											<Link href={`/job-seeker-visa/${it.slug}`} className={`flex items-center justify-between gap-3 px-4 py-4 text-[15px] transition ${isActive ? "bg-[#e94a4a] text-white" : "bg-white hover:bg-neutral-50 text-neutral-800"}`}>
												<span className="truncate">{label}</span>
												<span className={`shrink-0 ${isActive ? "text-white" : "text-neutral-400"}`}>›</span>
											</Link>
										</li>
									)
								})}
							</ul>
						</nav>
						
						{leftSidebarImage && (
							<div className="mt-6">
								<Image
									src={leftSidebarImage}
									alt="Sidebar Image"
									width={300}
									height={400}
									className="w-full rounded-lg"
								/>
							</div>
						)}
					</aside>

					{/* Main content */}
					<article className="md:col-span-8">
						{/* Section 2 */}
						{sec2Heading || sec2Points.length ? (
							<section className="mt-10">
								<h2 className="text-3xl sm:text-4xl font-semibold text-[#283277]">{sec2Heading}</h2>
								{sec2Points.length ? (
									<ul className="mt-5 space-y-3 text-[15px] text-neutral-800">
										{sec2Points.map((p, i) => (
											<li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-[2px] text-[#2dc0d9]" /><span>{p}</span></li>
										))}
									</ul>
								) : null}
							</section>
						) : null}

						{/* Section 3 */}
						{sec3Heading || sec3Points.length || sec3Image ? (
							<section className="mt-10">
								<h2 className="text-3xl sm:text-4xl font-semibold text-[#283277]">{sec3Heading}</h2>
								{sec3Image ? (
									<div className="mt-5 overflow-hidden rounded-lg ring-1 ring-black/5 w-full">
										<Image src={sec3Image} alt={sec3Heading || title} width={1200} height={600} className="w-full h-auto object-cover" />
									</div>
								) : null}
								{sec3Points.length ? (
									<ul className="mt-5 space-y-3 text-[15px] text-neutral-800">
										{sec3Points.map((p, i) => (
											<li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-[2px] text-[#2dc0d9]" /><span>{p}</span></li>
										))}
									</ul>
								) : null}
							</section>
						) : null}

						{/* Section 4 */}
						{sec4Heading || sec4Points.length ? (
							<section className="mt-10">
								<h2 className="text-3xl sm:text-4xl font-semibold text-[#283277]">{sec4Heading}</h2>
								{sec4Points.length ? (
									<ul className="mt-5 space-y-3 text-[15px] text-neutral-800">
										{sec4Points.map((p, i) => (
											<li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-[2px] text-[#2dc0d9]" /><span>{p}</span></li>
										))}
									</ul>
								) : null}
							</section>
						) : null}

						{/* Section 5 */}
						{sec5Heading || sec5Points.length ? (
							<section className="mt-10">
								<h2 className="text-3xl sm:text-4xl font-semibold text-[#283277]">{sec5Heading}</h2>
								{sec5Points.length ? (
									<ul className="mt-5 space-y-3 text-[15px] text-neutral-800">
										{sec5Points.map((p, i) => (
											<li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-[2px] text-[#2dc0d9]" /><span>{p}</span></li>
										))}
									</ul>
								) : null}
							</section>
						) : null}

						{/* Section 6 */}
						{sec6Heading || sec6Points.length ? (
							<section className="mt-10">
								<h2 className="text-3xl sm:text-4xl font-semibold text-[#283277]">{sec6Heading}</h2>
								{sec6Points.length ? (
									<ul className="mt-5 space-y-3 text-[15px] text-neutral-800">
										{sec6Points.map((p, i) => (
											<li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-[2px] text-[#2dc0d9]" /><span>{p}</span></li>
										))}
									</ul>
								) : null}
							</section>
						) : null}

						{/* Section 7 */}
						{sec7Heading || sec7Points.length || sec7Image ? (
							<section className="mt-10">
								<h2 className="text-3xl sm:text-4xl font-semibold text-[#283277]">{sec7Heading}</h2>
								{sec7Image ? (
									<div className="mt-5 overflow-hidden rounded-lg ring-1 ring-black/5 w-full">
										<Image src={sec7Image} alt={sec7Heading || title} width={1200} height={600} className="w-full h-auto object-cover" />
									</div>
								) : null}
								{sec7Points.length ? (
									<ul className="mt-5 space-y-3 text-[15px] text-neutral-800">
										{sec7Points.map((p, i) => (
											<li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-[2px] text-[#2dc0d9]" /><span>{p}</span></li>
										))}
									</ul>
								) : null}
							</section>
						) : null}

						{/* Final CTA */}
						{finalHeading || finalDescription || btn1Text || btn2Text ? (
							<section className="mt-12 rounded-lg bg-[#f6fbff] p-6 ring-1 ring-[#2dc0d9]/20">
								<h2 className="text-3xl sm:text-4xl font-semibold text-[#283277]">{finalHeading}</h2>
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
