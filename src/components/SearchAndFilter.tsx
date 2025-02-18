'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Plus } from 'lucide-react';
import { getAllFolders, getAllTags } from '@/lib/db';

interface SearchAndFilterProps{
  handleSearch:(searchTerm:string)=>void;
  handleFilter:(filter:object)=>void;
}

export function SearchAndFilter({handleSearch,handleFilter}:SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Available options states
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const folders = await getAllFolders();
        const tags = await getAllTags();

        setAvailableFolders(folders);
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  const toggleFolder = (folder: string) => {
    setSelectedFolders(prev => 
      prev.includes(folder) 
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

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
          {(selectedFolders.length > 0 || selectedTags.length > 0 || dateRange.start || dateRange.end) && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
              {selectedFolders.length + selectedTags.length + (dateRange.start || dateRange.end ? 1 : 0)}
            </span>
          )}
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
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Folders</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableFolders.map((folder) => (
                    <button
                      key={folder}
                      onClick={() => toggleFolder(folder)}
                      className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                        selectedFolders.includes(folder)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {folder}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Date Range</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => handleDateChange('start', e.target.value)}
                      className="flex-1 px-2 py-1.5 text-xs rounded-md border bg-background"
                    />
                    <span className="text-xs text-muted-foreground self-center">to</span>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => handleDateChange('end', e.target.value)}
                      className="flex-1 px-2 py-1.5 text-xs rounded-md border bg-background"
                    />
                  </div>
                </div>

                <div className="w-32">
                  <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Sort By</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                    className="w-full px-2 py-1.5 text-xs rounded-md border bg-background"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t mt-2">
                <button
                  onClick={()=>console.log('clear')}
                  className="px-3 py-1.5 text-xs rounded-md border hover:bg-muted transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={()=>handleFilter({selectedFolders,selectedTags,dateRange,sortBy})}
                  className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => console.log('add')}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Snippet
        </button>
      </div>
    </div>
  );
} 