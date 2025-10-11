function validateUrl(input?: string | null): string | null {
	if (!input) return null
	try {
		const u = new URL(input)
		return u.toString().replace(/\/$/, '')
	} catch {
		return null
	}
}

function ensureAbsoluteHttpUrl(input?: string): string | undefined {
	if (!input) return undefined
	const trimmed = input.trim()
	if (!trimmed) return undefined
	if (/^https?:\/\//i.test(trimmed)) return trimmed
	if (/^mailto:/i.test(trimmed)) return trimmed
	return `https://${trimmed.replace(/^\/*/, '')}`
}

function deriveRestBaseFromGraphql(): string | null {
	const gql = validateUrl(process.env.WP_GRAPHQL_ENDPOINT)
	if (!gql) return null
	try {
		const url = new URL(gql)
		return `${url.origin}/wp-json`
	} catch {
		return null
	}
}

function getWpRestBase(): string | null {
	const fromEnv = validateUrl(process.env.WP_REST_BASE)
	if (fromEnv) return fromEnv
	const derived = deriveRestBaseFromGraphql()
	if (derived) return derived
	// Development fallback to unblock local testing when envs are missing
	if (process.env.NODE_ENV !== 'production') {
		return 'http://gai.local/wp-json'
	}
	return null
}

export function normalizeWpLink(href?: string): string | undefined {
	if (!href) return undefined
	try {
		// Handle localhost URLs: convert to relative paths
		if (href.includes('localhost:3000') || href.includes('localhost:3002')) {
			const url = new URL(href)
			return url.pathname.replace(/\/$/, '') || '/'
		}
		
		// Handle port mismatch: if the link points to gai.local:3000, convert to relative path
		if (href.includes('gai.local:3000')) {
			const url = new URL(href)
			return url.pathname.replace(/\/$/, '') || '/'
		}
		
		const restBase = getWpRestBase()
		if (restBase) {
			const origin = new URL(restBase).origin
			const url = new URL(href, origin)
			// If link starts with WP site origin, convert to pathname
			if (url.origin === origin) {
				return url.pathname.replace(/\/$/, '') || '/'
			}
			
			return url.toString()
		}
		return href
	} catch {
		return href
	}
}

export function normalizeWpMediaUrl(input?: string): string | undefined {
    if (!input) return undefined
    try {
        const url = new URL(input)
        // Force https in production but do not change hostname/path
        if (url.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
            url.protocol = 'https:'
            return url.toString()
        }
        return input
    } catch {
        // If it's a relative URL, just return as-is
        return input
    }
}

export type HeaderOptions = {
	site_title?: string
	logo_url?: string
	primary_menu?: Array<{ label?: string; href?: string }>
	rest_api_endpoint?: string
}

export async function fetchAcfOptions(): Promise<HeaderOptions | null> {
	const base = getWpRestBase()
	if (!base) return null
	const url = `${base}/acf/v3/options/options`
	try {
		const res = await fetch(url, { next: { revalidate: 300 } })
		if (!res.ok) return null
		const json = await res.json()
		return (json?.acf ?? null) as HeaderOptions | null
	} catch {
		return null
	}
}

export type TopBarItem = {
	id: number
	slug?: string
	title?: { rendered?: string }
	acf?: Record<string, any>
}

export type TopBarData = {
	workingHours?: string
	email?: string
	socials?: Array<{ label?: string; href?: string; icon?: string }>
}

function extractUrlLike(input: any): string | undefined {
	if (!input) return undefined
	if (typeof input === 'string') return input
	if (typeof input === 'object') {
		if (typeof input.url === 'string') return input.url
		if (input.link && typeof input.link.url === 'string') return input.link.url
	}
	return undefined
}

function coerceEmailFromAcf(acf: Record<string, any>): string | undefined {
	const emailUrl = extractUrlLike(acf['email_url'])
	if (emailUrl) return /^mailto:/i.test(emailUrl) ? emailUrl : `mailto:${emailUrl}`
	if (typeof acf['email'] === 'string' && acf['email'].includes('@')) return `mailto:${acf['email']}`
	const candidates = ["contact_email", "contactEmail", "mail"]
	for (const key of candidates) {
		const raw = acf[key]
		const val = typeof raw === 'object' ? extractUrlLike(raw) : raw
		if (typeof val === 'string' && val.includes('@')) return `mailto:${val}`
	}
	return undefined
}

function coerceWorkingHoursFromAcf(acf: Record<string, any>): string | undefined {
	if (typeof acf['working_hours'] === 'string' && acf['working_hours'].length > 0) return acf['working_hours']
	const candidates = ["workingHours", "hours", "opening_hours", "openingHours"]
	for (const key of candidates) {
		const val = acf[key]
		if (typeof val === "string" && val.length > 0) return val
	}
	return undefined
}

function coerceSocialsFromAcf(acf: Record<string, any>): Array<{ label?: string; href?: string; icon?: string }> {
	const flex = acf['social_media']
	if (Array.isArray(flex)) {
		return flex
			.filter((row) => row && (row.acf_fc_layout ? String(row.acf_fc_layout).toLowerCase() === 'social_icons' : true))
			.map((row) => {
				const label = row?.social_media || row?.label || row?.platform || undefined
				const hrefRaw = extractUrlLike(row?.social_media_link ?? row?.href ?? row?.url)
				return {
					label,
					href: ensureAbsoluteHttpUrl(hrefRaw),
					icon: row?.icon ?? label,
				}
			})
			.filter((s) => !!s.href)
	}
	return []
}

export async function fetchHeaderTopBar(): Promise<TopBarData | null> {
	const explicitCollection = validateUrl(process.env.WP_HEADER_TOP_BAR_URL)
	let baseCollectionUrl: string | null = null
	if (explicitCollection) {
		baseCollectionUrl = explicitCollection
	} else {
		const base = getWpRestBase()
		if (!base) return null
		baseCollectionUrl = `${base}/wp/v2/top-bar-header`
	}
	const collectionUrl = `${baseCollectionUrl}?per_page=1&orderby=modified&order=desc`
	try {
		const res = await fetch(collectionUrl, { cache: 'no-store' })
		if (!res.ok) return null
		const list = (await res.json()) as TopBarItem[]
		const first = Array.isArray(list) ? list[0] : null
		if (!first) return null
		let acf: Record<string, any> = (first.acf ?? {}) as Record<string, any>
		if (Object.keys(acf).length === 0) {
			const base = getWpRestBase()
			if (base) {
				const acfUrl = `${base}/acf/v3/top-bar-header/${first.id}`
				try {
					const acfRes = await fetch(acfUrl, { cache: 'no-store' })
					if (acfRes.ok) {
						const acfJson = await acfRes.json()
						acf = (acfJson?.acf ?? {}) as Record<string, any>
					}
				} catch {}
			}
		}
		const workingHours = coerceWorkingHoursFromAcf(acf)
		const email = coerceEmailFromAcf(acf)
		const socials = coerceSocialsFromAcf(acf)
		return { workingHours, email, socials }
	} catch (e) {
		return null
	}
}

export type RestPostSummary = {
	id: number
	slug: string
	title: { rendered: string }
	excerpt?: { rendered?: string }
}

export async function fetchPostsRest(limit: number = 10): Promise<Array<{ id: string; slug: string; title: string; excerpt?: string }>> {
	const base = getWpRestBase()
	if (!base) return []
	const url = `${base}/wp/v2/posts?per_page=${Math.max(1, Math.min(100, limit))}`
	try {
		const res = await fetch(url, { next: { revalidate: 60 } })
		if (!res.ok) return []
		const json = (await res.json()) as RestPostSummary[]
		return json.map((p) => ({
			id: String(p.id),
			slug: p.slug,
			title: p.title?.rendered ?? '',
			excerpt: p.excerpt?.rendered ?? undefined,
		}))
	} catch {
		return []
	}
}

// Pages
export type RestPage = { id: number; slug: string; acf?: Record<string, any> }

export async function fetchPageBySlug(slug: string): Promise<RestPage | null> {
	// Try explicit full URL override first if provided
	const explicit = validateUrl(process.env.WP_HOME_PAGE_URL)
	if (explicit) {
		try {
			if (process.env.NODE_ENV !== 'production') {
				console.info(`[fetchPageBySlug] Using explicit URL: ${explicit}`)
			}
			const res = await fetch(explicit, { cache: 'no-store' })
			if (res.ok) {
				const list = (await res.json()) as RestPage[]
				return list?.[0] ?? null
			}
		} catch {}
	}
	const base = getWpRestBase()
	if (!base) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn('[fetchPageBySlug] WP_REST_BASE not set')
		}
		return null
	}
	const url = `${base}/wp/v2/pages?slug=${encodeURIComponent(slug)}&per_page=1`
	try {
		if (process.env.NODE_ENV !== 'production') {
			console.info(`[fetchPageBySlug] GET ${url}`)
		}
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) {
			if (process.env.NODE_ENV !== 'production') {
				console.warn(`[fetchPageBySlug] Non-200 ${res.status} from ${url}`)
			}
			return null
		}
		const list = (await res.json()) as RestPage[]
		return list?.[0] ?? null
	} catch (e) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(`[fetchPageBySlug] Failed to fetch ${url}`)
		}
		return null
	}
}

