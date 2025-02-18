'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateSnippet, getAllFolders, addSnippet, getAllSnippets } from '@/lib/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';
import { SnippetDetails } from '@/types/snippets';

interface RightPanelProps {
  isOpen: boolean;
  onClose:()=>void;
  formData:SnippetDetails;
  setFormData: (formData: SnippetDetails |((prev:SnippetDetails) => SnippetDetails)) => void;
  updateSnippets: (formData:SnippetDetails) => void;
}

export default function RightPanel({ isOpen, onClose, formData, setFormData, updateSnippets }: RightPanelProps) {
  const [newTag, setNewTag] = useState('');
  const [folders, setFolders] = useState<string[]>([]);


  // Load folders when component mounts AND when panel opens or updateTrigger changes
  useEffect(() => {
    const loadFolders = async () => {
      try {
        const folderList = await getAllFolders();
        setFolders(folderList);
      } catch (error) {
        console.error('Error loading folders:', error);
      }
    };
    
    loadFolders(); // Remove the isOpen condition to ensure folders are always updated
  }, []); // Remove isOpen from dependency array

  const handleChange = (
    field: keyof SnippetDetails,
    value: string | string[]
  ) => {
    setFormData((prev: SnippetDetails) => ({
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
        // Add new snippet
        await addSnippet({
          ...formData,
          createdAt: new Date()
        });
        updateSnippets(formData);
        onClose();
      }
       catch (error) {
      console.error('Error saving snippet:', error);
      toast.error('Failed to save snippet');
    }
  };

  const handleUpdate = async () => {
    try {
      if(!formData.id){
        await handleSave();
      }else{
        await updateSnippet(formData.id, formData);
        updateSnippets(formData);
        onClose();
      }
    } catch (error) {
      console.error('Error updating snippet:', error);
      toast.error('Failed to update snippet');
    }
  };
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 h-[90vh] w-[500px] rounded-lg shadow-lg overflow-y-auto">
        <div className="p-6">
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
                {/* <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    if (newTag.trim()) {
                      handleAddTag({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button> */}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Folder</label>
              {/* <Select
                value={formData.folder}
                onValueChange={(value) => handleChange('folder', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {formData.folder || 'Select folder'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder} value={folder}>
                      {folder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t">
              <Button 
                className="w-full"
                onClick={handleUpdate}
              >
                <Save className="h-4 w-4 mr-2"/>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 