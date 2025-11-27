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
import {
  Activity,
  Globe,
  LogOut,
  Menu,
  Phone,
  Settings,
  User,
  type LucideIcon
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// ===== Types & Interfaces =====

export type Language = "en" | "sw" | "kln";

interface NavItem {
  label: string;
  icon: LucideIcon;
  to?: string;
  action?: () => void;
  variant?: "default" | "danger";
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface UserProfile {
  name: string;
  initials: string;
  email?: string;
  avatarUrl?: string;
}

interface OnboardingNavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  user?: UserProfile;
  onLogout?: () => void;
  // Optional: Allow overriding the default menu config
  menuConfig?: NavSection[];
}

// ===== Constants =====

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
];

const DEFAULT_MENU: NavSection[] = [
  {
    title: "Account",
    items: [
      { label: "Profile", icon: User, to: "/profile" },
      { label: "Track activity", icon: Activity, to: "/activity-tracker" },
      { label: "App Settings", icon: Settings, to: "/settings" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Contact Coach", icon: Phone, to: "/contact" },
    ],
  },
];

// ===== Sub-Components =====

const MenuLink = ({
  item,
  onClick,
}: {
  item: NavItem;
  onClick?: () => void;
}) => {
  const isDanger = item.variant === "danger";

  const content = (
    <Button
      variant="ghost"
      onClick={() => {
        if (item.action) item.action();
        if (onClick) onClick();
      }}
      className={`w-full justify-start gap-3 h-12 text-base font-normal ${
        isDanger ? "text-red-500 hover:text-red-600 hover:bg-red-50" : ""
      }`}
    >
      <item.icon
        className={`h-5 w-5 ${
          isDanger ? "text-red-500" : "text-muted-foreground"
        }`}
      />
      {item.label}
    </Button>
  );

  if (item.to) {
    return (
      <Link to={item.to} className="w-full" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return content;
};

// ===== Main Component =====

export function OnboardingNavbar({
  currentLang,
  onLanguageChange,
  user = { name: "Guest", initials: "G" },
  onLogout,
  menuConfig = DEFAULT_MENU,
}: OnboardingNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Branding */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">N</span>
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block">
            Nutrix
          </span>
        </Link>

        {/* Actions Area */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
              >
                <Globe className="h-4 w-4" />
                <span className="sr-only">Switch Language</span>
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

          {/* Mobile Menu (Dialog) */}
          <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[380px]   mx-auto z-55 flex flex-col gap-0 p-0">
              {/* Header / User Info */}
              <DialogHeader className="p-6 border-b text-left bg-muted/10">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-base">{user.name}</DialogTitle>
                    <DialogDescription className="text-xs">
                      Nutrix Member
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Dynamic Menu Items */}
              <div className="flex-1 overflow-y-auto py-4 max-h-[60vh]">
                {menuConfig.map((section, idx) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    {section.title && (
                      <div className="px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {section.title}
                      </div>
                    )}
                    <div className="px-2">
                      {section.items.map((item, itemIdx) => (
                        <MenuLink
                          key={itemIdx}
                          item={item}
                          onClick={() => setIsOpen(false)}
                        />
                      ))}
                    </div>
                    {idx < menuConfig.length - 1 && (
                      <Separator className="mt-4 mx-6 opacity-50" />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer / Logout */}
              <DialogFooter className="p-6 border-t bg-muted/20 sm:justify-start mt-auto flex-col sm:flex-col gap-4">
                <div className="w-full space-y-4">
                  {onLogout && (
                    <MenuLink
                      item={{
                        label: "Log out",
                        icon: LogOut,
                        action: onLogout,
                      }}
                    />
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-4">
                    <span>v1.0.2 Beta</span>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}