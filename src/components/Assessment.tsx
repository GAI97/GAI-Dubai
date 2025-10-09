"use client"

import { useState } from "react"

export type AssessmentProps = {
	subheading?: string
	heading?: string
	description?: string
	highlights?: string[]
	formNote?: string
}

export default function Assessment({ subheading, heading, description, highlights = [], formNote }: AssessmentProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setIsSubmitting(true)
		setTimeout(() => setIsSubmitting(false), 800)
	}
	return (
		<section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
				<div>
					{subheading ? <div className="text-[#2dc0d9] font-semibold tracking-wide text-sm">{subheading}</div> : null}
					{heading ? <h2 className="mt-2 text-3xl sm:text-6xl font-semibold text-[#283277]">{heading}</h2> : null}
					{description ? <p className="mt-4 text-neutral-700 leading-relaxed">{description}</p> : null}
					{highlights.length ? (
						<ul className="mt-6 space-y-2">
							{highlights.map((h, i) => (
								<li key={i} className="flex items-start gap-2 text-sm text-neutral-800">
									<span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#2dc0d9]" />
									<span>{h}</span>
								</li>
							))}
						</ul>
					) : null}
				</div>
				<div>
					<form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-5 bg-white" autoComplete="off" suppressHydrationWarning data-lpignore="true" data-1p-ignore="true">
						<label className="flex flex-col gap-1 text-sm" suppressHydrationWarning>
							<span>Full Name*</span>
							<input required name="fullName" autoComplete="name" className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2dc0d9]" data-lpignore="true" data-1p-ignore="true" />
						</label>
						<label className="flex flex-col gap-1 text-sm" suppressHydrationWarning>
							<span>Phone Number*</span>
							<input required type="tel" name="phone" autoComplete="tel" className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2dc0d9]" data-lpignore="true" data-1p-ignore="true" />
						</label>
						<label className="flex flex-col gap-1 text-sm" suppressHydrationWarning>
							<span>Email*</span>
							<input required type="email" name="email" autoComplete="email" className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2dc0d9]" data-lpignore="true" data-1p-ignore="true" />
						</label>
						<label className="flex flex-col gap-1 text-sm" suppressHydrationWarning>
							<span>Country/Region*</span>
							<input required name="country" autoComplete="country-name" className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2dc0d9]" data-lpignore="true" data-1p-ignore="true" />
						</label>
						<label className="flex flex-col gap-1 text-sm" suppressHydrationWarning>
							<span>Occupation*</span>
							<input required name="occupation" className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2dc0d9]" data-lpignore="true" data-1p-ignore="true" />
						</label>
						<label className="flex flex-col gap-1 text-sm" suppressHydrationWarning>
							<span>Education Level*</span>
							<input required name="education" className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2dc0d9]" data-lpignore="true" data-1p-ignore="true" />
						</label>
						<label className="flex flex-col gap-1 text-sm" suppressHydrationWarning>
							<span>Destination*</span>
							<input required name="destination" className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2dc0d9]" data-lpignore="true" data-1p-ignore="true" />
						</label>
						<label className="sm:col-span-2 flex flex-col gap-1 text-sm" suppressHydrationWarning>
							<span>Additional Comments</span>
							<textarea name="comments" rows={4} className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2dc0d9]" data-lpignore="true" data-1p-ignore="true" />
						</label>
						<div className="sm:col-span-2 flex flex-col gap-2">
							<button disabled={isSubmitting} className="inline-flex items-center justify-center rounded-md bg-[#283277] px-5 py-3 text-white text-sm font-medium disabled:opacity-70">
								{isSubmitting ? "Submitting..." : "Submit"}
							</button>
							{formNote ? <p className="text-xs text-neutral-600">{formNote}</p> : null}
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}
