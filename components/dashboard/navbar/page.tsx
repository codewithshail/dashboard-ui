"use client";

import { Menu, X, Sparkles, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface ResponsiveNavbarProps {
  isPrimarySidebarCollapsed: boolean;
  isContextualSidebarVisible: boolean;
  onTogglePrimarySidebar: () => void;
  onToggleContextualSidebar: () => void;
  userCoins?: number;
  className?: string;
}

export function ResponsiveNavbar({
  isPrimarySidebarCollapsed,
  isContextualSidebarVisible,
  onTogglePrimarySidebar,
  onToggleContextualSidebar,
  userCoins,
  className
}: ResponsiveNavbarProps) {
  const { isSignedIn } = useAuth();

  return (
    <nav className={cn(
      "flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 lg:hidden",
      className
    )}>
      {/* Left Side - Menu Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePrimarySidebar}
          className="h-8 w-8"
          aria-label={isPrimarySidebarCollapsed ? "Open main menu" : "Close main menu"}
        >
          {isPrimarySidebarCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleContextualSidebar}
          className="h-8 w-8"
          aria-label={isContextualSidebarVisible ? "Close sidebar" : "Open sidebar"}
        >
          {isContextualSidebarVisible ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4 rotate-180" />
          )}
        </Button>
      </div>

      {/* Right Side - User Controls */}
      <div className="flex items-center space-x-3">
        {/* Coins Display */}
        {isSignedIn && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-muted/50 rounded-full">
            <Coins className="h-3 w-3 text-yellow-600" />
            <span className="text-xs font-medium">{userCoins || 0}</span>
          </div>
        )}

        {/* Upgrade Button */}
        {isSignedIn && (
          <Button
            size="sm"
            className="h-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg"
            asChild
          >
            <a href="/billing" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span className="text-xs font-medium">Upgrade</span>
            </a>
          </Button>
        )}

        {/* User Button */}
        {isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "translate-x-2",
                userButtonPopoverActionButton: "text-sm",
                userButtonPopoverActionButtonText: "text-sm",
              },
            }}
          />
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            asChild
          >
            <a href="/login">Login</a>
          </Button>
        )}
      </div>
    </nav>
  );
}