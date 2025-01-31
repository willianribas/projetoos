import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useUserPreferences, DashboardLayout } from "@/hooks/useUserPreferences";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  children: React.ReactNode[];
}

export const DashboardGrid = ({ children }: DashboardGridProps) => {
  const { preferences, updateLayout } = useUserPreferences();
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (preferences?.dashboard_layout) {
      setCurrentLayout(preferences.dashboard_layout);
    } else {
      // Default layout if none exists
      const defaultLayout = children.map((_, i) => ({
        i: i.toString(),
        x: (i % 3) * 4,
        y: Math.floor(i / 3) * 4,
        w: 4,
        h: 4,
        minW: 2,
        minH: 2,
      }));
      setCurrentLayout(defaultLayout);
    }
  }, [preferences, children]);

  const handleLayoutChange = (layout: DashboardLayout[]) => {
    if (isEditing) {
      setCurrentLayout(layout);
    }
  };

  const handleSaveLayout = () => {
    updateLayout(currentLayout);
    setIsEditing(false);
  };

  const layouts = {
    lg: currentLayout,
    md: currentLayout.map(item => ({ ...item, w: Math.min(item.w, 6) })),
    sm: currentLayout.map(item => ({ ...item, w: Math.min(item.w, 4) })),
    xs: currentLayout.map(item => ({ ...item, w: Math.min(item.w, 2) })),
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancelar Edição" : "Editar Layout"}
        </Button>
        {isEditing && (
          <Button onClick={handleSaveLayout}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Layout
          </Button>
        )}
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        rowHeight={100}
        onLayoutChange={(layout) => handleLayoutChange(layout)}
        isDraggable={isEditing}
        isResizable={isEditing}
        margin={[16, 16]}
      >
        {children.map((child, index) => (
          <div key={index.toString()} className="relative">
            <Card className="h-full overflow-hidden">
              {child}
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};