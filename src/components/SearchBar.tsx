import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="relative max-w-xl">
        <Input 
          placeholder="Buscar OS, patrimônio ou equipamento..." 
          className="pl-10 bg-card/50 backdrop-blur-sm border-muted transition-all duration-200 hover:shadow-md focus:shadow-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default SearchBar;