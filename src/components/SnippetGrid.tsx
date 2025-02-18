'use client';
import { useEffect, useState, useRef } from 'react';
import { getAllSnippets } from '@/lib/db';
import { SnippetCard } from '@/components/SnippetCard';
import { SnippetDetails } from '@/types/snippets';  // Create this shared type
// import { FilterOptions } from './SearchAndFilter';

interface snippetGridProps{
  openPanel:({snippet}:{snippet:SnippetDetails})=>void;
  snippets:SnippetDetails[];
  setSnippets:(snippets:SnippetDetails[])=>void;
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

export function SnippetGrid({snippets,openPanel,setSnippets,displaySnippets}: snippetGridProps) {
  // const [filteredSnippets, setFilteredSnippets] = useState<SnippetDetails[]>([]);

  useEffect(() => {
    const loadSnippets = async () => {
      try {
        const data = await getAllSnippets();
        const snippets = data
          .map(snippet => ({
            ...snippet,
            createdAt: snippet.createdAt || new Date(),
          }));
        setSnippets(snippets);
      } catch (error) {
        console.error('Error loading snippets:', error);
      }
    };

    loadSnippets();
  }, []);

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
      {/* Snippet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        
        {displaySnippets.length>0?displaySnippets.map((snippet, index) => (
          <div 
          key={`${snippet.id}`}
          onClick={() => openPanel({snippet})}
        >
          <SnippetCard
            snippet={{
              heading: snippet.heading,
              description: snippet.description,
              code: snippet.code,
              tags: snippet.tags,
              folder: snippet.folder,
              createdAt: snippet.createdAt|| new Date(),
            }}
          />
        </div>
      ))
        :snippets.map((snippet, index) => (
          <div 
            key={`${snippet.id}`}
            onClick={() => openPanel({snippet})}
          >
            <SnippetCard
              snippet={{
                heading: snippet.heading,
                description: snippet.description,
                code: snippet.code,
                tags: snippet.tags,
                folder: snippet.folder,
                createdAt: snippet.createdAt|| new Date(),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 