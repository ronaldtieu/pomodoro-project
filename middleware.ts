import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('🔵 Middleware running for:', request.nextUrl.pathname)

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll()
          console.log('🍪 Cookies:', cookies.map(c => c.name))
          return cookies
        },
        setAll(cookiesToSet) {
          console.log('🔐 Setting cookies:', cookiesToSet.map(c => c.name))
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session and get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('👤 User from session:', user ? { id: user.id, email: user.email } : null)

  // Protect dashboard routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('🚫 No user, redirecting to login from /dashboard')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('✅ Middleware: allowing access to', request.nextUrl.pathname)
  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
