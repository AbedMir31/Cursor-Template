'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        // Redirect to dashboard on sign-in
        if (event === 'SIGNED_IN') {
          router.push('/app')
        }
      }
    )
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth, router])
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Get user avatar URL
  const avatarUrl = user?.user_metadata?.avatar_url || 
                    user?.identities?.[0]?.identity_data?.avatar_url ||
                    null
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-2xl font-bold text-blue-600">
              <span className="mr-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              TailorMade
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Pricing
            </Link>
            <Link href="/resources" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Resources
            </Link>
            
            {!loading && (
              user ? (
                <div className="relative ml-3">
                  <div className="flex items-center space-x-3">
                    <Link 
                      href="/app" 
                      className="inline-flex items-center text-blue-600 border border-blue-500 font-medium rounded-md text-sm px-4 py-2 hover:bg-blue-50"
                    >
                      Dashboard
                    </Link>
                    
                    <div className="flex items-center space-x-3">
                      {avatarUrl && (
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                          <Image 
                            src={avatarUrl} 
                            alt="User profile" 
                            width={32} 
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/auth" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/auth" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
                  >
                    Get started
                  </Link>
                </div>
              )
            )}
          </div>
          
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Pricing
            </Link>
            <Link 
              href="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Resources
            </Link>
            
            {!loading && (
              user ? (
                <>
                  <div className="flex items-center px-3 py-2">
                    {avatarUrl && (
                      <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 mr-3">
                        <Image 
                          src={avatarUrl} 
                          alt="User profile" 
                          width={32} 
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {user.email}
                    </span>
                  </div>
                  <Link 
                    href="/app" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/auth" 
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Get started
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  )
} 