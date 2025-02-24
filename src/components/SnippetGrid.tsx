'use client';
import { useEffect, useState, useRef } from 'react';
import { SnippetCard } from '@/components/SnippetCard';
import { SnippetDetails } from '@/types/snippets';  // Create this shared type
import { useRouter } from 'next/navigation';
// import { FilterOptions } from './SearchAndFilter';

interface snippetGridProps{
  snippets:SnippetDetails[];
  displaySnippets:SnippetDetails[];
}

// interface SnippetGridProps {
//   selectedFolder: string | null;
//   onSnippetSelect: (snippet: SnippetDetails) => void;
//   updateTrigger: number;
//   onNewSnippet: (selectedFolder: string | null) => void;
//   searchTerm: string;
//   filterOptions: FilterOptions;
// }

export function SnippetGrid({snippets,displaySnippets}: snippetGridProps) {
  // const [filteredSnippets, setFilteredSnippets] = useState<SnippetDetails[]>([]);
  const router = useRouter();

  // useEffect(() => {
  //   let filtered = snippets;

  //   // Apply search filter
  //   // if (searchTerm) {
  //   //   const searchLower = searchTerm.toLowerCase();
  //   //   filtered = filtered.filter(snippet => {
  //   //     return (
  //   //       snippet.heading.toLowerCase().includes(searchLower) ||
  //   //       snippet.description.toLowerCase().includes(searchLower) ||
  //   //       snippet.code.toLowerCase().includes(searchLower) ||
  //   //       snippet.tags.some(tag => tag.toLowerCase().includes(searchLower))
  //   //     );
  //   //   });
  //   // }

  //   // Apply folder filter
  //   // if (filterOptions.folders.length > 0) {
  //   //   filtered = filtered.filter(snippet => 
  //   //     filterOptions.folders.includes(snippet.folder)
  //   //   );
  //   // }

  //   // Apply tag filter
  //   // if (filterOptions.tags.length > 0) {
  //   //   filtered = filtered.filter(snippet =>
  //   //     snippet.tags.some(tag => filterOptions.tags.includes(tag))
  //   //   );
  //   // }

  //   // Apply date filter
  //   // if (filterOptions.dateRange.start || filterOptions.dateRange.end) {
  //   //   filtered = filtered.filter(snippet => {
  //   //     const snippetDate = new Date(snippet.createdAt || '');
  //   //     const start = filterOptions.dateRange.start ? new Date(filterOptions.dateRange.start) : null;
  //   //     const end = filterOptions.dateRange.end ? new Date(filterOptions.dateRange.end) : null;

  //   //     if (start && end) {
  //   //       return snippetDate >= start && snippetDate <= end;
  //   //     } else if (start) {
  //   //       return snippetDate >= start;
  //   //     } else if (end) {
  //   //       return snippetDate <= end;
  //   //     }
  //   //     return true;
  //   //   });
  //   // }

  //   // Apply sorting
  //   // filtered.sort((a, b) => {
  //   //   const dateA = new Date(a.createdAt || '').getTime();
  //   //   const dateB = new Date(b.createdAt || '').getTime();
  //   //   return filterOptions.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  //   // });

  //   // setFilteredSnippets(filtered);
  // }, [snippets, searchTerm, filterOptions]);

  return (
    <div className="space-y-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {displaySnippets.length > 0 ? (
          displaySnippets.map((snippet) => (
            <div 
              key={`${snippet.id}`}
              onClick={() => router.push(`/dashboard/playground?snippet=${snippet.id}`)}
            >
              <SnippetCard
                snippet={{
                  title: snippet.title,
                  description: snippet.description,
                  code: snippet.code,
                  tags: snippet.tags,
                  createdAt: snippet.createdAt || new Date(),
                }}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            {snippets.length === 0 ? (
              <p className="text-muted-foreground">Loading snippets...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">No matching snippets found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 