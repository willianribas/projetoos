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
    <Card className="mb-8 border-muted bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          Monitor de ADE
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className="h-8 w-8"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      {!isMinimized && (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número OS</TableHead>
                <TableHead>Patrimônio</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Dias em ADE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adeOrders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order.numeroos}</TableCell>
                  <TableCell>{order.patrimonio}</TableCell>
                  <TableCell>{order.equipamento}</TableCell>
                  <TableCell>0 dias</TableCell>
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