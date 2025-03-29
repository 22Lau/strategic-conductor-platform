
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Target, Users, FileText, BarChart } from "lucide-react";

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const navigationItems: NavigationItem[] = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Organizations", path: "/organizations", icon: <Users className="h-5 w-5" /> },
  { name: "Strategic Areas", path: "/strategic-areas", icon: <Target className="h-5 w-5" /> },
  { name: "Strategic Plans", path: "/plans", icon: <FileText className="h-5 w-5" /> },
  { name: "Reports", path: "/reports", icon: <BarChart className="h-5 w-5" /> },
];

interface NavigationProps {
  onClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onClick }) => {
  return (
    <nav className="mt-5 flex-1 px-2 space-y-1">
      {navigationItems.map((item) => (
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
          onClick={onClick}
        >
          <div className="mr-3">{item.icon}</div>
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};
