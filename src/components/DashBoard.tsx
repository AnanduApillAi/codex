import { SnippetGrid } from '@/components/SnippetGrid';
import { useEffect, useState } from 'react';
import { SnippetDetails, FilterOptions } from '@/types/snippets';
import { SearchAndFilter } from './SearchAndFilter';
import { useContext } from 'react';
import { DataContext } from '@/components/providers/dataProvider';

export default function DashboardPage() {
  const { snippets, setSnippets } = useContext<{
    snippets: SnippetDetails[],
    setSnippets: (snippets: SnippetDetails[]) => void
  }>(DataContext);

  const [filteredSnippets, setFilteredSnippets] = useState<SnippetDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    selectedFolders: [],
    selectedTags: [],
    dateRange: { start: '', end: '' },
    sortBy: 'newest'
  });

  useEffect(() => {
    const nonTrashSnippets = snippets.filter(snippet => !snippet.isTrash);
    setFilteredSnippets(nonTrashSnippets);
  }, [snippets]);

  // Combined filter and search function
  const applyFiltersAndSearch = (
    originalSnippets: SnippetDetails[],
    filters: FilterOptions,
    search: string
  ) => {
    // Step 1: Apply Filters
    let result = originalSnippets.filter(snippet => !snippet.isTrash);

    if (filters.selectedTags.length > 0) {
      result = result.filter(snippet =>
        filters.selectedTags.some(tag => snippet.tags.includes(tag))
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      result = result.filter(snippet => {
        const snippetDate = new Date(snippet.createdAt || new Date());
        return snippetDate >= startDate && snippetDate <= endDate;
      });
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt || new Date()).getTime();
      const dateB = new Date(b.createdAt || new Date()).getTime();
      return filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Step 2: Apply Search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(snippet =>
        snippet.title.toLowerCase().includes(searchLower) ||
        snippet.description.toLowerCase().includes(searchLower) ||
        snippet.code.html.toLowerCase().includes(searchLower) ||
        snippet.code.css.toLowerCase().includes(searchLower) ||
        snippet.code.js.toLowerCase().includes(searchLower) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return result;
  };

  // Handler for search
  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const newResults = applyFiltersAndSearch(snippets, activeFilters, searchTerm);
    setFilteredSnippets(newResults);
  };

  // Handler for filter
  const handleFilter = (filters: FilterOptions) => {
    setActiveFilters(filters);
    const newResults = applyFiltersAndSearch(snippets, filters, searchTerm);
    setFilteredSnippets(newResults);
  };

  return (
    <main className="flex min-h-screen bg-background">
      <div className="flex-1 max-w-7xl mx-auto">
        <div className="p-6 space-y-6">
          <div className="mb-2">
            <h1 className="text-2xl font-bold tracking-tight">Snippets</h1>
            <p className="text-muted-foreground">Manage and organize your code snippets</p>
          </div>
          
          <SearchAndFilter 
            handleSearch={handleSearch} 
            handleFilter={handleFilter}
          />
          
          <SnippetGrid 
            snippets={snippets} 
            displaySnippets={filteredSnippets} 
          />
        </div>
      </div>
    </main>
  );
}
