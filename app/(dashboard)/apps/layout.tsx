"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { ContextualSidebar } from "@/components/dashboard/sidebar/contextual-sidebar"

export default function AppsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { isSignedIn } = useAuth()
	const [recentTools, setRecentTools] = useState([])
	const [recommendedTools, setRecommendedTools] = useState([])
	
	// Fetch both recent tools and recommendations from API endpoints
	useEffect(() => {
		async function fetchUserData() {
			if (!isSignedIn) return
			
			try {
				// Fetch recent tools
				const recentResponse = await fetch("/api/recent-tools", {
					credentials: "include",
				})
				
				if (!recentResponse.ok) throw new Error("Failed to fetch recent tools")
				
				const recentData = await recentResponse.json()
				// Recent tools already have the correct format from API
				const formattedRecentTools = recentData.recentTools.map(item => {
					return {
						id: item.toolId,
						name: item.tool?.title || item.toolId,
						href: item.tool?.href || `/tools/${item.toolId}`
					}
				}).filter(Boolean)
				
				setRecentTools(formattedRecentTools)
				
				// Fetch recommended tools from our new API endpoint
				const recommendedResponse = await fetch("/api/recommended-tools", {
					credentials: "include",
				})
				
				if (!recommendedResponse.ok) throw new Error("Failed to fetch recommendations")
				
				const recommendedData = await recommendedResponse.json()
				setRecommendedTools(recommendedData.recommendedTools || [])
			} catch (error) {
				console.error("Error fetching user data:", error)
			}
		}
		
		fetchUserData()
	}, [isSignedIn])
	
	return (
		
		<div className="flex">
			<ContextualSidebar 
				type="dashboard" 
				recentTools={recentTools}
				recommendedTools={recommendedTools}
			/>
			<main className="flex-1">
				{children}
			</main>
		</div>
	)
}