// SERVICES HELPERS
export type RestService = {
	id: number
	slug: string
	title?: { rendered?: string }
	excerpt?: { rendered?: string }
	content?: { rendered?: string }
	acf?: Record<string, any>
}

function getServicesBase(): string | null {
	const explicit = validateUrl(process.env.WP_SERVICES_URL)
	if (explicit) return explicit
	const base = getWpRestBase()
	if (!base) return null
	// Try common CPT slugs
	return `${base}/wp/v2/services`
}

export async function fetchServices(): Promise<RestService[]> {
	const base = getServicesBase()
	if (!base) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn('[fetchServices] No base URL. Set WP_REST_BASE or WP_SERVICES_URL')
		}
		return []
	}
	let url = `${base}?per_page=100&_embed`
	try {
		if (process.env.NODE_ENV !== 'production') {
			console.info(`[fetchServices] GET ${url}`)
		}
		let res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) {
			if (process.env.NODE_ENV !== 'production') {
				console.warn(`[fetchServices] Non-200 ${res.status} from ${url}`)
			}
			// Fallback to singular cpt slug if needed
			const altBase = base.replace(/\/services$/, '/service')
			const altUrl = `${altBase}?per_page=100&_embed`
			if (process.env.NODE_ENV !== 'production') {
				console.info(`[fetchServices] Fallback GET ${altUrl}`)
			}
			res = await fetch(altUrl, { cache: 'no-store' })
			if (!res.ok) return []
		}
		const list = (await res.json()) as RestService[]
		return list
	} catch (e) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(`[fetchServices] Failed to fetch ${url}`)
		}
		return []
	}
}

