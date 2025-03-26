
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Strategic Deployment Platform</h1>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                  <AvatarFallback>{getInitials(profile?.full_name || user?.email?.split("@")[0] || "")}</AvatarFallback>
                </Avatar>
              </Button>
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
                  <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Welcome, {profile?.full_name || user?.email?.split("@")[0] || "User"}!</h2>
            <p className="text-gray-700">
              You will act as a moderator in a strategic deployment session for an area, 
              helping the team translate the company's strategy into concrete actions for their area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6 border-t-4 border-blue-500">
              <h3 className="text-xl font-semibold mb-4">Step 1</h3>
              <p className="text-gray-700 mb-4">Identify Area Contributions to Strategy</p>
              <Button className="w-full">Start</Button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-semibold mb-4">Step 2</h3>
              <p className="text-gray-700 mb-4">Define Objectives and KPIs</p>
              <Button className="w-full" disabled>Start</Button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 border-t-4 border-purple-500">
              <h3 className="text-xl font-semibold mb-4">Step 3</h3>
              <p className="text-gray-700 mb-4">Define Initiatives</p>
              <Button className="w-full" disabled>Start</Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Strategic Deployment Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
