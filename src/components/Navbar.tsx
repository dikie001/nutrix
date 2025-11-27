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
import {
  Activity,
  ChevronLeft,
  Globe,
  LogOut,
  Menu,
  Palette,
  Phone,
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
  variant?: "default" | "danger";
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
      { label: "Track activity", icon: Activity, to: "/activity-tracker" },
      { label: "Todays meal", icon: Palette, to: "/meals" },
      { label: "Logout", icon: LogOut, to: "/login" },
    ],
  },
  {
    title: "Support",
    items: [{ label: "Contact Coach", icon: Phone, to: "/contact" }],
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
  const Wrapper = item.to ? Link : "div";

  return (
    <Wrapper to={item.to || "#"} className="w-full block" onClick={onClick}>
      <Button
        variant="ghost"
        onClick={item.action}
        className={`w-full justify-start gap-3 h-12 text-base font-normal ${
          isDanger
            ? "text-destructive hover:text-destructive hover:bg-destructive/10"
            : ""
        }`}
      >
        <item.icon
          className={`h-5 w-5 ${
            isDanger ? "text-destructive" : "text-muted-foreground"
          }`}
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

  // Define dashboard paths where back button should be hidden
  const isDashboard = location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 max-w-7xl mx-auto">
        
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
          <Link to="/" className="flex items-center gap-2 hover:opacity-90">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">
              Nutrix
            </span>
          </Link>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2">
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

            <DialogContent className="w-[380px] p-0 gap-0 flex flex-col h-[80vh] sm:h-auto">
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