'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function LeftPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(256);
  const [adjustedWidth, setAdjustedWidth] = useState(256);
  const minWidth = 150; // Updated minimum width
  const collapsedWidth = 48; // Width when collapsed

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    const startWidth = width;
    const startX = e.pageX;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.pageX - startX);
      if (newWidth >= minWidth && newWidth <= 384) {
        setWidth(newWidth);
        setAdjustedWidth(newWidth);
      }
      if (newWidth <= minWidth) {
        return
      } else {
        setIsCollapsed(false);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setWidth(isCollapsed ? adjustedWidth : collapsedWidth);
  };

  return (
    <div 
      className="relative flex h-screen"
      style={{ width: isCollapsed ? collapsedWidth : width }}
    >
      <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed w-[inherit] h-screen">
        <div className={`p-4 ${isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`} style={{ minWidth: '150px' }}>

          <div className="flex justify-between items-center">

            <Input placeholder="Search..." className="border px-2 py-1 text-sm" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New Folder</DropdownMenuItem>
                <DropdownMenuItem>New Snippet</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="folder1">
              <AccordionTrigger>Folder 1</AccordionTrigger>
              <AccordionContent>
                <div className="pl-4">Snippet 1</div>
                <div className="pl-4">Snippet 2</div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="folder2">
              <AccordionTrigger>Folder 2</AccordionTrigger>
              <AccordionContent>
                <div className="pl-4">Snippet 3</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Collapsed state plus button */}
        {isCollapsed && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New Folder</DropdownMenuItem>
                <DropdownMenuItem>New Snippet</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}



        {/* Resizer handle with toggle button */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center">
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-300 dark:hover:bg-gray-600"
          onMouseDown={startResizing}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm"
          onClick={toggleCollapse}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      </div>
      
      
    </div>
  );
} 