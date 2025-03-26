
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      const { hash, href, origin } = window.location;
      
      if (hash) {
        try {
          // Parse the hash string to extract the access token
          await supabase.auth.getSession();
          
          // Navigate to home page
          navigate("/");
        } catch (error) {
          console.error("Error handling auth callback:", error);
          navigate("/auth");
        }
      } else {
        // If no hash is present, redirect to login
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
