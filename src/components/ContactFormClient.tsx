"use client"

import { useState } from "react"

type FormState = {
  fullName: string
  email: string
  phone: string
  country: string
  service: string
  message: string
}

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  service: "",
  message: "",
}

export default function ContactFormClient() {
  const [values, setValues] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(null)
    setError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          source: typeof window !== "undefined" ? window.location.href : "site",
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || `Submit failed (${res.status})`)
      }
      setSuccess("Thanks! We received your inquiry and will get back to you shortly.")
      setValues(initialState)
    } catch (err: any) {
      setError(err?.message || "Failed to submit. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function set<K extends keyof FormState>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {success ? (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800">{success}</div>
      ) : null}
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input id="fullName" name="fullName" required value={values.fullName} onChange={set("fullName")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc0d9] focus:border-transparent transition-colors" placeholder="Enter your full name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input id="email" name="email" type="email" required value={values.email} onChange={set("email")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc0d9] focus:border-transparent transition-colors" placeholder="Enter your email" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number / WhatsApp *</label>
          <input id="phone" name="phone" required value={values.phone} onChange={set("phone")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc0d9] focus:border-transparent transition-colors" placeholder="Enter your phone number" />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country of Interest *</label>
          <select id="country" name="country" required value={values.country} onChange={set("country")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc0d9] focus:border-transparent transition-colors">
            <option value="">Select a country</option>
            <option value="australia">Australia</option>
            <option value="canada">Canada</option>
            <option value="germany">Germany</option>
            <option value="uk">United Kingdom</option>
            <option value="usa">United States</option>
            <option value="new-zealand">New Zealand</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">Type of Visa / Service *</label>
        <select id="service" name="service" required value={values.service} onChange={set("service")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc0d9] focus:border-transparent transition-colors">
          <option value="">Select a service</option>
          <option value="visit-visa">Visit Visa</option>
          <option value="work-permit">Work Permit</option>
          <option value="skilled-migration">Skilled Migration</option>
          <option value="job-seeker-visa">Job Seeker Visa</option>
          <option value="working-holiday-visa">Working Holiday Visa</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message / Inquiry *</label>
        <textarea id="message" name="message" rows={6} required value={values.message} onChange={set("message")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc0d9] focus:border-transparent transition-colors resize-none" placeholder="Tell us about your immigration goals and how we can help..."></textarea>
      </div>

      <button type="submit" disabled={submitting} className="w-full bg-[#283277] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1f295f] transition-colors duration-200 focus:ring-2 focus:ring-[#2dc0d9] focus:ring-offset-2 disabled:opacity-70">
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}


