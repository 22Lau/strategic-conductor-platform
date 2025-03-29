
import { useState } from "react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileMenuProps {
  variant?: "desktop" | "mobile";
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ variant = "desktop" }) => {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
  };
  
  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        {variant === "desktop" ? (
          <Button variant="ghost" className="flex items-center w-full text-left">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
              <AvatarFallback>{getInitials(profile?.full_name || user?.email?.split("@")[0] || "")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col">
              <span className="text-sm font-medium">{profile?.full_name || user?.email?.split("@")[0] || "User"}</span>
              <span className="text-xs text-gray-500 truncate">{user?.email}</span>
            </div>
          </Button>
        ) : (
          <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
              <AvatarFallback>{getInitials(profile?.full_name || user?.email?.split("@")[0] || "")}</AvatarFallback>
            </Avatar>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Profile</SheetTitle>
          <SheetDescription>
            Manage your account and settings.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
              <AvatarFallback>{getInitials(profile?.full_name || user?.email?.split("@")[0] || "")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-medium">{profile?.full_name || user?.email?.split("@")[0] || "User"}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
              Profile Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
              Help & Support
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
