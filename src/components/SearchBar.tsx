import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="mb-8 flex gap-2">
      <Input 
        placeholder="Buscar OS, patrimônio ou equipamento..." 
        className="max-w-xl bg-card/50 border-muted"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button className="bg-primary hover:bg-primary/90">
        <Search className="mr-2" />
        Buscar
      </Button>
    </div>
  );
};

export default SearchBar;