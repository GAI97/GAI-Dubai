import { Mail, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import FadeIn from "@/components/FadeIn"

async function fetchTopBar() {
	const baseUrl = process.env.WP_HEADER_TOP_BAR_URL || "http://gai.local/wp-json/wp/v2/top-bar-header"
	const url = `${baseUrl}?per_page=1&orderby=modified&order=desc`
	const res = await fetch(url, { cache: "no-store" })
	if (!res.ok) return null
	const arr = (await res.json()) as any[]
	const item = Array.isArray(arr) ? arr[0] : null
	if (!item) return null
	const acf = item.acf || {}
	const workingHours: string | undefined = acf["working_hours"] || undefined
	const emailHref: string | undefined = (acf["email_url"]?.url as string) || (acf["email"] ? `mailto:${acf["email"]}` : undefined)
	const socials: Array<{ label?: string; href?: string }> = Array.isArray(acf["social_media"]) ? acf["social_media"].map((r: any) => ({
		label: r?.social_media,
		href: r?.social_media_link,
	})) : []
	return { workingHours, emailHref, socials }
}

function SocialIcon({ name }: { name?: string }) {
	const key = (name || "").toLowerCase()
	if (key.includes("face")) return <Facebook className="h-4 w-4" />
	if (key.includes("insta")) return <Instagram className="h-4 w-4" />
	if (key.includes("x") || key.includes("twit")) return <Twitter className="h-4 w-4" />
	if (key.includes("you") || key.includes("tube") || key.includes("yt")) return <Youtube className="h-4 w-4" />
	if (key.includes("tiktok") || key.includes("tik")) {
		return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
	}
	return <span className="inline-block h-4 w-4 rounded-full bg-white/70" />
}

export default async function TopBarServer() {
	const data = await fetchTopBar()
	const workingHours = data?.workingHours || ""
	const emailHref = data?.emailHref
	const emailLabel = emailHref ? emailHref.replace(/^mailto:/i, "") : ""
	const socials = data?.socials || []
	return (
		<FadeIn>
			<div style={{ backgroundColor: "#283277" }} className="text-white text-[13px] sm:text-sm w-full">
				<div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-3 py-2 items-center font-[poppins,ui-sans-serif]">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 shrink-0" />
							<span className="truncate">{workingHours}</span>
						</div>
						<div className="flex items-center gap-2">
							<Mail className="h-4 w-4 shrink-0" />
							{emailHref ? (
								<a href={emailHref} className="underline-offset-2 hover:underline break-all">{emailLabel}</a>
							) : null}
						</div>
						<div className="hidden md:block" />
						<div className="flex items-center md:justify-end gap-3 flex-wrap">
							{socials.map((s, i) => (
								<a key={`${s.href}-${i}`} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="opacity-90 hover:opacity-100">
									<SocialIcon name={s.label} />
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</FadeIn>
	)
}
