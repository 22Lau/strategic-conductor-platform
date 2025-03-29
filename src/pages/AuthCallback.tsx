
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Use a more robust method to get session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error in auth callback:", error);
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        if (data?.session) {
          // Check if the auth state is refreshed properly
          console.log("Auth callback successful, session established");
          
          // Successfully authenticated
          toast({
            title: "Authentication successful",
            description: "You have been signed in",
          });
          
          // Short delay to ensure auth state is properly updated
          setTimeout(() => navigate("/"), 100);
        } else {
          console.error("No session found in callback");
          toast({
            title: "Authentication issue",
            description: "Unable to establish session",
            variant: "destructive",
          });
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error handling auth callback:", error);
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
