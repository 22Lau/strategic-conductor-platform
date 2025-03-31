
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GuidanceCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guidance</CardTitle>
        <CardDescription>Tips for defining strong strategic contributions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-gray-500 uppercase">What Makes a Good Contribution?</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>• Focus on measurable impact rather than activities</li>
            <li>• Link directly to the strategic line's objectives</li>
            <li>• Be specific and actionable</li>
            <li>• Consider both short and long-term effects</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-sm text-gray-500 uppercase">Example</h3>
          <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
            <strong>Strategic Line:</strong> Customer Success<br />
            <strong>Contribution:</strong> Develop self-service knowledge base to reduce support tickets and improve customer satisfaction<br />
            <strong>Examples:</strong><br />
            - Create searchable FAQ section based on common tickets<br />
            - Implement video tutorials for complex features<br />
            - Build customer feedback loop to continuously improve resources
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuidanceCard;
