import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Minimize2 } from "lucide-react";
import { ServiceOrder } from "@/types";
import { Button } from "@/components/ui/button";

interface ADEMonitorProps {
  serviceOrders: ServiceOrder[];
}

const ADEMonitor = ({ serviceOrders }: ADEMonitorProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const adeOrders = serviceOrders.filter(order => order.status === "ADE");

  if (adeOrders.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400 animate-pulse" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Monitor de ADE
          </span>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className="h-8 w-8 hover:bg-primary/10"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      {!isMinimized && (
        <CardContent className="animate-accordion-down">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[150px] text-muted-foreground">
                  Número OS
                </TableHead>
                <TableHead className="w-[150px] text-muted-foreground">
                  Patrimônio
                </TableHead>
                <TableHead className="w-[200px] text-muted-foreground">
                  Equipamento
                </TableHead>
                <TableHead className="w-[120px] text-muted-foreground">
                  Dias em ADE
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adeOrders.map((order, index) => (
                <TableRow 
                  key={index}
                  className="hover:bg-primary/5 transition-colors duration-200"
                >
                  <TableCell className="w-[150px]">
                    {order.numeroos}
                  </TableCell>
                  <TableCell className="w-[150px]">
                    {order.patrimonio}
                  </TableCell>
                  <TableCell className="w-[200px]">
                    {order.equipamento}
                  </TableCell>
                  <TableCell className="w-[120px]">
                    0 dias
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

export default ADEMonitor;