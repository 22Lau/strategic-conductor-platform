
import { toast } from "@/hooks/use-toast";

// Types for the AI service
interface Contribution {
  id: string;
  strategic_line: string;
  contribution: string;
  examples: string[];
}

export interface AiSuggestion {
  objective: string;
  kpis: string[];
  confidenceScore?: number;
}

// AI engine class to generate suggestions
export class AiEngine {
  // Process contributions and generate objective suggestions
  static generateObjectiveSuggestions(
    contributions: Contribution[]
  ): Promise<AiSuggestion[]> {
    // In a real implementation, this would call an AI service via an edge function
    // For now, we'll use a sophisticated rule-based approach
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        try {
          const suggestions: AiSuggestion[] = [];
          
          // Process each strategic line separately
          const strategicLines = [...new Set(contributions.map(c => c.strategic_line))];
          
          strategicLines.forEach(line => {
            const lineContributions = contributions.filter(c => c.strategic_line === line);
            
            if (lineContributions.length > 0) {
              // Generate suggestion based on the strategic line
              const suggestion = this.generateSuggestionForLine(line, lineContributions);
              if (suggestion) {
                suggestions.push(suggestion);
              }
            }
          });
          
          // If we don't have enough suggestions, add some based on combined contributions
          if (suggestions.length < 3 && contributions.length > 0) {
            const generalSuggestion = this.generateGeneralSuggestion(contributions);
            if (generalSuggestion) {
              suggestions.push(generalSuggestion);
            }
          }
          
          resolve(suggestions);
        } catch (error) {
          console.error("Error generating AI suggestions:", error);
          resolve([]);
        }
      }, 1200); // Simulate AI processing time
    });
  }
  
  // Generate a suggestion for a specific strategic line
  private static generateSuggestionForLine(
    line: string,
    contributions: Contribution[]
  ): AiSuggestion | null {
    // Extract key themes from contributions
    const allText = contributions
      .map(c => `${c.contribution} ${c.examples.join(" ")}`)
      .join(" ");
    
    // Custom logic based on strategic line
    switch (line) {
      case "Customer Success":
        return {
          objective: `Enhance customer experience through ${this.extractKeyFocus(allText)}`,
          kpis: [
            `Improve customer satisfaction score by 15%`,
            `Reduce customer support tickets by 25%`,
            `Increase customer retention rate to 90%`
          ],
          confidenceScore: 0.87
        };
        
      case "Operational Excellence":
        return {
          objective: `Optimize ${this.extractKeyFocus(allText)} processes for greater efficiency`,
          kpis: [
            `Reduce process cycle time by 30%`,
            `Decrease operational costs by 20%`,
            `Improve resource utilization by 25%`
          ],
          confidenceScore: 0.92
        };
        
      case "Innovation":
        return {
          objective: `Develop innovative solutions in ${this.extractKeyFocus(allText)}`,
          kpis: [
            `Launch 3 new innovative features quarterly`,
            `Increase innovation-driven revenue by 15%`,
            `Reduce time-to-market for new ideas by 40%`
          ],
          confidenceScore: 0.84
        };
        
      case "Financial Growth":
        return {
          objective: `Drive financial performance through ${this.extractKeyFocus(allText)}`,
          kpis: [
            `Increase revenue by 20% year-over-year`,
            `Improve profit margin by 5 percentage points`,
            `Optimize cost structure saving 15% in targeted areas`
          ],
          confidenceScore: 0.91
        };
        
      default:
        return {
          objective: `Strengthen capabilities in ${this.extractKeyFocus(allText)}`,
          kpis: [
            `Improve key metrics by 20%`,
            `Enhance team capabilities through targeted training`,
            `Implement 3 best practices industry benchmarks`
          ],
          confidenceScore: 0.75
        };
    }
  }
  
  // Generate a general suggestion based on all contributions
  private static generateGeneralSuggestion(
    contributions: Contribution[]
  ): AiSuggestion {
    const allText = contributions
      .map(c => `${c.contribution} ${c.examples.join(" ")}`)
      .join(" ");
    
    const focus = this.extractKeyFocus(allText);
    
    return {
      objective: `Build organizational capabilities to excel in ${focus}`,
      kpis: [
        `Establish cross-functional excellence in ${focus}`,
        `Develop comprehensive ${focus} measurement framework`,
        `Achieve top-quartile industry performance in ${focus} metrics`
      ],
      confidenceScore: 0.82
    };
  }
  
  // Extract key focus area from text
  private static extractKeyFocus(text: string): string {
    // This would be much more sophisticated with real NLP
    // For now we'll use a simple approach
    const keyAreas = [
      "customer service",
      "digital transformation",
      "data analytics",
      "self-service capabilities",
      "automation",
      "market expansion",
      "product development",
      "talent development",
      "quality assurance",
      "sustainability"
    ];
    
    // Find the area that appears most in the text
    let bestMatch = keyAreas[0];
    let highestCount = 0;
    
    keyAreas.forEach(area => {
      const regex = new RegExp(area, 'gi');
      const count = (text.match(regex) || []).length;
      
      if (count > highestCount) {
        highestCount = count;
        bestMatch = area;
      }
    });
    
    // If no strong matches, pick a random one
    if (highestCount === 0) {
      bestMatch = keyAreas[Math.floor(Math.random() * keyAreas.length)];
    }
    
    return bestMatch;
  }
}

// Function to get AI suggestions for strategic objectives
export const getAiSuggestions = async (
  contributions: Contribution[]
): Promise<AiSuggestion[]> => {
  try {
    // In a production environment, you would call a Supabase Edge Function
    // that securely uses OpenAI or another AI service
    return await AiEngine.generateObjectiveSuggestions(contributions);
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    toast({
      title: "AI Suggestion Error",
      description: "Could not generate AI suggestions at this time",
      variant: "destructive",
    });
    return [];
  }
};
