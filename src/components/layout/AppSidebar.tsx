'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Home, FileText, Upload, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'

export default function AppSidebar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { open } = useSidebar()

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
      }
    )
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // Get user avatar URL
  const avatarUrl = user?.user_metadata?.avatar_url || 
                    user?.identities?.[0]?.identity_data?.avatar_url ||
                    null

  // Navigation items
  const navItems = [
    {
      title: 'Dashboard',
      icon: Home,
      url: '/app',
    },
    {
      title: 'My Resumes',
      icon: FileText,
      url: '/app/resumes',
    },
    {
      title: 'Upload Resume',
      icon: Upload,
      url: '/app/upload',
    },
    {
      title: 'Settings',
      icon: Settings, 
      url: '/app/settings',
    },
  ]

  if (loading || !user) {
    return null; // Don't render sidebar for unauthenticated users
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center p-4 group-data-[collapsible=icon]:justify-center">
          {avatarUrl && (
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200 group-data-[collapsible=icon]:mr-0 mr-3 flex-shrink-0">
              <img 
                src={avatarUrl} 
                alt="User profile" 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium truncate">
              {user.email}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-2 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut} 
              className="group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="flex items-center justify-center mt-2">
          <SidebarTrigger className="w-full flex items-center justify-center py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-md transition-colors" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
} 