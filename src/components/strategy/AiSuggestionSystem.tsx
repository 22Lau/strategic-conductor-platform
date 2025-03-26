
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAiSuggestions, AiSuggestion } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

interface AiSuggestionSystemProps {
  contributions: any[];
  onSuggestionSelect: (suggestion: { objective: string, kpis: string[] }) => void;
}

const AiSuggestionSystem = ({ contributions, onSuggestionSelect }: AiSuggestionSystemProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const handleGenerateSuggestions = async () => {
    if (contributions.length === 0) {
      toast({
        title: "No contributions found",
        description: "Please add strategic contributions before generating AI suggestions",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const newSuggestions = await getAiSuggestions(contributions);
      setSuggestions(newSuggestions);
      setSelectedIndex(null);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate suggestions at this time",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectSuggestion = (suggestion: AiSuggestion, index: number) => {
    setSelectedIndex(index);
    onSuggestionSelect(suggestion);
    
    toast({
      title: "Suggestion applied",
      description: "AI suggestion has been applied to your objective",
    });
  };
  
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5 text-blue-600" />
          AI Suggestions
        </CardTitle>
        <CardDescription>
          Based on your contributions, our AI suggests these objectives and KPIs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <Button
            onClick={handleGenerateSuggestions}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Contributions...
              </>
            ) : (
              <>Generate AI Suggestions</>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedIndex === index 
                      ? "bg-blue-100 border-blue-300" 
                      : "bg-white hover:bg-blue-50"
                  }`}
                  onClick={() => handleSelectSuggestion(suggestion, index)}
                >
                  {suggestion.confidenceScore && (
                    <Badge className="mb-2 bg-blue-100 text-blue-800">
                      {Math.round(suggestion.confidenceScore * 100)}% Confidence
                    </Badge>
                  )}
                  <h3 className="font-medium text-blue-800">{suggestion.objective}</h3>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-blue-600">Suggested KPIs:</p>
                    <ul className="text-xs list-disc list-inside mt-1 text-blue-700">
                      {suggestion.kpis.map((kpi, i) => (
                        <li key={i}>{kpi}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={handleGenerateSuggestions}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Regenerate Suggestions</>
              )}
            </Button>
          </div>
        )}
        
        <p className="mt-4 text-xs text-blue-600">
          Using TensorFlow.js to analyze patterns and suggest optimal objectives
        </p>
      </CardContent>
    </Card>
  );
};

export default AiSuggestionSystem;
