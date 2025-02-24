'use client';
import { getAllSnippets } from "@/lib/db";
import { SnippetDetails } from "@/types/snippets";
import { createContext, useEffect, useState } from "react";

export const DataContext = createContext<{
    snippets: SnippetDetails[];
    setSnippets: (snippets: SnippetDetails[]) => void;
}>({
    snippets: [],
    setSnippets: () => {},
});
export function DataProvider({ children }: { children: React.ReactNode }) {
    const [snippets, setSnippets] = useState<SnippetDetails[]>([]);

    useEffect(()=>{
        console.log('DataProvider mounted');
        const fetchSnippets = async () => {
            const snippets = await getAllSnippets();
            console.log(snippets,'snippets');
            setSnippets(snippets);
        }
        fetchSnippets();
    },[]);

    return (
        <DataContext.Provider value={{snippets, setSnippets}}>
            {children}
        </DataContext.Provider>
    );
}
