
import { Outlet } from "react-router-dom";
import { DesktopSidebar } from "./layout/DesktopSidebar";
import { MobileHeader } from "./layout/MobileHeader";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Mobile layout */}
      <div className="md:hidden flex flex-col min-h-screen w-full">
        <MobileHeader />
        
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
