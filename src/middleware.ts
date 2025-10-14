import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (pathname === '/favicon.ico') {
    const url = request.nextUrl.clone()
    url.pathname = '/api/favicon'
    url.search = search // preserve version query if present
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/favicon.ico'],
}


