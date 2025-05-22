"use client";

import { useEffect } from "react";

export function ToolTracker({ toolId }: { toolId: string }) {
  useEffect(() => {
    if (!toolId) return;
    
    async function trackUsage() {
      try {
        await fetch("/api/recent-tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId }),
        });
      } catch (error) {
        console.error("Failed to track tool usage:", error);
      }
    }
    
    trackUsage();
  }, [toolId]);

  return null; 
}