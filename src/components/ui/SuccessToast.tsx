'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function SuccessToast() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Successfully signed in!')
      
      // Use custom event to prevent multiple toasts on navigation
      if (typeof window !== 'undefined') {
        const toastShown = sessionStorage.getItem('toastShown')
        if (!toastShown) {
          sessionStorage.setItem('toastShown', 'true')
          
          // Clear after 5 seconds to prevent multiple toasts in the same session
          setTimeout(() => {
            sessionStorage.removeItem('toastShown')
          }, 5000)
        }
      }
    }
  }, [searchParams])
  
  // This component doesn't render anything, it just shows the toast
  return null
} 