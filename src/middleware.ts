import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import appConfig from '@/lib/config'

export async function middleware(request: NextRequest) {
  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    appConfig.supabase.url,
    appConfig.supabase.anonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.delete({
            name,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow all routes for authentication
  if (
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname === '/'
  ) {
    return response
  }

  // Redirect unauthenticated users to login page except for public routes
  if (
    !user && 
    !request.nextUrl.pathname.startsWith('/api') &&
    !request.nextUrl.pathname.startsWith('/_next')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from home page
  if (user && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/app'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth page
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/app'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 