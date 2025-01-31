import React from "react";
import { Card } from "./ui/card";

interface DashboardGridProps {
  children: React.ReactNode[];
}

export const DashboardGrid = ({ children }: DashboardGridProps) => {
  return (
    <div className="grid gap-4">
      <div className="col-span-12">
        <Card className="h-full overflow-hidden">
          {children[0]}
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="h-full overflow-hidden">
          {children[1]}
        </Card>
        <Card className="h-full overflow-hidden">
          {children[2]}
        </Card>
      </div>
      <div className="col-span-12">
        <Card className="h-full overflow-hidden">
          {children[3]}
        </Card>
      </div>
    </div>
  );
};