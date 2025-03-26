
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  // Redirect to dashboard if user is already onboarded
  useEffect(() => {
    if (user && !showWelcome) {
      navigate('/');
    }
  }, [user, navigate, showWelcome]);

  const handleGetStarted = () => {
    setShowWelcome(false);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            Welcome, {profile?.full_name || user.email}
          </CardTitle>
          <CardDescription className="text-lg">
            To your Strategic Implementation Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-lg">
            I'm going to guide you, and together we'll moderate a strategic implementation session 
            for a specific area, helping the team translate the company's strategy into concrete 
            actions for their area.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">What we'll accomplish together:</h3>
            <ol className="text-left space-y-3 text-blue-700">
              <li>1. <span className="font-medium">Identify your area's contribution</span> to each strategic line</li>
              <li>2. <span className="font-medium">Define objectives and KPIs</span> aligned with those contributions</li>
              <li>3. <span className="font-medium">Create actionable initiatives</span> to achieve your objectives</li>
              <li>4. <span className="font-medium">Get expert perspectives</span> on your strategy</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Button size="lg" onClick={handleGetStarted} className="w-1/2">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
