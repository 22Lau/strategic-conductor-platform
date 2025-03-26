
import { useEffect, useState } from "react";

const DashboardLoading = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // This helps prevent the component from trying to unmount elements
    // that might already be gone from the DOM
    return () => {
      setIsVisible(false);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

export default DashboardLoading;
