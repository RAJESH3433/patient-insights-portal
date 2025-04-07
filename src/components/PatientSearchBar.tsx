
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PatientSearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: PatientFilters) => void;
}

export interface PatientFilters {
  riskLevel: string[];
  ageRange: [number, number] | null;
  conditions: string[];
}

const PatientSearchBar = ({ onSearch, onFilterChange }: PatientSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PatientFilters>({
    riskLevel: [],
    ageRange: null,
    conditions: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRiskLevelChange = (level: string) => {
    const updatedLevels = filters.riskLevel.includes(level)
      ? filters.riskLevel.filter((l) => l !== level)
      : [...filters.riskLevel, level];
    
    const updatedFilters = {
      ...filters,
      riskLevel: updatedLevels,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleAgeRangeChange = (range: string) => {
    let ageRange: [number, number] | null = null;
    
    switch (range) {
      case "18-30":
        ageRange = [18, 30];
        break;
      case "31-50":
        ageRange = [31, 50];
        break;
      case "51-70":
        ageRange = [51, 70];
        break;
      case "71+":
        ageRange = [71, 120];
        break;
      default:
        ageRange = null;
    }
    
    const updatedFilters = {
      ...filters,
      ageRange,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleConditionChange = (condition: string) => {
    const updatedConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter((c) => c !== condition)
      : [...filters.conditions, condition];
    
    const updatedFilters = {
      ...filters,
      conditions: updatedConditions,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      riskLevel: [],
      ageRange: null,
      conditions: [],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = 
    filters.riskLevel.length > 0 || 
    filters.ageRange !== null || 
    filters.conditions.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search patients by name, ID, or condition..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="pl-10 bg-white"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch}>Search</Button>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant={hasActiveFilters ? "default" : "outline"} 
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="bg-white text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {filters.riskLevel.length + (filters.ageRange ? 1 : 0) + filters.conditions.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filters</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Risk Level</h4>
                <div className="flex flex-wrap gap-2">
                  {["high", "medium", "low"].map((level) => (
                    <Button
                      key={level}
                      variant={filters.riskLevel.includes(level) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRiskLevelChange(level)}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Age Range</h4>
                <Select onValueChange={handleAgeRangeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ages</SelectItem>
                    <SelectItem value="18-30">18-30 years</SelectItem>
                    <SelectItem value="31-50">31-50 years</SelectItem>
                    <SelectItem value="51-70">51-70 years</SelectItem>
                    <SelectItem value="71+">71+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Common Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {["Hypertension", "Diabetes", "Heart Disease", "Obesity", "Asthma"].map((condition) => (
                    <Button
                      key={condition}
                      variant={filters.conditions.includes(condition) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleConditionChange(condition)}
                    >
                      {condition}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PatientSearchBar;
