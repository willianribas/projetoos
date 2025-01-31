import { LucideIcon } from "lucide-react";

export interface MetricCard {
  id: string;
  title: string;
  value: number;
  iconName: string;
  color: string;
  bgColor: string;
  description: string;
  selectedStatuses: string[] | null;
}

export interface ColorOption {
  name: string;
  value: string;
  bg: string;
}

export interface IconOption {
  name: string;
  label: string;
}