'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, SlidersHorizontal, ArrowDownAZ, ArrowUpAZ, X, Calendar } from 'lucide-react';
import { FilterOptions } from '@/types/snippets';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { getAllTags } from '@/lib/db';

interface SearchAndFilterProps {
  handleSearch: (searchTerm: string) => void;
  handleFilter: (filter: FilterOptions) => void;
}

export function SearchAndFilter({ handleSearch, handleFilter }: SearchAndFilterProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  // Temporary state for filter values
  const [tempFilters, setTempFilters] = useState({
    sortBy: 'newest' as 'newest' | 'oldest',
    dateRange: { start: '', end: '' },
    selectedTags: [] as string[]
  });
  
  // Active filter values
  const [activeFilters, setActiveFilters] = useState({
    sortBy: 'newest' as 'newest' | 'oldest',
    dateRange: { start: '', end: '' },
    selectedTags: [] as string[]
  });

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleSortChange = (value: 'newest' | 'oldest') => {
    setTempFilters(prev => ({ ...prev, sortBy: value }));
  };

  const handleDateSelect = (date: Date | undefined, type: 'start' | 'end') => {
    if (date) {
      const newDateRange = {
        ...tempFilters.dateRange,
        [type]: date.toISOString()
      };
      setTempFilters(prev => ({ ...prev, dateRange: newDateRange }));
      type === 'start' ? setShowStartDate(false) : setShowEndDate(false);
    }
  };

  

  const toggleTag = (tag: string) => {
    setTempFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const applyFilters = () => {
    setActiveFilters(tempFilters);
    setIsFilterActive(
      tempFilters.sortBy !== 'newest' ||
      tempFilters.dateRange.start !== '' ||
      tempFilters.dateRange.end !== '' ||
      tempFilters.selectedTags.length > 0
    );
    handleFilter({
      selectedFolders: [],
      selectedTags: tempFilters.selectedTags,
      dateRange: tempFilters.dateRange,
      sortBy: tempFilters.sortBy
    });
  };

  const clearFilters = () => {
    const defaultFilters = {
      sortBy: 'newest' as const,
      dateRange: { start: '', end: '' },
      selectedTags: []
    };
    setTempFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    setIsFilterActive(false);
    handleFilter({
      selectedFolders: [],
      selectedTags: [],
      dateRange: { start: '', end: '' },
      sortBy: 'newest'
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        {/* Search Input - Full width on mobile */}
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-hover:text-primary transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search snippets..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background/50 focus:bg-background 
                     focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/20
                     transition-all duration-200"
          />
        </div>

        {/* Action Buttons - Stack on mobile */}
        <div className="flex items-stretch sm:items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={isFilterActive ? "default" : "outline"} 
                size="sm"
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl hover:shadow-md transition-all duration-200 w-full sm:w-auto"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="inline">Filter & Sort</span>
                {isFilterActive && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 px-2 py-0.5 h-5 rounded-md bg-primary/10 text-primary"
                  >
                    {(activeFilters.selectedTags.length > 0 ? 1 : 0) + 
                     (activeFilters.dateRange.start || activeFilters.dateRange.end ? 1 : 0) + 
                     (activeFilters.sortBy !== 'newest' ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[min(340px,calc(100vw-2rem))] p-4 sm:p-5 rounded-xl shadow-lg border-primary/5" 
              align="end" 
              sideOffset={8}
            >
              <div className="space-y-5">
                {/* Sort Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Sort by</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={tempFilters.sortBy === 'newest' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSortChange('newest')}
                      className="w-full rounded-lg hover:shadow-sm transition-all duration-200"
                    >
                      <ArrowDownAZ className="h-3.5 w-3.5 mr-2" />
                      Newest
                    </Button>
                    <Button 
                      variant={tempFilters.sortBy === 'oldest' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSortChange('oldest')}
                      className="w-full rounded-lg hover:shadow-sm transition-all duration-200"
                    >
                      <ArrowUpAZ className="h-3.5 w-3.5 mr-2" />
                      Oldest
                    </Button>
                  </div>
                </div>

                <Separator className="bg-primary/5" />

                {/* Date Range Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Date range</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left font-normal rounded-lg 
                                 hover:shadow-sm transition-all duration-200"
                        onClick={() => setShowStartDate(!showStartDate)}
                      >
                        <Calendar className="h-3.5 w-3.5 mr-2" />
                        {tempFilters.dateRange.start ? 
                          format(new Date(tempFilters.dateRange.start), 'PP') : 
                          'Start date'
                        }
                      </Button>
                      {showStartDate && (
                        <div className="absolute mt-2 bg-popover border rounded-xl shadow-lg z-50 overflow-hidden">
                          <CalendarComponent
                            mode="single"
                            selected={tempFilters.dateRange.start ? new Date(tempFilters.dateRange.start) : undefined}
                            onSelect={(date) => handleDateSelect(date, 'start')}
                            disabled={(date) => tempFilters.dateRange.end ? date > new Date(tempFilters.dateRange.end) : false}
                            initialFocus
                            className="rounded-lg border-none"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left font-normal rounded-lg 
                                 hover:shadow-sm transition-all duration-200"
                        onClick={() => setShowEndDate(!showEndDate)}
                      >
                        <Calendar className="h-3.5 w-3.5 mr-2" />
                        {tempFilters.dateRange.end ? 
                          format(new Date(tempFilters.dateRange.end), 'PP') : 
                          'End date'
                        }
                      </Button>
                      {showEndDate && (
                        <div className="absolute mt-2 bg-popover border rounded-xl shadow-lg z-50 overflow-hidden">
                          <CalendarComponent
                            mode="single"
                            selected={tempFilters.dateRange.end ? new Date(tempFilters.dateRange.end) : undefined}
                            onSelect={(date) => handleDateSelect(date, 'end')}
                            disabled={(date) => tempFilters.dateRange.start ? date < new Date(tempFilters.dateRange.start) : false}
                            initialFocus
                            className="rounded-lg border-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-primary/5" />

                {/* Tags Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-2 rounded-xl 
                                bg-muted/30 border border-primary/5">
                    {availableTags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant={tempFilters.selectedTags.includes(tag) ? "default" : "secondary"}
                        className="cursor-pointer px-2.5 py-1 rounded-lg hover:bg-primary/90 hover:text-secondary
                                 transition-all duration-200 hover:shadow-sm"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {availableTags.length === 0 && (
                      <span className="text-sm text-muted-foreground p-2">
                        No tags available
                      </span>
                    )}
                  </div>
                </div>

                <Separator className="bg-primary/5" />

                {/* Action Buttons */}
                <div className="flex justify-between gap-3 pt-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                    className="flex-1 rounded-lg hover:bg-destructive/10 hover:text-destructive 
                             transition-all duration-200"
                  >
                    Clear all
                  </Button>
                  <Button 
                    size="sm"
                    onClick={applyFilters}
                    className="flex-1 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors
                             duration-200"
                  >
                    Apply filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={() => router.push('/dashboard/playground')}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors
                      duration-200 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span className="inline">New Snippet</span>
          </Button>
        </div>
      </div>

      
    </div>
  );
} 