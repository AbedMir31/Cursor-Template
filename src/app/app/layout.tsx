'use client'

import AppSidebar from '@/components/layout/AppSidebar'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      // Redirect to auth page if no user found
      if (!user) {
        router.push('/auth')
      }
    }
    
    getUser()
  }, [router, supabase.auth])

  // Show loading state or render content if user exists
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return null // Router will handle redirection
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
} 