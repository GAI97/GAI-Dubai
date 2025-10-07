import Image from "next/image"
import Link from "next/link"
import { fetchSkilledMigrations } from "@/lib/wp-rest"

export const dynamic = "force-dynamic"

export default async function SkilledMigrationIndexPage() {
	const items = await fetchSkilledMigrations()
	return (
		<main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12">
			<div className="text-center">
				<div className="text-[#2dc0d9] font-semibold tracking-wide text-sm">SKILLED MIGRATION</div>
				<h1 className="mt-2 text-3xl sm:text-5xl font-semibold text-[#283277]">Choose Your Skilled Migration</h1>
			</div>
			{items.length === 0 ? (
				<p className="mt-10 text-center text-sm text-neutral-600">No skilled migration items found.</p>
			) : (
				<div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
					{items.map((it) => {
						const acf: any = (it as any)?.acf || {}
						const title = (acf?.service_name as string) || it.title?.rendered || "Skilled Migration"
						const subheading = (acf?.service_subheading as string) || ""
                        // Prefer banner image like other sections; fallback to service_image
                        const img = (acf?.banner_image?.url as string) || (acf?.service_image?.url as string) || undefined
						return (
							<Link href={`/skilled-migration/${it.slug}`} key={it.id} className="w-full max-w-[360px] mx-auto rounded-lg overflow-hidden flex flex-col relative group cursor-pointer hover:scale-105 transition-transform duration-300">
								{/* Background Image with Dark Overlay */}
								<div className="relative h-96 w-full">
									{img ? (
										<Image 
											src={img} 
											alt={title} 
											width={600} 
											height={360} 
											className="h-full w-full object-cover" 
										/>
									) : (
										<div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900" />
									)}
									{/* Dark Overlay */}
									<div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
									
									{/* Content Overlay */}
									<div className="absolute inset-0 p-6 flex flex-col justify-between">
										{/* Top Section with Icon */}
										<div className="flex justify-between items-start">
											<div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											</div>
											{/* Arrow Button */}
											<div className="w-8 h-8 bg-red-500 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-300">
												<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</div>
										</div>
										
										{/* Bottom Section with Text */}
										<div className="space-y-4">
											<div className="flex items-center space-x-3">
												<div className="w-1 h-10 bg-white"></div>
												<div>
													<div className="text-white/80 text-xs font-medium uppercase tracking-wider mb-2">SERVICE</div>
													<h2 className="text-white font-bold text-xl leading-tight">{title}</h2>
												</div>
											</div>
											{subheading && (
												<p className="text-white/90 text-sm leading-relaxed">{subheading}</p>
											)}
										</div>
									</div>
								</div>
							</Link>
						)
					})}
				</div>
			)}
		</main>
	)
}
