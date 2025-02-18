import RightPanel from '@/components/RightPanel';
import { SnippetGrid } from '@/components/SnippetGrid';
import { useState } from 'react';
import { SnippetDetails } from '@/types/snippets';
import { SearchAndFilter } from './SearchAndFilter';

export default function DashboardPage() {

    const [isOpen, setIsOpen] = useState(false);
    const [snippets, setSnippets] = useState<SnippetDetails[]>([]);
    const [filteredSnippets, setFilteredSnippets] = useState<SnippetDetails[]>([]);
    const [formData, setFormData] = useState<SnippetDetails>({
        id: 0,
        heading: '',
        description: '',
        code: '',
        tags: [] as string[],
        folder: '',
        createdAt: new Date()
    });
  const openPanel = ({snippet}:{snippet:SnippetDetails}) => {
    if (snippet) {
      setFormData({
        id: snippet.id,
        heading: snippet.heading,
        description: snippet.description,
        code: snippet.code,
        tags: snippet.tags,
        folder: snippet.folder,
        createdAt: snippet.createdAt || new Date()
      });
    }
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
    setFormData({
      heading: '',
      description: '',
      code: '',
      tags: [],
      folder: '',
      createdAt: new Date()
    });
  };

  const updateSnippets = (formData: SnippetDetails) => {
    setSnippets((prevSnippets) => {
      const snippetExists = prevSnippets.some(snippet => snippet.id === formData.id);
      
      if (snippetExists) {
        return prevSnippets.map(snippet => 
          snippet.id === formData.id ? formData : snippet
        );
      } else {
        return [...prevSnippets, formData];
      }
    });
  };

  const handleSearch = (searchTerm:string) => {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredResults = snippets.filter(snippet =>
      snippet.heading.toLowerCase().includes(searchTermLower) ||
      snippet.description.toLowerCase().includes(searchTermLower) ||
      snippet.code.toLowerCase().includes(searchTermLower) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    );
    setFilteredSnippets(filteredResults);
    console.log(filteredResults);
  }

  const handleFilter = (filter:object) => {
    console.log(filter);
  }


  return (
    <main className="flex min-h-screen">
      <div className="flex-1">
        <div className="p-6">
          <SearchAndFilter handleSearch={handleSearch} handleFilter={handleFilter}/>
          <SnippetGrid openPanel={openPanel} snippets={snippets} setSnippets={setSnippets} displaySnippets={filteredSnippets} />
        </div>
      </div>
      <RightPanel isOpen={isOpen} onClose={closePanel} setFormData={setFormData} formData={formData} updateSnippets={updateSnippets}/>
    </main>
  );
}

