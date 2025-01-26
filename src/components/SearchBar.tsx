import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchField: string;
  setSearchField: (field: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery, searchField, setSearchField }: SearchBarProps) => {
  return (
    <div className="mb-4 sm:mb-8 animate-fade-in space-y-4">
      <div className="relative max-w-xl mx-auto sm:mx-0">
        <Input 
          placeholder="Digite sua busca..." 
          className="pl-10 bg-card/50 backdrop-blur-sm border-muted transition-all duration-200 hover:shadow-md focus:shadow-lg text-foreground placeholder:text-muted-foreground/70"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/70" />
      </div>
      <div className="max-w-[200px]">
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger>
            <SelectValue placeholder="Buscar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os campos</SelectItem>
            <SelectItem value="numeroos">Número OS</SelectItem>
            <SelectItem value="patrimonio">Patrimônio</SelectItem>
            <SelectItem value="equipamento">Equipamento</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="observacao">Observação</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchBar;