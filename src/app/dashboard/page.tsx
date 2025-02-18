'use client';
import { useState } from 'react';
import { SnippetGrid } from '@/components/SnippetGrid';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';
import { SearchAndFilter, FilterOptions } from '@/components/SearchAndFilter';
import Dashboard from '@/components/DashBoard';

// Define the SnippetDetails interface
interface SnippetData {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
}

export default function DashboardPage() {

  return (
    <Dashboard />
  );
} 