
import { UserProfileMenu } from "./UserProfileMenu";
import { MobileNavigation } from "./MobileNavigation";

export const MobileHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Strategic Platform</h1>
        <div className="flex space-x-2">
          <MobileNavigation />
          <UserProfileMenu variant="mobile" />
        </div>
      </div>
    </header>
  );
};
