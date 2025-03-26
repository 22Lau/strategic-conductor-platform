
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Objective {
  id: string;
  title: string;
  kpis: string[];
}

export interface Initiative {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  responsiblePerson: string;
  startDate: Date;
  endDate: Date;
  status: "planning" | "in-progress" | "completed";
  actions: string[];
}

interface InitiativeFormProps {
  objectives: Objective[];
  onSaveInitiative: (initiative: Omit<Initiative, "id">) => void;
}

const InitiativeForm = ({ objectives, onSaveInitiative }: InitiativeFormProps) => {
  const { toast } = useToast();
  const [newInitiative, setNewInitiative] = useState<Partial<Initiative>>({
    objectiveId: "",
    title: "",
    description: "",
    responsiblePerson: "",
    status: "planning",
    actions: []
  });
  const [newAction, setNewAction] = useState("");
  
  const handleAddAction = () => {
    if (newAction.trim()) {
      setNewInitiative({
        ...newInitiative,
        actions: [...(newInitiative.actions || []), newAction.trim()]
      });
      setNewAction("");
    }
  };
  
  const handleRemoveAction = (index: number) => {
    setNewInitiative({
      ...newInitiative,
      actions: (newInitiative.actions || []).filter((_, i) => i !== index)
    });
  };
  
  const handleSaveInitiative = () => {
    // Validate form
    if (!newInitiative.objectiveId || !newInitiative.title || !newInitiative.startDate || !newInitiative.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    onSaveInitiative(newInitiative as Omit<Initiative, "id">);
    
    // Reset form
    setNewInitiative({
      objectiveId: "",
      title: "",
      description: "",
      responsiblePerson: "",
      status: "planning",
      actions: []
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="objective">Related Objective</Label>
        <Select 
          value={newInitiative.objectiveId} 
          onValueChange={(value) => setNewInitiative({...newInitiative, objectiveId: value})}
        >
          <SelectTrigger id="objective">
            <SelectValue placeholder="Select an objective" />
          </SelectTrigger>
          <SelectContent>
            {objectives.map(objective => (
              <SelectItem key={objective.id} value={objective.id}>
                {objective.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="initiative-title">Initiative Title</Label>
        <Input
          id="initiative-title"
          placeholder="e.g., Implement customer knowledge base"
          value={newInitiative.title || ""}
          onChange={(e) => setNewInitiative({...newInitiative, title: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="initiative-description">Description</Label>
        <Textarea
          id="initiative-description"
          placeholder="Describe the initiative in detail..."
          value={newInitiative.description || ""}
          onChange={(e) => setNewInitiative({...newInitiative, description: e.target.value})}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="responsible">Responsible Person</Label>
          <Input
            id="responsible"
            placeholder="Name of person responsible"
            value={newInitiative.responsiblePerson || ""}
            onChange={(e) => setNewInitiative({...newInitiative, responsiblePerson: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={newInitiative.status} 
            onValueChange={(value: "planning" | "in-progress" | "completed") => 
              setNewInitiative({...newInitiative, status: value})}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !newInitiative.startDate && "text-muted-foreground"
                )}
              >
                {newInitiative.startDate ? (
                  format(newInitiative.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newInitiative.startDate}
                onSelect={(date) => setNewInitiative({...newInitiative, startDate: date!})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !newInitiative.endDate && "text-muted-foreground"
                )}
              >
                {newInitiative.endDate ? (
                  format(newInitiative.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newInitiative.endDate}
                onSelect={(date) => setNewInitiative({...newInitiative, endDate: date!})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div>
        <Label>Key Actions</Label>
        <div className="flex space-x-2 mt-1">
          <Input
            placeholder="Add a specific action item"
            value={newAction}
            onChange={(e) => setNewAction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
          />
          <Button type="button" onClick={handleAddAction}>Add</Button>
        </div>
        
        {(newInitiative.actions?.length || 0) > 0 && (
          <div className="mt-4 space-y-2">
            <Label>Actions List</Label>
            <div className="space-y-2">
              {newInitiative.actions?.map((action, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span>{action}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveAction(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Button className="w-full" onClick={handleSaveInitiative}>
        <PlusCircle className="mr-2 h-4 w-4" /> Save Initiative
      </Button>
    </div>
  );
};

export default InitiativeForm;
