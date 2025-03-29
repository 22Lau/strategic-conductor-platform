
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute = ({ redirectPath = "/auth" }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // This ensures we're using the current auth state
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to auth page");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default ProtectedRoute;
