'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import config from '@/lib/config'
import { toast } from 'react-hot-toast'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Check if the URL contains a 'success' parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('success') === 'true') {
      toast.success('Successfully signed in!')
      // Clear the parameter from the URL
      const newUrl = `${window.location.pathname}${window.location.hash}`
      window.history.replaceState({}, document.title, newUrl)
      
      // Redirect to dashboard if not already there
      if (window.location.pathname !== '/app') {
        router.push('/app')
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        // Show confirmation message
        alert('Check your email for the confirmation link')
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success('Successfully signed in!')
        router.push('/app')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: config.supabase.redirectUrl,
          queryParams: {
            // Add a parameter to indicate we want to redirect to the app page
            // This will be appended to the callback URL
            redirect_to: `${window.location.origin}/app`
          }
        },
      })
      
      if (error) throw error
      // The redirect happens automatically, no need to navigate manually
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error signing in with Google')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? 'Create an Account' : 'Sign In'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Google Sign-in Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign {isSignUp ? 'up' : 'in'} with Google</span>
          </>
        )}
      </button>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  )
} 