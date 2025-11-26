import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    Globe,
    HelpCircle,
    Menu,
    Phone,
    Settings,
    User,
    type LucideIcon
} from "lucide-react";
import { useState } from 'react';
import { Link } from "react-router-dom";

// ===== MenuLink Component =====
interface MenuLinkProps {
  icon: LucideIcon;
  label: string;
  to?: string;
}

export const MenuLink = ({ icon: Icon, label, to }: MenuLinkProps) => {
  const buttonContent = (
    <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base font-normal">
      <Icon className="h-5 w-5 text-muted-foreground" />
      {label}
    </Button>
  );

  return to ? (
    <Link to={to} className="w-full">
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  );
};

// ===== OnboardingNavbar Component =====
export type Language = 'en' | 'sw' | 'kln';

interface OnboardingNavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;

}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
];

export function OnboardingNavbar({ 
  currentLang, 
  onLanguageChange, 
}: OnboardingNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky mb-4  top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        
        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">N</span>
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block">Nutrix</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          
          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Change Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={currentLang === lang.code ? "bg-accent font-medium" : ""}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>


          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen} >
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top"  className="w-[300px] lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:rounded-2xl sm:w-[350px] flex flex-col gap-0 p-0">
              
              {/* Sheet Header */}
              <SheetHeader className="p-6 border-b text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-base">D</span>
                  </div>
                  <SheetTitle className="text-xl">Dikie App</SheetTitle>
                </div>
                <SheetDescription>
                  Personalized nutrition for Kenyan champions.
                </SheetDescription>
              </SheetHeader>

              {/* Sheet Body */}
              <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </div>
                <MenuLink icon={User} label="Log In / Sign Up" to="/login" />
                <MenuLink icon={Settings} label="App Settings" />

                <Separator className="my-2 opacity-50" />

                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Support
                </div>
                <MenuLink icon={HelpCircle} label="Help Center" />
                <MenuLink icon={Phone} label="Contact Coach" />
              </div>

              {/* Sheet Footer */}
              <SheetFooter className="p-6 border-t bg-muted/20 sm:justify-start">
                <div className="w-full space-y-4">
        
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>v1.0.2 Beta</span>
                        <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground">
                            Log out
                        </Button>
                    </div>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>


    </nav>
  );
}