export async function fetchServiceBySlug(slug: string): Promise<RestService | null> {
	const base = getServicesBase()
	if (!base) return null
	let url = `${base}?slug=${encodeURIComponent(slug)}&_embed` 
	try {
		if (process.env.NODE_ENV !== 'production') {
			console.info(`[fetchServiceBySlug] GET ${url}`)
		}
		let res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) {
			const altBase = base.replace(/\/services$/, '/service')
			const altUrl = `${altBase}?slug=${encodeURIComponent(slug)}&_embed`
			if (process.env.NODE_ENV !== 'production') {
				console.info(`[fetchServiceBySlug] Fallback GET ${altUrl}`)
			}
			res = await fetch(altUrl, { cache: 'no-store' })
			if (!res.ok) return null
		}
		const list = (await res.json()) as RestService[]
		return list?.[0] ?? null
	} catch {
		return null
	}
}

export function getServicesDebug() {
	const restBase = getWpRestBase()
	const servicesBase = getServicesBase()
	return {
		env: {
			WP_REST_BASE: process.env.WP_REST_BASE || undefined,
			WP_SERVICES_URL: process.env.WP_SERVICES_URL || undefined,
		},
		restBase,
		servicesBase,
		testUrl: servicesBase ? `${servicesBase}?per_page=1&_embed` : undefined,
	}
}

// VISIT-VISA HELPERS (new CPT)
export type RestVisitVisa = RestService

function getVisitVisaBase(): string | null {
	const base = getWpRestBase()
	if (!base) return null
	return `${base}/wp/v2/visit-visa`
}

export async function fetchVisitVisas(): Promise<RestVisitVisa[]> {
	const base = getVisitVisaBase()
	if (!base) return []
	const url = `${base}?per_page=100&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return []
		return (await res.json()) as RestVisitVisa[]
	} catch {
		return []
	}
}

export async function fetchVisitVisaBySlug(slug: string): Promise<RestVisitVisa | null> {
	const base = getVisitVisaBase()
	if (!base) return null
	const url = `${base}?slug=${encodeURIComponent(slug)}&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return null
		const list = (await res.json()) as RestVisitVisa[]
		return list?.[0] ?? null
	} catch {
		return null
	}
}

// WORK-PERMIT HELPERS (new CPT)
export type RestWorkPermit = RestService

function getWorkPermitBase(): string | null {
	const base = getWpRestBase()
	if (!base) return null
	return `${base}/wp/v2/work-permit`
}

export async function fetchWorkPermits(): Promise<RestWorkPermit[]> {
	const base = getWorkPermitBase()
	if (!base) return []
	const url = `${base}?per_page=100&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return []
		return (await res.json()) as RestWorkPermit[]
	} catch {
		return []
	}
}

export async function fetchWorkPermitBySlug(slug: string): Promise<RestWorkPermit | null> {
	const base = getWorkPermitBase()
	if (!base) return null
	const url = `${base}?slug=${encodeURIComponent(slug)}&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return null
		const list = (await res.json()) as RestWorkPermit[]
		return list?.[0] ?? null
	} catch {
		return null
	}
}

// SKILLED-MIGRATION HELPERS (new CPT)
export type RestSkilledMigration = RestService

function getSkilledMigrationBase(): string | null {
	const base = getWpRestBase()
	if (!base) return null
	return `${base}/wp/v2/skilled-migration`
}

export async function fetchSkilledMigrations(): Promise<RestSkilledMigration[]> {
	const base = getSkilledMigrationBase()
	if (!base) return []
	const url = `${base}?per_page=100&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return []
		return (await res.json()) as RestSkilledMigration[]
	} catch {
		return []
	}
}

export async function fetchSkilledMigrationBySlug(slug: string): Promise<RestSkilledMigration | null> {
	const base = getSkilledMigrationBase()
	if (!base) return null
	const url = `${base}?slug=${encodeURIComponent(slug)}&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return null
		const list = (await res.json()) as RestSkilledMigration[]
		return list?.[0] ?? null
	} catch {
		return null
	}
}

// JOB-SEEKER-VISA HELPERS (new CPT)
export type RestJobSeekerVisa = RestService

function getJobSeekerVisaBase(): string | null {
	const base = getWpRestBase()
	if (!base) return null
	return `${base}/wp/v2/job-seeker-visa`
}

export async function fetchJobSeekerVisas(): Promise<RestJobSeekerVisa[]> {
	const base = getJobSeekerVisaBase()
	if (!base) return []
	const url = `${base}?per_page=100&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return []
		return (await res.json()) as RestJobSeekerVisa[]
	} catch {
		return []
	}
}

export async function fetchJobSeekerVisaBySlug(slug: string): Promise<RestJobSeekerVisa | null> {
	const base = getJobSeekerVisaBase()
	if (!base) return null
	const url = `${base}?slug=${encodeURIComponent(slug)}&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return null
		const list = (await res.json()) as RestJobSeekerVisa[]
		return list?.[0] ?? null
	} catch {
		return null
	}
}

// WORKING-HOLIDAY-VISA HELPERS (new CPT)
export type RestWorkingHolidayVisa = RestService

function getWorkingHolidayBases(): string[] {
    const base = getWpRestBase()
    if (!base) return []
    // Support both the new CPT slug (working-holiday) and the previous (working-holiday-visa)
    return [
        `${base}/wp/v2/working-holiday`,
        `${base}/wp/v2/working-holiday-visa`,
    ]
}

export async function fetchWorkingHolidayVisas(): Promise<RestWorkingHolidayVisa[]> {
    const bases = getWorkingHolidayBases()
    if (bases.length === 0) return []
    for (const b of bases) {
        const url = `${b}?per_page=100&_embed`
        try {
            const res = await fetch(url, { cache: 'no-store' })
            if (res.ok) {
                return (await res.json()) as RestWorkingHolidayVisa[]
            }
        } catch {}
    }
    return []
}

export async function fetchWorkingHolidayVisaBySlug(slug: string): Promise<RestWorkingHolidayVisa | null> {
    const bases = getWorkingHolidayBases()
    if (bases.length === 0) return null
    for (const b of bases) {
        const url = `${b}?slug=${encodeURIComponent(slug)}&_embed`
        try {
            const res = await fetch(url, { cache: 'no-store' })
            if (res.ok) {
                const list = (await res.json()) as RestWorkingHolidayVisa[]
                const first = list?.[0]
                if (first) return first
            }
        } catch {}
    }
    return null
}

// CONTACT PAGE HELPERS
export type RestContactPage = {
	id: number
	slug: string
	title: { rendered: string }
	acf?: Record<string, any>
}

