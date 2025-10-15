export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT
    const token = process.env.CONTACT_FORM_TOKEN
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Server not configured' }), { status: 500 })
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token && token.length > 0) {
      headers['X-Contact-Token'] = token
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      return new Response(JSON.stringify(json || { error: 'Upstream error' }), { status: res.status })
    }
    return new Response(JSON.stringify(json), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 })
  }
}


