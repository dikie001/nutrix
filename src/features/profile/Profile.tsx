/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { OnboardingNavbar } from "../../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  Ruler,
  Weight,
  Dumbbell,
  CalendarDays,
  Edit2,
  Save,
  X,
  Activity,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { USER_DATA } from "@/lib/constants";

const STORAGE_KEY = "user_profile_data";

const EMPTY_PROFILE = {
  sport: "",
  name: "",
  location: { address: "", latitude: 0, longitude: 0 },
  age: "",
  weight: "",
  gender: "",
  height: "",
  trainingDays: "",
  intensity: "",
  goal: "",
};

// Simplified Field: Always renders children (inputs), relies on 'disabled' prop in parent
const Field = ({ label, icon: Icon, children }: any) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2 text-xs uppercase text-muted-foreground tracking-wider">
      {Icon && <Icon className="w-3.5 h-3.5" />} {label}
    </Label>
    {children}
  </div>
);

export default function ProfilePage() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(USER_DATA);
    if (stored) {
      setProfile(JSON.parse(stored));
    }
    setMounted(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem(USER_DATA, JSON.stringify(profile));
    setIsEditing(false);
    toast.success("Profile saved");
  };

  const updateField = (field: string, value: any) =>
    setProfile((p) => ({ ...p, [field]: value }));
  const updateLocation = (address: string) =>
    setProfile((p) => ({ ...p, location: { ...p.location, address } }));

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background font-sans pb-20 overflow-y-auto mt-4">
      <OnboardingNavbar currentLang="en" onLanguageChange={() => {}} />

      <div className="max-w-md mx-auto  pt-6 space-y-6 ">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/50 text-primary-foreground text-3xl font-bold flex items-center justify-center">
                {profile?.name ? (
                  profile.name
                    .split(" ")
                    .map((n) => n[0]?.toUpperCase())
                    .join("")
                ) : (
                  <User className="w-8 h-8 opacity-80" />
                )}
              </AvatarFallback>
            </Avatar>
            {profile.sport && (
              <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 uppercase text-[10px] shadow-sm">
                {profile.sport}
              </Badge>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">
              {profile.name || "Unknown User"}
            </h1>
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1 min-h-[20px]">
              {profile.location.address ? (
                <>
                  <MapPin className="w-3 h-3" />{" "}
                  {profile.location.address.split(",")[0]}
                </>
              ) : (
                "Location not set"
              )}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end sticky top-2 z-10">
          {isEditing ? (
            <div className="flex gap-2 shadow-sm bg-background/80 backdrop-blur-sm p-1 rounded-lg border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  const stored = localStorage.getItem(STORAGE_KEY);
                  if (stored) setProfile(JSON.parse(stored));
                  else setProfile(EMPTY_PROFILE);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
            </div>
          ) : (
            <div className="p-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full "
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          )}
        </div>

        {/* Main Card */}
        <Card className="shadow-sm border-none sm:border bg-card/50 sm:bg-card">
          <CardContent className="p-4 space-y-8">
            {/* Personal Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="w-4 h-4 text-primary" />{" "}
                <h3 className="font-semibold text-sm">Details</h3>
              </div>
              <Field label="Full Name">
                <Input
                  disabled={!isEditing}
                  className="w-full"
                  placeholder="Ex: John Doe"
                  value={profile.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Age">
                  <Input
                    disabled={!isEditing}
                    type="number"
                    placeholder="0"
                    className="w-full"
                    value={profile.age}
                    onChange={(e) => updateField("age", e.target.value)}
                  />
                </Field>
                <Field label="Gender">
                  <Select
                    disabled={!isEditing}
                    value={profile.gender}
                    onValueChange={(v) => updateField("gender", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Location">
                <Textarea
                  disabled={!isEditing}
                  placeholder="Enter your address..."
                  className="w-full min-h-[60px]"
                  value={profile.location.address}
                  onChange={(e) => updateLocation(e.target.value)}
                />
              </Field>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Activity className="w-4 h-4 text-primary" />{" "}
                <h3 className="font-semibold text-sm">Body Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Height" icon={Ruler}>
                  <Input
                    disabled={!isEditing}
                    type="number"
                    placeholder="0"
                    className="w-full"
                    value={profile.height}
                    onChange={(e) => updateField("height", e.target.value)}
                  />
                </Field>
                <Field label="Weight" icon={Weight}>
                  <Input
                    disabled={!isEditing}
                    type="number"
                    placeholder="0"
                    className="w-full"
                    value={profile.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                  />
                </Field>
              </div>
            </div>

            {/* Training */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Dumbbell className="w-4 h-4 text-primary" />{" "}
                <h3 className="font-semibold text-sm">Training</h3>
              </div>
              <Field label="Sport" icon={Target}>
                <Select
                  disabled={!isEditing}
                  value={profile.sport}
                  onValueChange={(v) => updateField("sport", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {["running", "cycling", "gym", "swimming", "yoga"].map(
                      (s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Freq" icon={CalendarDays}>
                  <Select
                    disabled={!isEditing}
                    value={profile.trainingDays}
                    onValueChange={(v) => updateField("trainingDays", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} Days
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Intensity">
                  <Select
                    disabled={!isEditing}
                    value={profile.intensity}
                    onValueChange={(v) => updateField("intensity", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Goal">
                <Select
                  disabled={!isEditing}
                  value={profile.goal}
                  onValueChange={(v) => updateField("goal", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                    <SelectItem value="maintain">Maintain</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
