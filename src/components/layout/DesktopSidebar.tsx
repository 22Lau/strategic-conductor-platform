
import { UserProfileMenu } from "./UserProfileMenu";
import { Navigation } from "./Navigation";

export const DesktopSidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <h1 className="text-xl font-bold text-gray-900">Strategic Platform</h1>
          </div>
          <Navigation />
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <UserProfileMenu variant="desktop" />
        </div>
      </div>
    </div>
  );
};
