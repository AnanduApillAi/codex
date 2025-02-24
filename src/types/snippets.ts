export interface SnippetDetails {
  id?: number;
  title: string;
  description: string;
  code: {
    html: string;
    css: string;
    js: string;
  };
  tags: string[];
  createdAt?: Date;
  isTrash?: boolean;
  isFavorite?: boolean;
} 
export interface FilterOptions {
  selectedFolders: string[];
  selectedTags: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'newest' | 'oldest';
}

