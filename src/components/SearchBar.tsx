import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SearchCriteria {
  field: string;
  value: string;
}

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchField: string;
  setSearchField: (field: string) => void;
  searchCriteria: SearchCriteria[];
  setSearchCriteria: (criteria: SearchCriteria[]) => void;
}

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  searchField, 
  setSearchField,
  searchCriteria,
  setSearchCriteria 
}: SearchBarProps) => {
  const handleAddCriteria = () => {
    if (searchQuery.trim()) {
      setSearchCriteria([...searchCriteria, { field: searchField, value: searchQuery }]);
      setSearchQuery("");
    }
  };

  const handleRemoveCriteria = (index: number) => {
    setSearchCriteria(searchCriteria.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4 sm:mb-8 animate-fade-in space-y-4">
      <div className="flex gap-4 items-start max-w-3xl mx-auto sm:mx-0">
        <div className="relative flex-1">
          <Input 
            placeholder="Digite sua busca..." 
            className="pl-10 bg-card/50 backdrop-blur-sm border-muted transition-all duration-200 hover:shadow-md focus:shadow-lg text-foreground placeholder:text-muted-foreground/70"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCriteria();
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/70" />
        </div>
        <div className="w-[200px]">
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
        <Button 
          onClick={handleAddCriteria}
          variant="secondary"
          className="whitespace-nowrap"
        >
          Adicionar Filtro
        </Button>
      </div>

      {searchCriteria.length > 0 && (
        <div className="flex flex-wrap gap-2 max-w-3xl mx-auto sm:mx-0">
          {searchCriteria.map((criteria, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-muted text-sm"
            >
              <span className="font-medium">
                {criteria.field === 'all' ? 'Todos' : 
                 criteria.field === 'numeroos' ? 'Número OS' :
                 criteria.field === 'patrimonio' ? 'Patrimônio' :
                 criteria.field === 'equipamento' ? 'Equipamento' :
                 criteria.field === 'status' ? 'Status' : 'Observação'}:
              </span>
              <span className="text-foreground/80">{criteria.value}</span>
              <button
                onClick={() => handleRemoveCriteria(index)}
                className="ml-1 p-0.5 hover:bg-muted/80 rounded-full transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;