import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"
import HeaderNavClient from "@/components/HeaderNavClient"
import HeaderNavDesktop from "@/components/HeaderNavDesktop"
import FadeIn from "@/components/FadeIn"
import { normalizeWpLink, fetchVisitVisas, fetchWorkPermits, fetchSkilledMigrations, fetchJobSeekerVisas, fetchWorkingHolidayVisas } from "@/lib/wp-rest"

async function fetchHeader() {
	const baseUrl = process.env.WP_HEADER_URL || "http://gai.local/wp-json/wp/v2/header"
	const url = `${baseUrl}?per_page=1&orderby=modified&order=desc`
	const res = await fetch(url, { cache: "no-store" })
	if (!res.ok) return null
	const arr = (await res.json()) as any[]
	const item = Array.isArray(arr) ? arr[0] : null
	if (!item) return null
	const acf = item.acf || {}
	const logo = acf["logo"]
	const logoUrl: string | undefined = typeof logo?.url === "string" ? logo.url : undefined
	const logoAlt: string = typeof logo?.alt === "string" ? logo.alt : "Logo"
	const menuRaw: Array<any> = Array.isArray(acf["menu"]) ? acf["menu"] : []
	const menu = menuRaw
		.filter((m) => (m?.acf_fc_layout || "").toLowerCase() === "menu_items")
		.map((m) => {
			const label = m?.page_name as string
			const href = normalizeWpLink(m?.page_link?.url as string) || "#"
			// Ensure home link is always "/"
			return { 
				label, 
				href: label?.toLowerCase() === "home" ? "/" : href
			}
		})
	const callText: string = acf["call_us_now"] || "Call us now"
	const callHref: string | undefined = acf["call_link"]?.url || (acf["call_us_now"] ? `tel:${acf["call_us_now"]}` : undefined)
	return { logoUrl, logoAlt, menu, callText, callHref }
}

export default async function HeaderServer() {
	const data = await fetchHeader()
	if (!data) return null
	const { logoUrl, logoAlt, menu, callText, callHref } = data
	
	// Fetch all visa types for submenus
	const visitVisas = await fetchVisitVisas()
	const workPermits = await fetchWorkPermits()
	const skilledMigrations = await fetchSkilledMigrations()
    const jobSeekerVisas = await fetchJobSeekerVisas()
    const workingHolidayVisas = await fetchWorkingHolidayVisas()
	return (
		<FadeIn>
			<header className="w-full border-b bg-white">
				<div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
					{/* Mobile: 2 cols (logo, hamburger). Desktop: 12 cols (3:6:3) */}
					<div className="grid grid-cols-2 md:grid-cols-12 items-center gap-4 py-4">
						{/* Logo */}
						<div className="flex items-center gap-3 md:col-span-1">
						{logoUrl ? (
							<Link href="/" className="block w-full max-w-[140px]">
								<Image
									src={logoUrl}
									alt={logoAlt}
									width={140}
									height={76}
									className="h-auto w-full"
									sizes="(max-width: 768px) 120px, 140px"
									priority
								/>
							</Link>
						) : (
								<span className="text-lg font-semibold">Site</span>
							)}
						</div>
						{/* Desktop menu */}
                        <HeaderNavDesktop 
							menu={menu} 
							visitVisas={visitVisas}
							workPermits={workPermits}
							skilledMigrations={skilledMigrations}
                            jobSeekerVisas={jobSeekerVisas}
                            workingHolidayVisas={workingHolidayVisas}
						/>
						{/* Mobile hamburger (right column) */}
						<div className="md:hidden flex justify-end">
							<HeaderNavClient menu={menu} />
						</div>
						{/* Desktop call button (right col) */}
						<div className="hidden md:flex items-center justify-end md:col-span-2">
							{callHref ? (
								<a href={callHref} className="inline-flex items-center gap-2 rounded-md bg-[#273378] px-4 py-2 text-white">
									<Phone className="h-4 w-4" />
									<div className="leading-tight text-sm text-left">
										<div className="font-medium">Call us now</div>
										<div className="opacity-90 text-[15px]">{callText}</div>
									</div>
								</a>
							) : (
								<div className="inline-flex items-center gap-2 rounded-md bg-[#273378] px-4 py-2 text-white">
									<Phone className="h-4 w-4" />
									<div className="leading-tight text-sm">
										<div className="font-medium">Call us now</div>
										<div className="opacity-90 text-[15px]">{callText}</div>
									</div>
								</div>
							)}
						</div>
						{/* Mobile full-width call button row */}
						<div className="col-span-2 md:hidden">
							{callHref ? (
								<a href={callHref} className="block w-full items-center gap-2 rounded-md bg-[#273378] px-4 py-3 text-white text-left">
									<span className="inline-flex items-center gap-2">
										<Phone className="h-5 w-5" />
										<span className="font-medium">Call us now</span>
									</span>
									<div className="opacity-90 text-base mt-1">{callText}</div>
								</a>
							) : (
								<div className="block w-full items-center gap-2 rounded-md bg-[#273378] px-4 py-3 text-white">
									<span className="inline-flex items-center gap-2">
										<Phone className="h-5 w-5" />
										<span className="font-medium">Call us now</span>
									</span>
									<div className="opacity-90 text-base mt-1">{callText}</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>
		</FadeIn>
	)
}
