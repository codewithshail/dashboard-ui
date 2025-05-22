"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toolCategories } from '@/lib/constants';
import { ToolTracker } from '@/components/dashboard/tool-tracker';
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";

// Combine all tools from all categories
const allTools = toolCategories.flatMap(category =>
  category.tools.map(tool => ({
    ...tool,
    category: category.title
  }))
);

// Define app categories for the filter tabs
const appCategories = [
  "For you",
  "AI generation",
  "Audio and voiceover",
  "Communication",
  "File and data management",
  "Graphic design",
  "Marketing"
];

// Tool card colors for different categories
const toolColors = {
  "designer": "#e3f2fd",
  "productivity": "#e8f5e9",
  "marketing": "#fff3e0",
  "writing": "#f3e5f5",
  "healthcare": "#e8eaf6",
  "education": "#e0f7fa",
  "default": "#f5f5f5"
};

const AppsPage = () => {
  const { isSignedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('For you');
  const [filteredTools, setFilteredTools] = useState([]);
  const [recommendedTools, setRecommendedTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch recommended tools on component mount
  useEffect(() => {
    async function fetchRecommendedTools() {
      if (!isSignedIn) {
        setIsLoading(false);
        setFilteredTools(allTools);
        return;
      }

      try {
        const response = await fetch("/api/recommended-tools", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommended tools");
        }

        const data = await response.json();

        // Find detailed tool objects for each recommended tool ID
        const toolIds = data.toolIds || [];
        const detailedRecommendedTools = toolIds.map(toolId => {
          for (const category of toolCategories) {
            const foundTool = category.tools.find(tool => tool.id === toolId);
            if (foundTool) {
              return {
                ...foundTool,
                category: category.title
              };
            }
          }
          return null;
        }).filter(Boolean);

        setRecommendedTools(detailedRecommendedTools);

        // If "For you" is active, show recommended tools by default
        if (activeCategory === "For you") {
          setFilteredTools(detailedRecommendedTools);
        } else {
          // Otherwise apply normal category filtering
          const filtered = allTools.filter(tool =>
            tool.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
            tool.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase()))
          );
          setFilteredTools(filtered);
        }
      } catch (error) {
        console.error("Error fetching recommended tools:", error);
        setFilteredTools(allTools);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendedTools();
  }, [isSignedIn]);

  // Function to handle tool click and tracking
  const handleToolClick = (toolId, href) => {
    // First track the tool usage
    fetch("/api/recent-tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId }),
    }).catch(error => console.error("Error tracking tool usage:", error));

    // Then navigate to the tool page
    router.push(href);
  };

  // Get background color based on tool tags
  const getToolColor = (tags) => {
    if (!tags || tags.length === 0) return toolColors.default;
    for (const tag of tags) {
      if (toolColors[tag]) return toolColors[tag];
    }
    return toolColors.default;
  };

  // Modified filter tools based on search term and active category
  useEffect(() => {
    // If "For you" is active, ONLY show recommended tools, never fallback to all tools
    let result = activeCategory === "For you" ? [...recommendedTools] : allTools;

    // Apply search filter if search term exists
    if (searchTerm) {
      result = result.filter(
        tool =>
          tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter (but not for "For you" since we're already filtering for recommendations)
    if (activeCategory !== "For you") {
      result = result.filter(tool =>
        tool.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }

    setFilteredTools(result);
  }, [searchTerm, activeCategory, recommendedTools]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Trending apps</h1>
        <p className="text-muted-foreground">
          {activeCategory === "For you"
            ? "Personalized recommendations based on your preferences"
            : "The latest and greatest apps we think you'll love"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading tools...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="mb-8 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search apps"
                className="pl-10 bg-background border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {appCategories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className="whitespace-nowrap"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Apps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTools.map((tool) => {
              // Fix logo URL (handle the typo in constants.ts)
              const logoUrl = tool.logo && tool.logo.includes(',')
                ? tool.logo.replace(',', '.')
                : (tool.logo || '/placeholder-icon.png');

              // Get tool color based on tags
              const backgroundColor = getToolColor(tool.tags);

              // Check if it's an AI tool
              const isAiTool = tool.title.toLowerCase().includes('ai') ||
                tool.tags.some(tag => tag.toLowerCase().includes('ai'));

              return (
                <a
                  key={tool.id}
                  href={tool.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleToolClick(tool.id, tool.href);
                  }}
                  className="block group"
                >
                  <div className="rounded-lg overflow-hidden h-full hover:shadow-md transition-all">
                    <div className="p-4 flex flex-col h-full">
                      <div className="mb-4 h-14 w-14 rounded-lg overflow-hidden flex items-center justify-center relative"
                        style={{ backgroundColor }}>
                        <Image
                          src={logoUrl.startsWith('http') ? logoUrl : '/placeholder-icon.png'}
                          alt={tool.title}
                          width={44}
                          height={44}
                          className="object-contain"
                          unoptimized={true}
                        />
                        {isAiTool && (
                          <div className="absolute bottom-0 right-0 bg-white text-xs font-semibold p-0.5 px-1 rounded-tl-md">
                            AI
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-medium mb-1">{tool.title}</h3>
                      <p className="text-muted-foreground text-sm">{tool.description}</p>


                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground">
                {activeCategory === "For you"
                  ? "No recommended tools found"
                  : "No matching tools found"}
              </h3>
              <p className="text-muted-foreground">
                {activeCategory === "For you"
                  ? "Update your preferences to see personalized recommendations"
                  : "Try changing your search or filter settings"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppsPage;