'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export type Category = {
  id: string;
  name: string;
  icon?: string | null;
  description?: string | null;
  tools?: {
    id: string;
    name: string;
    href: string;
  }[];
};

type ContextualSidebarProps = {
  type: 'dashboard' | 'apps' | 'bookmarks'
  categories?: Category[]
  recentTools?: {
    id: string
    name: string
    href: string
  }[]
  recommendedTools?: {
    id: string
    name: string
    href: string
  }[]
}

export function ContextualSidebar({ 
  type, 
  categories = [], 
  recentTools = [],
  recommendedTools = []
}: ContextualSidebarProps) {
  const pathname = usePathname()
  
  if (type === 'dashboard') {
    return (
      <div className="h-screen w-64 border-r bg-background p-4">
        <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Recently Used</h3>
              <Link href="/apps" className="text-xs text-blue-600 hover:underline">
                See all
              </Link>
            </div>
            <ScrollArea className="h-48">
              {recentTools.length > 0 ? (
                <div className="space-y-1">
                  {recentTools.map(tool => (
                    <Link key={tool.id} href={tool.href}>
                      <Button variant="ghost" className="w-full justify-start text-sm h-8">
                        {tool.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-2">
                  No recently used tools
                </div>
              )}
            </ScrollArea>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Recommended</h3>
              <Link href="/apps" className="text-xs text-blue-600 hover:underline">
                See all
              </Link>
            </div>
            <ScrollArea className="h-48">
              {recommendedTools.length > 0 ? (
                <div className="space-y-1">
                  {recommendedTools.map(tool => (
                    <Link key={tool.id} href={tool.href}>
                      <Button variant="ghost" className="w-full justify-start text-sm h-8">
                        {tool.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-2">
                  No recommendations available
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    )
  }
  
  // For apps and bookmarks
  return (
    <div className="h-screen w-64 border-r bg-background p-4">
      <h2 className="text-lg font-semibold mb-4">
        {type === 'apps' ? 'Categories' : 'Bookmarked Categories'}
      </h2>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-1">
          {categories.map(category => (
            <CategoryItem 
              key={category.id} 
              category={category} 
              pathname={pathname}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function CategoryItem({ category, pathname }: { category: Category, pathname: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasTools = category.tools && category.tools.length > 0
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between text-sm h-9"
        >
          <span>{category.name}</span>
          {hasTools && (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      {hasTools && (
        <CollapsibleContent>
          <div className="pl-4 space-y-1 mt-1">
            {category.tools?.map(tool => {
              const isActive = pathname === tool.href
              
              return (
                <Link key={tool.id} href={tool.href}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm h-8 ${isActive ? 'bg-muted' : ''}`}
                  >
                    {tool.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}