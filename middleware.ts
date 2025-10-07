import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/((?!_next/|favicon.ico|maintenance).*)'],
}

async function fetchMaintenanceMode(): Promise<'Under Maintenance' | 'Active' | null> {
  const endpoint = process.env.WP_MAINTENANCE_ENDPOINT
  if (!endpoint) return null
  try {
    const res = await fetch(endpoint, { next: { revalidate: 30 } })
    if (!res.ok) return null
    const data = await res.json()
    // Expecting an array with objects that include acf.maintenance_mode
    const item = Array.isArray(data) ? data[0] : data
    const value = item?.acf?.maintenance_mode as string | undefined
    if (!value) return null
    if (/under maintenance/i.test(value)) return 'Under Maintenance'
    return 'Active'
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const mode = await fetchMaintenanceMode()
  if (mode === 'Under Maintenance') {
    const url = req.nextUrl.clone()
    // Allow the maintenance page itself
    if (url.pathname === '/maintenance') return NextResponse.next()
    url.pathname = '/maintenance'
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}


