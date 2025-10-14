import { fetchFooter, normalizeWpLink } from "@/lib/wp-rest"
import Footer from "./Footer"

export const dynamic = 'force-dynamic'

export default async function FooterServer() {
	const footerData = await fetchFooter()

    // Normalize WP links on the server to avoid hydration mismatches
    const normalized = footerData ? {
        ...footerData,
        acf: footerData.acf ? {
            ...footerData.acf,
            social_media_accounts: Array.isArray(footerData.acf.social_media_accounts)
                ? footerData.acf.social_media_accounts.map((item: any) => ({
                    ...item,
                    social_media_link: {
                        ...(item?.social_media_link ?? {}),
                        url: normalizeWpLink(item?.social_media_link?.url) || "#",
                        target: item?.social_media_link?.target || "_blank",
                    },
                }))
                : footerData.acf.social_media_accounts,
            footer_menu: Array.isArray(footerData.acf.footer_menu)
                ? footerData.acf.footer_menu.map((item: any) => ({
                    ...item,
                    footer_menu_item_link: {
                        ...(item?.footer_menu_item_link ?? {}),
                        url: normalizeWpLink(item?.footer_menu_item_link?.url) || "#",
                    },
                }))
                : footerData.acf.footer_menu,
            important_links_block: Array.isArray(footerData.acf.important_links_block)
                ? footerData.acf.important_links_block.map((item: any) => ({
                    ...item,
                    important_menu_item_link: {
                        ...(item?.important_menu_item_link ?? {}),
                        url: normalizeWpLink(item?.important_menu_item_link?.url) || "#",
                    },
                }))
                : footerData.acf.important_links_block,
        } : footerData.acf,
    } : footerData

    return <Footer footerData={normalized} />
}
