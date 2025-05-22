'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useAuth } from '@clerk/nextjs'
import { Home, AppWindowIcon as Apps, Bookmark, Lightbulb, CreditCard, Settings, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function PrimarySidebar() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()
  
  const navItems = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: Home,
      protected: true
    },
    {
      name: 'Apps',
      href: '/apps',
      icon: Apps,
      protected: false
    },
    {
      name: 'Bookmarks',
      href: '/bookmarks',
      icon: Bookmark,
      protected: true
    },
    {
      name: 'Custom AI',
      href: '/custom-ai',
      icon: Lightbulb,
      protected: false
    },
    {
      name: 'Billing',
      href: '/billing',
      icon: CreditCard,
      protected: true
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      protected: true
    }
  ]

  return (
    <div className="h-screen w-16 flex flex-col items-center py-8 border-r bg-background">
      <Link href="/" className="mb-8">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          P
        </div>
      </Link>
      
      <div className="flex flex-col items-center space-y-6 flex-1">
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const isDisabled = item.protected && !isSignedIn
            
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <div>
                    {isDisabled ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-10 h-10 ${isActive ? 'bg-muted' : ''} opacity-50`}
                        disabled
                      >
                        <item.icon className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`w-10 h-10 ${isActive ? 'bg-muted' : ''}`}
                        >
                          <item.icon className="h-5 w-5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {isDisabled ? `Login to access ${item.name}` : item.name}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
      
      {!isSignedIn && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/login">
                <Button variant="ghost" size="icon" className="w-10 h-10">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              Login
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}