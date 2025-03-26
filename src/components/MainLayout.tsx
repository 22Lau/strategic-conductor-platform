
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Target, Users, FileText, Menu, BarChart, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MainLayout = () => {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const navigation = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Organizations", path: "/organizations", icon: <Users className="h-5 w-5" /> },
    { name: "Strategic Areas", path: "/strategic-areas", icon: <Target className="h-5 w-5" /> },
    { name: "Strategic Plans", path: "/plans", icon: <FileText className="h-5 w-5" /> },
    { name: "Reports", path: "/reports", icon: <BarChart className="h-5 w-5" /> },
  ];
  
  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <h1 className="text-xl font-bold text-gray-900">Strategic Platform</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <div className="mr-3">{item.icon}</div>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
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
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden flex flex-col min-h-screen w-full">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Strategic Platform</h1>
            <div className="flex space-x-2">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Strategic Platform</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <nav className="flex flex-col space-y-1">
                      {navigation.map((item) => (
                        <Button
                          key={item.name}
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            navigate(item.path);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="mr-3">{item.icon}</div>
                          {item.name}
                        </Button>
                      ))}
                    </nav>
                    <div className="pt-6 mt-6 border-t border-gray-200">
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
            </div>
          </div>
        </header>
        
        {/* Mobile main content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      
      {/* Desktop main content */}
      <div className="hidden md:flex md:flex-1 md:ml-64">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