export async function fetchContactPage(): Promise<RestContactPage | null> {
	const base = getWpRestBase()
	if (!base) return null
	const url = `${base}/wp/v2/pages?slug=contact-us&per_page=1`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return null
		const list = (await res.json()) as RestContactPage[]
		return list?.[0] ?? null
	} catch {
		return null
	}
}

// VISIT-VISA PAGE HELPERS
export type RestVisitVisaPage = {
	id: number
	slug: string
	title: { rendered: string }
	acf?: Record<string, any>
}

export async function fetchVisitVisaPage(): Promise<RestVisitVisaPage | null> {
	const base = getWpRestBase()
	if (!base) return null
	const url = `${base}/wp/v2/pages?slug=visit-visa&per_page=1`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return null
		const list = (await res.json()) as RestVisitVisaPage[]
		return list?.[0] ?? null
	} catch {
		return null
	}
}

// SUCCESS STORIES HELPERS
export type RestSuccessStory = {
	id: number
	slug: string
	title: { rendered: string }
	acf?: {
		heading?: string
		description?: string
		stories?: Array<{
			acf_fc_layout: string
			client_name: string
			visa_type: string
			testimonial: string
			rating: string
			profile_pic?: {
				ID: number
				id: number
				title: string
				filename: string
				filesize: number
				url: string
				link: string
				alt: string
				author: string
				description: string
				caption: string
				name: string
				status: string
				uploaded_to: number
				date: string
				modified: string
				menu_order: number
				mime_type: string
				type: string
				subtype: string
				icon: string
				width: number
				height: number
				sizes: {
					thumbnail: string
					"thumbnail-width": number
					"thumbnail-height": number
					medium: string
					"medium-width": number
					"medium-height": number
					medium_large: string
					"medium_large-width": number
					"medium_large-height": number
					large: string
					"large-width": number
					"large-height": number
					"1536x1536": string
					"1536x1536-width": number
					"1536x1536-height": number
					"2048x2048": string
					"2048x2048-width": number
					"2048x2048-height": number
				}
			}
		}>
	}
}

export async function fetchSuccessStories(): Promise<RestSuccessStory[]> {
	const base = getWpRestBase()
	if (!base) return []
	const url = `${base}/wp/v2/success-stories?per_page=100&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return []
		return (await res.json()) as RestSuccessStory[]
	} catch {
		return []
	}
}

// FOOTER HELPERS
export type RestFooter = {
	id: number
	slug: string
	title: { rendered: string }
	acf?: {
		logo?: {
			ID: number
			id: number
			title: string
			filename: string
			filesize: number
			url: string
			link: string
			alt: string
			author: string
			description: string
			caption: string
			name: string
			status: string
			uploaded_to: number
			date: string
			modified: string
			menu_order: number
			mime_type: string
			type: string
			subtype: string
			icon: string
			width: number
			height: number
			sizes: {
				thumbnail: string
				"thumbnail-width": number
				"thumbnail-height": number
				medium: string
				"medium-width": number
				"medium-height": number
				medium_large: string
				"medium_large-width": number
				"medium_large-height": number
				large: string
				"large-width": number
				"large-height": number
				"1536x1536": string
				"1536x1536-width": number
				"1536x1536-height": number
				"2048x2048": string
				"2048x2048-width": number
				"2048x2048-height": number
			}
		}
		about_us_heading: string
		about_us_short_description: string
		social_media_accounts: Array<{
			acf_fc_layout: string
			social_media_name: string
			social_media_link: {
				title: string
				url: string
				target: string
			}
		}>
		section_heading: string
		footer_menu: Array<{
			acf_fc_layout: string
			footer_menu_item_name: string
			footer_menu_item_link: {
				title: string
				url: string
				target: string
			}
		}>
		"3rd_column_heading": string
		address_block: Array<{
			acf_fc_layout: string
			contact_heading: string
			contact_info: string
		}>
		"4th_section_heading": string
		important_links_block: Array<{
			acf_fc_layout: string
			important_menu_item_name: string
			important_menu_item_link: {
				title: string
				url: string
				target: string
			}
		}>
		copyright_text: string
		designer_name: string
	}
}

export async function fetchFooter(): Promise<RestFooter | null> {
	const base = getWpRestBase()
	if (!base) return null
	const url = `${base}/wp/v2/footer?per_page=1&_embed`
	try {
		const res = await fetch(url, { cache: 'no-store' })
		if (!res.ok) return null
		const list = (await res.json()) as RestFooter[]
		return list?.[0] ?? null
	} catch {
		return null
	}
}

