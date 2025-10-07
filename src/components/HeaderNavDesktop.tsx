"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export type HeaderMenuItem = { label: string; href: string }
export type VisaItem = { 
	id: number
	slug: string
	title?: { rendered?: string }
	acf?: { service_name?: string }
}

export default function HeaderNavDesktop({ 
    menu, 
    visitVisas,
    workPermits,
    skilledMigrations,
    jobSeekerVisas,
    workingHolidayVisas
}: { 
    menu: HeaderMenuItem[]
    visitVisas: VisaItem[]
    workPermits: VisaItem[]
    skilledMigrations: VisaItem[]
    jobSeekerVisas: VisaItem[]
    workingHolidayVisas: VisaItem[]
}) {
	const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const isWH = (label?: string | null) => !!label && /working\s*(holiday|visa)?/i.test(label)

    // Debug logs to verify submenu wiring at runtime
    useEffect(() => {
        try {
            console.log('[HeaderNavDesktop] menu labels:', menu.map((m) => m.label))
            console.log('[HeaderNavDesktop] workingHolidayVisas count:', workingHolidayVisas?.length ?? 0)
        } catch {}
    }, [menu, workingHolidayVisas])

	return (
		<nav className="hidden md:flex items-center justify-evenly w-full md:col-span-9">
			{menu.map((m, i) => (
				<div
					key={`${m.href}-${i}`}
					className="relative"
                    onMouseEnter={() => { setHoveredItem(m.label); try { console.log('[HeaderNavDesktop] hover:', m.label) } catch {} }}
					onMouseLeave={() => setHoveredItem(null)}
				>
					<Link
						href={m.href}
						className="text-[14px] text-neutral-800 hover:text-black flex items-center gap-1"
					>
						{m.label}
                        {(m.label.toLowerCase() === "visit visa" || 
                          m.label.toLowerCase() === "work permit" || 
                          m.label.toLowerCase() === "skilled migration" || 
                          m.label.toLowerCase() === "job seeker visa" ||
                          isWH(m.label)) && (
							<ChevronDown className="h-3 w-3" />
						)}
					</Link>
					
					{/* Visit Visa Submenu */}
					{m.label.toLowerCase() === "visit visa" && (
						<AnimatePresence>
							{hoveredItem === "Visit Visa" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
									onMouseEnter={() => setHoveredItem("Visit Visa")}
									onMouseLeave={() => setHoveredItem(null)}
								>
									<div className="py-2">
										{visitVisas.length > 0 ? (
											visitVisas.map((visa) => {
												const title = visa.acf?.service_name || visa.title?.rendered || "Visit Visa"
												return (
													<Link
														key={visa.id}
														href={`/visit-visa/${visa.slug}`}
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
													>
														{title}
													</Link>
												)
											})
										) : (
											<div className="px-4 py-2 text-sm text-gray-500">
												No visit visa items found
											</div>
										)}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					)}

					{/* Work Permit Submenu */}
					{m.label.toLowerCase() === "work permit" && (
						<AnimatePresence>
							{hoveredItem === "Work Permit" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
									onMouseEnter={() => setHoveredItem("Work Permit")}
									onMouseLeave={() => setHoveredItem(null)}
								>
									<div className="py-2">
										{workPermits.length > 0 ? (
											workPermits.map((permit) => {
												const title = permit.acf?.service_name || permit.title?.rendered || "Work Permit"
												return (
													<Link
														key={permit.id}
														href={`/work-permit/${permit.slug}`}
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
													>
														{title}
													</Link>
												)
											})
										) : (
											<div className="px-4 py-2 text-sm text-gray-500">
												No work permit items found
											</div>
										)}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					)}

					{/* Skilled Migration Submenu */}
					{m.label.toLowerCase() === "skilled migration" && (
						<AnimatePresence>
							{hoveredItem === "Skilled Migration" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
									onMouseEnter={() => setHoveredItem("Skilled Migration")}
									onMouseLeave={() => setHoveredItem(null)}
								>
									<div className="py-2">
										{skilledMigrations.length > 0 ? (
											skilledMigrations.map((migration) => {
												const title = migration.acf?.service_name || migration.title?.rendered || "Skilled Migration"
												return (
													<Link
														key={migration.id}
														href={`/skilled-migration/${migration.slug}`}
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
													>
														{title}
													</Link>
												)
											})
										) : (
											<div className="px-4 py-2 text-sm text-gray-500">
												No skilled migration items found
											</div>
										)}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					)}

					{/* Job Seeker Visa Submenu */}
					{m.label.toLowerCase() === "job seeker visa" && (
						<AnimatePresence>
							{hoveredItem === "Job Seeker Visa" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
									onMouseEnter={() => setHoveredItem("Job Seeker Visa")}
									onMouseLeave={() => setHoveredItem(null)}
								>
									<div className="py-2">
										{jobSeekerVisas.length > 0 ? (
											jobSeekerVisas.map((visa) => {
												const title = visa.acf?.service_name || visa.title?.rendered || "Job Seeker Visa"
												return (
													<Link
														key={visa.id}
														href={`/job-seeker-visa/${visa.slug}`}
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
													>
														{title}
													</Link>
												)
											})
										) : (
											<div className="px-4 py-2 text-sm text-gray-500">
												No job seeker visa items found
											</div>
										)}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					)}

					{/* Working Holiday Submenu */}
					{isWH(m.label) && (
						<AnimatePresence>
							{isWH(hoveredItem) && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
									onMouseEnter={() => setHoveredItem(m.label)}
									onMouseLeave={() => setHoveredItem(null)}
								>
									<div className="py-2">
										{workingHolidayVisas.length > 0 ? (
											workingHolidayVisas.map((visa) => {
												const title = visa.acf?.service_name || visa.title?.rendered || "Working Holiday"
												return (
													<Link
														key={visa.id}
														href={`/working-holiday/${visa.slug}`}
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
													>
														{title}
													</Link>
												)
											})
										) : (
											<div className="px-4 py-2 text-sm text-gray-500">
												No working holiday items found
											</div>
										)}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					)}
				</div>
			))}
		</nav>
	)
}
