export interface SnippetDetails {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
  createdAt?: Date;
} 