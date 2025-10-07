"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Clock } from "lucide-react"
import { RestFooter, normalizeWpLink } from "@/lib/wp-rest"

interface FooterProps {
	footerData: RestFooter | null
}

export default function Footer({ footerData }: FooterProps) {
	if (!footerData?.acf) {
		return null
	}

	const { acf } = footerData

	// Ensure we have the required data to prevent hydration mismatches
	if (!acf.about_us_heading || !acf.about_us_short_description) {
		return null
	}

	// Get social media icons based on platform name
	const getSocialIcon = (platform: string) => {
		switch (platform.toLowerCase()) {
			case 'facebook':
				return <Facebook className="w-5 h-5" />
			case 'instagram':
				return <Instagram className="w-5 h-5" />
			case 'tiktok':
				return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
			default:
				return <Mail className="w-5 h-5" />
		}
	}

	// Get contact icons
	const getContactIcon = (heading: string) => {
		switch (heading.toLowerCase()) {
			case 'address':
				return <MapPin className="w-4 h-4" />
			case 'mobile/whatsapp':
				return <Phone className="w-4 h-4" />
			case 'email':
				return <Mail className="w-4 h-4" />
			case 'working hours':
				return <Clock className="w-4 h-4" />
			default:
				return <MapPin className="w-4 h-4" />
		}
	}

	return (
		<footer className="bg-[#283277] text-white">
			{/* Main Footer Content */}
			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
					{/* Column 1: Company Info & Social Media */}
					<div className="lg:col-span-3 space-y-6">
						{/* Logo */}
						{acf.logo?.url && (
							<div className="flex items-center space-x-3">
								<Image
									src={acf.logo.url}
									alt={acf.logo.alt || "Global Alliance Immigration"}
									width={200}
									height={100}
									className="h-20 w-auto"
								/>
							</div>
						)}
						
						{/* About Us Content from API */}
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">{acf.about_us_heading || "Your Global Journey Starts Here"}</h3>
							<p className="text-sm text-gray-300">{acf.about_us_short_description || "Trusted Visa Experts"}</p>
						</div>

						{/* Social Media */}
						<div className="flex space-x-4">
							{acf.social_media_accounts?.map((social, index) => (
								<a
									key={index}
									href={social.social_media_link?.url || "#"}
									target={social.social_media_link?.target || "_blank"}
									rel="noopener noreferrer"
									className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
								>
									{getSocialIcon(social.social_media_name)}
								</a>
							))}
						</div>
					</div>

					{/* Column 2: Navigation Links */}
					<div className="lg:col-span-3 space-y-4">
						<h3 className="text-lg font-semibold">{acf.section_heading || "Navigation"}</h3>
						<ul className="space-y-3">
							{acf.footer_menu?.map((item, index) => (
								<li key={index}>
                                    <Link 
                                        href={normalizeWpLink(item.footer_menu_item_link?.url) || "#"} 
										className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
									>
										<span className="w-2 h-2 bg-[#2dc0d9] rounded-full"></span>
										<span>{item.footer_menu_item_name}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Column 3: Keep in touch */}
					<div className="lg:col-span-4 space-y-4">
						<h3 className="text-lg font-semibold">{acf["3rd_column_heading"] || "Keep in touch"}</h3>
						<ul className="space-y-3">
							{acf.address_block?.map((contact, index) => (
								<li key={index} className="flex items-start space-x-3">
									<div className="flex-shrink-0 mt-1">
										{getContactIcon(contact.contact_heading)}
									</div>
									<div>
										<h4 className="text-sm font-medium text-white">{contact.contact_heading}</h4>
										<p className="text-sm text-gray-300 whitespace-pre-line">{contact.contact_info}</p>
									</div>
								</li>
							))}
						</ul>
					</div>

					{/* Column 4: Policies */}
					<div className="lg:col-span-2 space-y-4">
						<h3 className="text-lg font-semibold">{acf["4th_section_heading"] || "Policies"}</h3>
						<ul className="space-y-3">
							{acf.important_links_block?.map((link, index) => (
								<li key={index}>
                                    <Link 
                                        href={normalizeWpLink(link.important_menu_item_link?.url) || "#"} 
										className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
									>
										<span className="w-2 h-2 bg-[#2dc0d9] rounded-full"></span>
										<span>{link.important_menu_item_name}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom Section */}
			<div className="border-t border-gray-600">
				<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="text-center">
						{/* Copyright */}
						<div className="text-sm text-gray-300">
							{acf.copyright_text || "Copyright © 2025 globalallianceimmigration.com - All Rights Reserved."}
						</div>
					</div>
					
					{/* Designer Name */}
					{acf.designer_name && (
						<div className="text-center mt-4">
							<p className="text-xs text-gray-400">{acf.designer_name}</p>
						</div>
					)}
				</div>
			</div>
		</footer>
	)
}

// normalizeWpLink imported from '@/lib/wp-rest'
