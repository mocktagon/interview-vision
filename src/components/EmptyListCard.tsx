import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface EmptyListCardProps {
  onClick: () => void;
}

export function EmptyListCard({ onClick }: EmptyListCardProps) {
  return (
    <Card 
      className="p-6 transition-all duration-200 hover:shadow-lg cursor-pointer border-dashed border-2 hover:border-primary group"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Create New List</h3>
        <p className="text-sm text-muted-foreground">
          Organize candidates into custom lists
        </p>
      </div>
    </Card>
  );
}
