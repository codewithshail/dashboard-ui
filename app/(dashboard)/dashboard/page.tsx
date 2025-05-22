"use client"

import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toolCategories } from "@/lib/constants"
export default function DashboardPage() {
  const { isSignedIn } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTool, setSelectedTool] = useState<any>(null)
  const [showAllTools, setShowAllTools] = useState(false)


  const newTools = toolCategories.flatMap((category) => category.tools.filter((tool) => tool.isNew))


  const allTools = toolCategories.flatMap((category) => category.tools)


  const recentlyUsedTools = allTools.slice(0, 3)


  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile logo placeholder */}
            <div className="h-8 w-8 rounded-md bg-primary/20"></div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex md:flex-1 md:justify-center md:px-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tools..."
                className="w-full bg-background pl-8 md:w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Upgrade button */}
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              className="h-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span>Upgrade to Promptly</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:py-8">
        {/* Mobile search (visible on small screens) */}
        <div className="mb-6 md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* What's New Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">What's New</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newTools.map((tool) => (
              <Card
                key={tool.id}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleToolSelect(tool)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={tool.logo || "/placeholder.svg?height=48&width=48"}
                        alt={tool.title}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium truncate">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{tool.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                  <span className="text-xs text-muted-foreground">{tool.coins}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Recently Used Tools Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Recently Used Tools</h2>

          {recentlyUsedTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentlyUsedTools.map((tool) => (
                <Card
                  key={tool.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleToolSelect(tool)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={tool.logo || "/placeholder.svg?height=48&width=48"}
                          alt={tool.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium truncate">{tool.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{tool.subtitle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No recently used tools</h3>
              <p className="text-muted-foreground mb-4">Start exploring our tools to see your history here</p>
              <Button asChild>
                <Link href="/apps">Browse Tools</Link>
              </Button>
            </div>
          )}
        </section>      
      </main>

      {/* Tool Detail Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={(open) => !open && setSelectedTool(null)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md overflow-hidden">
                <Image
                  src={selectedTool?.logo || "/placeholder.svg?height=32&width=32"}
                  alt={selectedTool?.title || "Tool"}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              {selectedTool?.title}
            </DialogTitle>
            <DialogDescription>{selectedTool?.subtitle}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Screenshots */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Screenshots</h3>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {selectedTool?.screenshot && selectedTool.screenshot.length > 0 ? (
                  <Image
                    src={selectedTool.screenshot[0] || "/placeholder.svg?height=270&width=480"}
                    alt={`${selectedTool?.title} screenshot`}
                    width={480}
                    height={270}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    No screenshots available
                  </div>
                )}
              </div>

              {/* Thumbnail gallery */}
              {selectedTool?.screenshot && selectedTool.screenshot.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedTool.screenshot.map((src: string, index: number) => (
                    <div key={index} className="h-16 w-24 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={src || "/placeholder.svg?height=64&width=96"}
                        alt={`${selectedTool?.title} screenshot ${index + 1}`}
                        width={96}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedTool?.description}</p>
              </div>

              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Information</TabsTrigger>
                  <TabsTrigger value="additional">Additional Info</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="ml-2 font-medium">
                        {toolCategories.find((cat) => cat.tools.some((t) => t.id === selectedTool?.id))?.title ||
                          "General"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTool?.tags?.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="additional" className="space-y-4 pt-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Required Coins</h4>
                        <p className="text-2xl font-bold">{selectedTool?.coins}</p>
                      </div>
                      <Button>Use Tool</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button asChild>
              <Link href={selectedTool?.href || "#"}>Open Tool</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
