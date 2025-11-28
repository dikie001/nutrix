/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BookOpen,
  Check,
  CreditCard,
  Loader2,
  Lock,
  RefreshCcw,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- Types ---
interface Magazine {
  id: string;
  title: string;
  category: string;
  date: string;
  coverColor: string;
  locked: boolean;
}

// --- Mock Data ---
const MAGAZINES: Magazine[] = [
  {
    id: "1",
    title: "High Altitude Training",
    category: "Training",
    date: "Nov 2025",
    coverColor: "bg-orange-500",
    locked: false,
  },
  {
    id: "2",
    title: "Kenyan Diet Secrets",
    category: "Nutrition",
    date: "Oct 2025",
    coverColor: "bg-green-600",
    locked: false,
  },
  {
    id: "3",
    title: "Marathon Recovery",
    category: "Recovery",
    date: "Sep 2025",
    coverColor: "bg-blue-600",
    locked: false,
  },
  {
    id: "4",
    title: "The Eliud Mindset",
    category: "Mental",
    date: "Aug 2025",
    coverColor: "bg-purple-600",
    locked: false,
  },
  {
    id: "5",
    title: "Track vs Road",
    category: "Gear",
    date: "Jul 2025",
    coverColor: "bg-red-500",
    locked: false,
  },
  {
    id: "6",
    title: "Core for Runners",
    category: "Strength",
    date: "Jun 2025",
    coverColor: "bg-slate-700",
    locked: false,
  },
];

// --- Constants ---
const STORAGE_KEY_EMAIL = "magazine_user_email";
const STORAGE_KEY_PAID = "magazine_user_paid";

// --- Components (Shadcn-style) ---

const Button = ({
  className = "",
  variant = "default",
  size = "default",
  isLoading = false,
  children,
  ...props
}: any) => {
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants: any = {
    default: "bg-black text-white hover:bg-black/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };

  const sizes: any = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: any) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Card = ({ className = "", children }: any) => (
  <div
    className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}
  >
    {children}
  </div>
);

// --- Main Application ---

export default function Magazine() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);

  // Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form States
  const [inputEmail, setInputEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkUserStatus = () => {
    setLoading(true);
    const storedEmail = localStorage.getItem(STORAGE_KEY_EMAIL);
    const storedPaid = localStorage.getItem(STORAGE_KEY_PAID);

    if (!storedEmail) {
      // User not registered
      setEmail(null);
      setHasPaid(false);
      setShowAuthModal(true);
      setShowPaymentModal(false);
    } else {
      // User registered
      setEmail(storedEmail);
      if (storedPaid === "true") {
        // User paid
        setHasPaid(true);
        setShowPaymentModal(false);
        setShowAuthModal(false);
      } else {
        // User registered but NOT paid
        setHasPaid(false);
        setShowPaymentModal(true);
        setShowAuthModal(false);
      }
    }
    setLoading(false);
  };
  // 1. Initial Check Logic
  useEffect(() => {
    checkUserStatus();
  }, []);

  // 2. Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_EMAIL, inputEmail);
      setEmail(inputEmail);
      setShowAuthModal(false);
      setShowPaymentModal(true); // Move directly to payment
      setIsSubmitting(false);
    }, 1000);
  };

  // 3. Handle Payment
  const handlePayment = async () => {
    setIsSubmitting(true);

    // Simulate Payment Gateway
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_PAID, "true");
      setHasPaid(true);
      setShowPaymentModal(false);
      setIsSubmitting(false);
    }, 1500);
  };

  // Debug: Reset function
  const resetApp = () => {
    localStorage.removeItem(STORAGE_KEY_EMAIL);
    localStorage.removeItem(STORAGE_KEY_PAID);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-slate-900">
      {/* --- Navigation --- */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-orange-600" />
          <h1 className="text-xl font-bold tracking-tight">Runner's Digest</h1>
        </div>
        <div className="flex items-center gap-4">
          {email && (
            <span className="hidden text-sm font-medium text-slate-500 md:inline-block">
              {email}
            </span>
          )}
          {/* Reset Button for Demo Purposes */}
          <Button
            variant="ghost"
            size="icon"
            onClick={resetApp}
            title="Reset Demo"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="container mx-auto max-w-6xl p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Latest Issues</h2>
          <p className="text-slate-500 mt-2">
            Expert advice on training, nutrition, and recovery from the rift
            valley.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {MAGAZINES.map((mag) => (
            <Card
              key={mag.id}
              className="group overflow-hidden border-slate-200 bg-white transition-all hover:shadow-md"
            >
              <div
                className={`aspect-[4/5] w-full ${mag.coverColor} relative p-6 flex flex-col justify-between text-white`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90 border border-white/30 px-2 py-1 rounded">
                    {mag.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-black leading-none mb-2">
                    {mag.title}
                  </h3>
                  <p className="text-sm opacity-90 font-medium">{mag.date}</p>
                </div>

                {/* Lock Overlay if not fully accessible (Visual flair, though logic handles access) */}
                {!hasPaid && (
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center">
                    <Lock className="h-12 w-12 text-white/80" />
                  </div>
                )}
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">Read time: 5 mins</div>
                <Button variant={hasPaid ? "default" : "secondary"} size="sm">
                  {hasPaid ? "Read Now" : "Subscribe"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* --- AUTH MODAL --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="flex flex-col items-center text-center space-y-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Welcome Back</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Enter your email to access your magazines.
                  </p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="runner@example.com"
                    value={inputEmail}
                    onChange={(e: any) => setInputEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Continue
                </Button>
              </form>
            </div>
            <div className="bg-slate-50 px-6 py-4 text-center">
              <p className="text-xs text-slate-500">
                By continuing, you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="flex flex-col items-center text-center space-y-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Unlock Full Access</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Get unlimited access to all coaching magazines.
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4 mb-6 bg-slate-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Annual Subscription</span>
                  <span className="font-bold">KES 500</span>
                </div>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-green-600" /> Unlimited
                    Issues
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-green-600" /> Offline
                    Reading
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-green-600" /> Expert
                    Plans
                  </li>
                </ul>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-green-600 hover:bg-green-700"
                isLoading={isSubmitting}
              >
                Pay KES 500
              </Button>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-center">
              <div className="flex gap-2 opacity-50">
                {/* Mock Payment Icons */}
                <div className="h-4 w-8 bg-slate-300 rounded"></div>
                <div className="h-4 w-8 bg-slate-300 rounded"></div>
                <div className="h-4 w-8 bg-slate-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
