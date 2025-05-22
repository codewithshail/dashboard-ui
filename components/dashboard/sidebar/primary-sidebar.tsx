"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  Home,
  AppWindowIcon as Apps,
  Bookmark,
  Lightbulb,
  CreditCard,
  Settings,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { memo, useMemo } from "react";
import Image from "next/image";

const NavItem = memo(
  ({
    item,
    isActive,
    isDisabled,
    pathname,
  }: {
    item: NavItemType;
    isActive: boolean;
    isDisabled: boolean;
    pathname: string;
  }) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            {isDisabled ? (
              <Button
                variant="ghost"
                size="icon"
                className={`w-10 h-10 ${isActive ? "bg-muted" : ""} opacity-50`}
                disabled
                aria-label={`${item.name} (Login required)`}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            ) : (
              <Link href={item.href} prefetch={false}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-10 h-10 transition-colors duration-150 ${
                    isActive ? "bg-muted" : ""
                  }`}
                  aria-label={item.name}
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
    );
  }
);

NavItem.displayName = "NavItem";

const AuthButton = memo(
  ({ isSignedIn }: { isSignedIn: boolean | undefined }) => {
    if (isSignedIn) {
      return (
        <div className="flex items-center justify-center w-10 h-10">
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
        </div>
      );
    }

    return (
      <Link href="/login" prefetch={false}>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 transition-colors duration-150 hover:bg-muted"
          aria-label="Login"
        >
          <LogIn className="h-5 w-5" />
        </Button>
      </Link>
    );
  }
);

AuthButton.displayName = "AuthButton";

const NAV_ITEMS = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
    protected: true,
  },
  {
    name: "Apps",
    href: "/apps",
    icon: Apps,
    protected: false,
  },
  {
    name: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
    protected: true,
  },
  {
    name: "Custom AI",
    href: "/custom-ai",
    icon: Lightbulb,
    protected: false,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
    protected: true,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    protected: true,
  },
] as const;

type NavItemType = (typeof NAV_ITEMS)[number];

export const PrimarySidebar = memo(() => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const navItemsWithState = useMemo(() => {
    return NAV_ITEMS.map((item) => {
      const isActive =
        pathname === item.href || pathname.startsWith(`${item.href}/`);
      const isDisabled = item.protected && !isSignedIn;

      return {
        ...item,
        isActive,
        isDisabled,
      };
    });
  }, [pathname, isSignedIn]);

  return (
    <aside
      className="h-screen w-16 flex flex-col items-center py-8 border-r bg-background will-change-transform"
      role="navigation"
      aria-label="Primary navigation"
    >
      <Link href="/" className="mb-8" prefetch={false}>
        <Image
          src="/logo.png"
          width={30}
          height={30}
          alt="Promptly AI"
          className="animate-pulse"
        />
      </Link>

      <nav className="flex flex-col items-center space-y-6 flex-1">
        <TooltipProvider delayDuration={300}>
          {navItemsWithState.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={item.isActive}
              isDisabled={item.isDisabled}
              pathname={pathname}
            />
          ))}
        </TooltipProvider>
      </nav>

      <div className="mt-auto">
        <AuthButton isSignedIn={isSignedIn} />
      </div>
    </aside>
  );
});

PrimarySidebar.displayName = "PrimarySidebar";
