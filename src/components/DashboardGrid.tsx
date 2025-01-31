import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Card } from "./ui/card";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  children: React.ReactNode[];
}

export const DashboardGrid = ({ children }: DashboardGridProps) => {
  const layouts = {
    lg: [
      { i: "0", x: 0, y: 0, w: 12, h: 1 },
      { i: "1", x: 0, y: 1, w: 6, h: 2 },
      { i: "2", x: 6, y: 1, w: 6, h: 2 },
      { i: "3", x: 0, y: 3, w: 12, h: 3 },
    ],
    md: [
      { i: "0", x: 0, y: 0, w: 10, h: 1 },
      { i: "1", x: 0, y: 1, w: 5, h: 2 },
      { i: "2", x: 5, y: 1, w: 5, h: 2 },
      { i: "3", x: 0, y: 3, w: 10, h: 3 },
    ],
    sm: [
      { i: "0", x: 0, y: 0, w: 6, h: 1 },
      { i: "1", x: 0, y: 1, w: 6, h: 2 },
      { i: "2", x: 0, y: 3, w: 6, h: 2 },
      { i: "3", x: 0, y: 5, w: 6, h: 3 },
    ],
    xs: [
      { i: "0", x: 0, y: 0, w: 4, h: 1 },
      { i: "1", x: 0, y: 1, w: 4, h: 2 },
      { i: "2", x: 0, y: 3, w: 4, h: 2 },
      { i: "3", x: 0, y: 5, w: 4, h: 3 },
    ],
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
      rowHeight={100}
      isDraggable={false}
      isResizable={false}
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
  );
};