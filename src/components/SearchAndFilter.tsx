'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Plus } from 'lucide-react';
import { getAllTags } from '@/lib/db';
import { FilterOptions, SnippetDetails } from '@/types/snippets';
import { useRouter } from 'next/navigation';
interface SearchAndFilterProps{
  handleSearch:(searchTerm:string)=>void;
  handleFilter:(filter:FilterOptions)=>void;
}

export function SearchAndFilter({handleSearch,handleFilter}:SearchAndFilterProps) {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Available options states
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const tags = await getAllTags();

        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);


  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleClear = () => {
    setSelectedTags([]);
    setDateRange({ start: '', end: '' });
    setSortBy('newest');
  }

  // const handleApplyFilters = () => {
  //   onFilter({
  //     folders: selectedFolders,
  //     tags: selectedTags,
  //     dateRange,
  //     sortBy
  //   });
  //   setIsFilterOpen(false);
  // };

  // const handleClearFilters = () => {
  //   setSelectedFolders([]);
  //   setSelectedTags([]);
  //   setDateRange({ start: '', end: '' });
  //   setSortBy('newest');
  //   onFilter({
  //     folders: [],
  //     tags: [],
  //     dateRange: { start: '', end: '' },
  //     sortBy: 'newest'
  //   });
  // };

  return (
    <div className="w-full mb-6 flex justify-between items-center relative">
      <div className="flex gap-2 items-center w-2/3 relative">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>{
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            } }
            placeholder="Search snippets..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`px-4 py-2 rounded-lg border bg-background hover:bg-muted flex items-center gap-2 ${
            isFilterOpen ? 'bg-muted' : ''
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>

        {isFilterOpen && (
          <div className="absolute top-full mt-2 right-0 w-[400px] p-5 rounded-lg border bg-card shadow-lg z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base">Filter Snippets</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push('/dashboard/playground')}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Snippet
        </button>
      </div>
    </div>
  );
} 