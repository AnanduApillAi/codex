'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateSnippet, getAllFolders } from '@/lib/db';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'react-hot-toast';

interface SnippetDetails {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
  createdAt?: Date;
}

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  snippetDetails: SnippetDetails | null;
  onUpdate: () => void;
}

export default function RightPanel({ isOpen, onClose, snippetDetails, onUpdate }: RightPanelProps) {
  const [width, setWidth] = useState(384);
  const minWidth = 300;
  const maxWidth = 600;

  const [formData, setFormData] = useState<SnippetDetails>({
    heading: '',
    description: '',
    code: '',
    tags: [],
    folder: ''
  });
  const [newTag, setNewTag] = useState('');
  const [folders, setFolders] = useState<string[]>([]);
  const [newFolder, setNewFolder] = useState('');

  // Load folders when component mounts
  useEffect(() => {
    const loadFolders = async () => {
      try {
        const folderList = await getAllFolders();
        setFolders(folderList);
      } catch (error) {
        console.error('Error loading folders:', error);
      }
    };
    loadFolders();
  }, []);

  // Update form data when snippetDetails changes
  useEffect(() => {
    if (snippetDetails) {
      setFormData(snippetDetails);
    }
  }, [snippetDetails]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    const startWidth = width;
    const startX = e.pageX;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth - (e.pageX - startX);
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Reset panel position when closed
  useEffect(() => {
    if (!isOpen) {
      setWidth(384);
    }
  }, [isOpen]);

  const handleChange = (
    field: keyof SnippetDetails,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      if (snippetDetails?.id) {
        await updateSnippet(snippetDetails.id, {
          ...formData,
          id: snippetDetails.id // Ensure ID is included
        });
        onUpdate();
        toast.success('Snippet updated successfully');
        onClose();
      }
    } catch (error) {
      console.error('Error updating snippet:', error);
      toast.error('Failed to update snippet');
    }

  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed right-0 top-0 h-screen z-50"
      style={{ width: width }}
    >
      <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
        <div className="p-4">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Snippet Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Snippet details form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Heading</label>
              <Input 
                value={formData.heading} 
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="Enter snippet heading"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter snippet description"
                className="min-h-[20px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Code</label>
              <Textarea 
                value={formData.code} 
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="Enter your code"
                className="font-mono min-h-[40px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type and press Enter to add tag"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    if (newTag.trim()) {
                      handleAddTag({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Folder</label>
              <div className="flex gap-2">
                <Select
                  value={formData.folder}
                  onValueChange={(value) => handleChange('folder', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select or type folder name" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder} value={folder}>
                        {folder}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Or type new folder"
                  value={newFolder}
                  onChange={(e) => {
                    setNewFolder(e.target.value);
                    handleChange('folder', e.target.value);
                  }}
                  className="max-w-[200px]"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t">
              <Button 
                className="w-full"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Resizer handle */}
        <div className="absolute left-0 top-0 bottom-0 flex items-center">
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-300 dark:hover:bg-gray-600"
            onMouseDown={startResizing}
          />
        </div>
      </div>
    </div>
  );
} 