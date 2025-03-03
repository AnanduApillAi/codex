'use client';
import { SnippetCard } from '@/components/SnippetCard';
import { SnippetDetails } from '@/types/snippets';  // Create this shared type
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileCode2, FolderOpen } from 'lucide-react';

interface snippetGridProps{
  snippets:SnippetDetails[];
  displaySnippets:SnippetDetails[];
}


export function SnippetGrid({snippets,displaySnippets}: snippetGridProps) {
  const router = useRouter();

  // Animation variants for grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <FileCode2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No snippets yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create your first code snippet to get started. You can organize, edit, and preview your code.
        </p>
        <button 
          onClick={() => router.push('/dashboard/playground')}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Create a snippet
        </button>
      </div>
    );
  }

  if (displaySnippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No matching snippets</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {displaySnippets.map((snippet) => (
        <motion.div 
          key={`${snippet.id}`}
          onClick={() => router.push(`/dashboard/playground?snippet=${snippet.id}`)}
          className="cursor-pointer"
          variants={item}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <SnippetCard snippet={snippet} />
        </motion.div>
      ))}
    </motion.div>
  );
} 