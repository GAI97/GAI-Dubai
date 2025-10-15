import { fetchContactPage } from "@/lib/wp-rest"
import ContactFormClient from "@/components/ContactFormClient"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram, Linkedin, Youtube, Send } from "lucide-react"

export const dynamic = "force-dynamic"

function WhatsappIcon(props: { className?: string }) {
    return (
        <svg className={props.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.57 2 2.13 6.44 2.13 11.91c0 2.09.66 4.03 1.78 5.61L2 22l4.61-1.84a9.86 9.86 0 0 0 5.43 1.59h.01c5.47 0 9.91-4.44 9.91-9.91C22 6.44 17.51 2 12.04 2zm0 17.93h-.01a8 8 0 0 1-4.29-1.26l-.31-.19-2.73 1.09.52-2.83-.2-.29a8 8 0 1 1 7.02 3.48zM16.6 14.3c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.38.1-.5.1-.1.24-.26.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.48-.4-.42-.54-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.68 2.56 4.06 3.59.57.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
        </svg>
    )
}

function getArray(acf: Record<string, any>, key: string): any[] {
	const v = acf?.[key]
	return Array.isArray(v) ? v : []
}

export default async function ContactUsPage() {
	const page = await fetchContactPage()
	if (!page) return <div>Contact page not found</div>
	
	const acf: any = page.acf || {}

	const heading = acf?.heading || "Contact Us"
	const description = acf?.contact_description || ""
	const bannerImage = acf?.banner_image?.url

	const addressHeading = acf?.address_heading || "Get in Touch"
	const address = acf?.address || ""
	const mapLink = acf?.map_link?.url || "#"

	const phoneHeading = acf?.phone_heading || "Phone / WhatsApp"
	const phoneNumber = acf?.phone_number || ""
	const phoneLink = acf?.number_link?.url || "#"
	const whatsappLink: string | undefined = acf?.whatsapp_link?.url || acf?.whatsapp?.url || (typeof phoneLink === 'string' && (phoneLink.includes('wa.me') || phoneLink.includes('whatsapp')) ? phoneLink : undefined)

	const emailHeading = acf?.email_heading || "Email"
	const emailAddress = acf?.email_address || ""

	const businessHoursHeading = acf?.business_hours_heading || "Business Hours"
	const businessHours = getArray(acf, "business_hours_points").map((h) => String(h?.open_hours || "")).filter(Boolean)

	const whyUsHeading = acf?.why_us_heading || "Why Contact Global Alliance Immigration?"
	const whyUsItems = getArray(acf, "why_us_items").map((item) => String(item?.why_us_bullet_points || "")).filter(Boolean)

	const socialHeading = acf?.social_media_heading || "Stay Connected"
	const socialSubHeading = acf?.social_media_sub_heading || ""
	const socialAccounts = getArray(acf, "social_media_accounts")

	const liveSupportText = acf?.live_support_text || ""
	const liveSupportLink: string | undefined = acf?.live_support_link?.url || acf?.live_support?.url || undefined
	const liveSupportCta: string = acf?.live_support_button_text || "Start Live Support"

	return (
		<div className="min-h-screen bg-white">
			{/* Header Section - Centered Design */}
			<div className="py-20">
				<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						{/* Subheading */}
						<div className="flex items-center justify-center gap-2 mb-4">
							<Send className="w-5 h-5 text-[#2dc0d9]" />
							<span className="text-[#2dc0d9] font-semibold tracking-wide text-sm uppercase">CONTACT US</span>
						</div>
						
						{/* Main Heading */}
						<h1 className="text-[60px] font-medium text-[#283277] mb-8 leading-tight">
							{heading}
						</h1>

						{/* Description */}
						{description && (
							<div 
								className="text-[16px] text-gray-700 leading-relaxed max-w-4xl mx-auto space-y-4"
								dangerouslySetInnerHTML={{ __html: description }}
							/>
						)}
					</div>
				</div>
			</div>

			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Contact Form */}
					<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
						<h2 className="text-3xl font-medium text-[#283277] mb-6">Send us a Message</h2>
\t\t\t\t\t\t\t\t<ContactFormClient />
						<ContactFormClient />

						{/* Why Us Section - Under the form */}
						{whyUsHeading && whyUsItems.length > 0 && (
							<div className="mt-8 bg-[#f6fbff] rounded-xl p-6 border border-[#2dc0d9]/20">
								<h3 className="text-xl font-semibold text-[#283277] mb-4">{whyUsHeading}</h3>
								<ul className="space-y-3">
									{whyUsItems.map((item, index) => (
										<li key={index} className="flex items-start gap-3">
											<CheckCircle className="w-5 h-5 text-[#2dc0d9] mt-0.5 flex-shrink-0" />
											<span className="text-gray-700">{item}</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{/* Contact Information */}
					<div className="space-y-8">
						{/* Address */}
						<div className="bg-gray-50 rounded-xl p-6">
							<div className="flex items-start gap-4">
								<div className="bg-[#2dc0d9] p-3 rounded-lg">
									<MapPin className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="text-xl font-semibold text-[#283277] mb-3">{addressHeading}</h3>
									<p className="text-gray-700 mb-4 whitespace-pre-line">{address}</p>
									<Link
										href={mapLink}
										target="_blank"
										className="inline-flex items-center text-[#2dc0d9] hover:text-[#1f295f] transition-colors"
									>
										<MapPin className="w-4 h-4 mr-2" />
										View on Map
									</Link>
								</div>
							</div>
						</div>

					{/* Phone */}
						<div className="bg-gray-50 rounded-xl p-6">
							<div className="flex items-start gap-4">
								<div className="bg-[#2dc0d9] p-3 rounded-lg">
									<Phone className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="text-xl font-semibold text-[#283277] mb-3">{phoneHeading}</h3>
								<Link
									href={phoneLink}
									className="inline-flex items-center gap-2 text-lg text-gray-700 hover:text-[#2dc0d9] transition-colors"
								>
									{(typeof phoneLink === 'string' && (phoneLink.includes('wa.me') || phoneLink.includes('whatsapp'))) ? (
										<WhatsappIcon className="w-5 h-5" />
									) : null}
									<span>{phoneNumber}</span>
								</Link>
								{whatsappLink && !(typeof phoneLink === 'string' && (phoneLink.includes('wa.me') || phoneLink.includes('whatsapp'))) ? (
									<div className="mt-3">
											<Link href={whatsappLink} target="_blank" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#25D366] text-white hover:opacity-90 transition">
												<WhatsappIcon className="w-4 h-4" />
											<span>WhatsApp</span>
										</Link>
									</div>
								) : null}
								</div>
							</div>
						</div>

						{/* Email */}
						<div className="bg-gray-50 rounded-xl p-6">
							<div className="flex items-start gap-4">
								<div className="bg-[#2dc0d9] p-3 rounded-lg">
									<Mail className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="text-xl font-semibold text-[#283277] mb-3">{emailHeading}</h3>
									<Link
										href={`mailto:${emailAddress}`}
										className="text-lg text-gray-700 hover:text-[#2dc0d9] transition-colors"
									>
										{emailAddress}
									</Link>
								</div>
							</div>
						</div>

						{/* Business Hours */}
						<div className="bg-gray-50 rounded-xl p-6">
							<div className="flex items-start gap-4">
								<div className="bg-[#2dc0d9] p-3 rounded-lg">
									<Clock className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="text-xl font-semibold text-[#283277] mb-3">{businessHoursHeading}</h3>
									<ul className="space-y-2">
										{businessHours.map((hours, index) => (
											<li key={index} className="text-gray-700">{hours}</li>
										))}
									</ul>
								</div>
							</div>
						</div>


						{/* Social Media */}
						{socialHeading && socialAccounts.length > 0 && (
							<div className="bg-gray-50 rounded-xl p-6">
								<h3 className="text-xl font-semibold text-[#283277] mb-3">{socialHeading}</h3>
								{socialSubHeading && (
									<p className="text-gray-700 mb-4">{socialSubHeading}</p>
								)}
								<div className="flex flex-wrap gap-3">
									{socialAccounts.map((account, index) => {
										const getIcon = (name: string) => {
											switch (name.toLowerCase()) {
												case 'facebook':
													return <Facebook className="w-5 h-5 mr-2" />
												case 'instagram':
													return <Instagram className="w-5 h-5 mr-2" />
												case 'linkedin':
													return <Linkedin className="w-5 h-5 mr-2" />
												case 'youtube':
													return <Youtube className="w-5 h-5 mr-2" />
												default:
													return null
											}
										}
										
										return (
											<Link
												key={index}
												href={account.social_media_link?.url || "#"}
												target="_blank"
												className="inline-flex items-center px-4 py-2 bg-[#283277] text-white rounded-lg hover:bg-[#1f295f] transition-colors"
											>
												{getIcon(account.social_media_name)}
												{account.social_media_name}
											</Link>
										)
									})}
								</div>
							</div>
						)}

					{/* Live Support */}
						{liveSupportText && (
							liveSupportLink ? (
								<Link href={liveSupportLink} target="_blank" className="block bg-green-50 rounded-xl p-6 border border-green-200 hover:bg-green-100 transition">
									<div className="flex items-start gap-4">
										<div className="bg-green-600 p-3 rounded-lg">
											<MessageCircle className="w-6 h-6 text-white" />
										</div>
										<div>
											<h3 className="text-xl font-semibold text-[#283277] mb-2">Live Support</h3>
											<p className="text-gray-700">{liveSupportText}</p>
										</div>
									</div>
								</Link>
							) : (
								<div className="bg-green-50 rounded-xl p-6 border border-green-200">
									<div className="flex items-start gap-4">
										<div className="bg-green-600 p-3 rounded-lg">
											<MessageCircle className="w-6 h-6 text-white" />
										</div>
										<div>
											<h3 className="text-xl font-semibold text-[#283277] mb-2">Live Support</h3>
											<p className="text-gray-700">{liveSupportText}</p>
										</div>
									</div>
								</div>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
