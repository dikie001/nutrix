import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { USER_REGISTERED } from "@/lib/constants";
import { useTheme } from "@/lib/theme-provider";
import {
  Activity,
  ChevronLeft,
  Globe,
  LogOut,
  Menu,
  Moon,
  Palette,
  Sun,
  User,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// --- Types ---
export type Language = "en" | "sw" | "kln";

interface NavItem {
  label: string;
  icon: LucideIcon;
  to?: string;
  action?: () => void;
  variant?: "default" | "danger" | "premium";
}

interface UserProfile {
  name: string;
  initials: string;
  avatarUrl?: string;
}

interface Props {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  user?: UserProfile;
  onLogout?: () => void;
}

// --- Constants ---
const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
];

const MENU_ITEMS: { title: string; items: NavItem[] }[] = [
  {
    title: "Account",
    items: [
      { label: "Profile", icon: User, to: "/profile" },
      { label: "Todays meal", icon: Palette, to: "/meals" },
      { label: "Logout", icon: LogOut, to: "/login" },
    ],
  },
  {
    title: "Premium",
    items: [
      { 
        label: "Track activity", 
        icon: Activity, 
        to: "/activity-tracker", 
        variant: "premium" 
      },    { 
        label: "Magazines", 
        icon: Activity, 
        to: "/magazines", 
        variant: "premium" 
      },
    ],
  },
];

// --- Sub-Component: Menu Item ---
const MenuItem = ({
  item,
  onClick,
}: {
  item: NavItem;
  onClick: () => void;
}) => {
  const isDanger = item.variant === "danger";
  const isPremium = item.variant === "premium";
  const Wrapper = item.to ? Link : "div";

  return (
    <Wrapper to={item.to || "#"} className="w-full block" onClick={onClick}>
      <Button
        variant="ghost"
        onClick={item.action}
        className={`w-full justify-start gap-3 h-12 text-base font-normal transition-all duration-300 border
          ${
            isDanger 
              ? "text-destructive hover:text-destructive hover:bg-destructive/10 border-transparent" 
              : "border-transparent"
          }
          ${
            isPremium
              ? "bg-linear-to-r mb-4 from-amber-500 via-yellow-400 to-amber-500 text-amber-950 font-bold shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] border-yellow-400/50 bg-size-[200%_auto] hover:bg-right transition-[background-position,transform,shadow]"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }
        `}
      >
        <item.icon
          className={`h-5 w-5 
            ${isDanger ? "text-destructive" : ""}
            ${isPremium ? "text-amber-900 fill-amber-100" : "text-muted-foreground"}
          `}
        />
        {item.label}
      </Button>
    </Wrapper>
  );
};

// --- Main Component ---
export function OnboardingNavbar({
  currentLang,
  onLanguageChange,
  user = { name: "Guest", initials: "G" },
  onLogout,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();

  // Define dashboard paths where back button should be hidden
  const isDashboard =
    location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <nav className="sticky top-0 z-50 w-full  border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center  justify-between mx-auto">
        {/* Left Section: Back Button & Logo */}
        <div className="flex items-center gap-1">
          {/* Back Button - Conditional Rendering */}
          {!isDashboard && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="-ml-3 mr-1 h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 hover:opacity-90"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">
              Nutrix
            </span>
          </Link>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
              >
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={
                    currentLang === lang.code ? "bg-accent font-medium" : ""
                  }
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Dialog */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[380px] p-0 gap-0 flex flex-col  h-auto">
              {/* Menu Header */}
              <DialogHeader className="p-6 border-b bg-muted/10 text-left flex flex-row items-center gap-4 space-y-0">
                <Avatar>
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-base">{user.name}</DialogTitle>
                  <DialogDescription>Nutrix Member</DialogDescription>
                </div>
              </DialogHeader>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-4">
                {MENU_ITEMS.map((section, idx) => (
                  <div key={idx} className="mb-2">
                    {section.title && (
                      <div className="px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {section.title}
                      </div>
                    )}
                    <div className="px-2">
                      {section.items.map((item, i) => (
                        <MenuItem
                          key={i}
                          item={item}
                          onClick={() => setIsOpen(false)}
                        />
                      ))}
                    </div>
                    {idx < MENU_ITEMS.length - 1 && (
                      <Separator className="my-2 mx-6" />
                    )}
                  </div>
                ))}
              </div>

              {/* Menu Footer */}
              <DialogFooter className="p-4 border-t bg-muted/20">
                {onLogout && (
                  <MenuItem
                    item={{ label: "Log out", icon: LogOut, action: onLogout }}
                    onClick={() => {
                      setIsOpen(false);
                      localStorage.removeItem(USER_REGISTERED);
                    }}
                  />
                )}
                <div className="text-center text-xs text-muted-foreground mt-2 w-full">
                  v1.0.2 Beta
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}