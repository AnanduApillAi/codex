"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodePanel from "@/components/playground/CodePanel";
import PreviewPanel from "@/components/playground/previewPanel";
import { Badge } from "@/components/ui/badge";
import { Code2, Eye, Star, X, Trash2, ChevronLeft, Loader2, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { getSnippetById, updateSnippet, addSnippet } from "@/lib/db";
import { SnippetDetails } from "@/types/snippets";
import { DataContext } from "@/components/providers/dataProvider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import React, { Suspense } from 'react';
import Spinner from "@/components/ui/spinner";

export default function PlaygroundPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <Playground />
        </Suspense>
    );
}

function Playground() {
    const [snippet, setSnippet] = useState<SnippetDetails>(
        {
            title: "",
            description: "",
            tags: [],
            code: {
                html: "",
                css: "",
                js: ""
            },
            isFavorite: false,
            isTrash: false
        }
    );
    const {snippets, setSnippets} = useContext(DataContext);
    const [isPreview, setIsPreview] = useState(false);
    const searchParams = useSearchParams();
    const snippetId = searchParams.get("snippet");
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        if (snippetId) {
            const loadSnippet = async () => {
                const snippet = await getSnippetById(parseInt(snippetId));
                if(snippet){
                    setSnippet(snippet);
                }
            };
            loadSnippet();
        }
        else{
            setSnippet({
                title: "",
                description: "",
                tags: [],
                code: {
                    html: "",
                    css: "",
                    js: ""
                },
                isFavorite: false,
                isTrash: false
            });
        }
    }, [snippetId]);

    
    const handleSave = async () => {
        setIsSaving(true);
        
        if(snippetId){
            try {
                const response = await updateSnippet(parseInt(snippetId), {...snippet, isTrash: false});
                if(response){
                    setSnippets(snippets.map(s => 
                    s.id === parseInt(snippetId) ? {...snippet, isTrash: false} : s
                    ));
                    toast.success('Snippet updated successfully');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to update snippet');
            }
            finally{
                setDialogOpen(false);
                setIsSaving(false);
            }
        }
        else{
            try {
                const newSnippet = await addSnippet(snippet);
                if(newSnippet){
                    setSnippets([...snippets, newSnippet]);
                    router.push(`/dashboard/playground?snippet=${newSnippet.id}`);
                    toast.success('Snippet created successfully');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to create snippet');
            }
            finally{
                setDialogOpen(false);
                setIsSaving(false);
            }
        }
    };
    
    const handleRemoveTag = (tag: string) => {
        setSnippet({
            ...snippet,
            tags: snippet.tags.filter(t => t !== tag) || []
        });
    };
    
    const handleAddTag = () => {
        const tag = newTag.trim();
        if(tag !== "" && !snippet.tags.includes(tag)){
            setSnippet({
                ...snippet,
                tags: [...snippet.tags, tag]
            });
            setNewTag("");
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            e.preventDefault();
            handleAddTag();
        }
    };
    
    const moveToTrash = async () => {
        if(!snippetId || !snippet) return;
        setIsSaving(true);
        
        const updatedSnippet: SnippetDetails = {
            ...snippet,
            isFavorite: false,
            isTrash: true,
        }
        setSnippet(updatedSnippet);
        setSnippets(snippets.map(s => 
            s.id === parseInt(snippetId) ? updatedSnippet : s
        ));
        try {
            await updateSnippet(parseInt(snippetId), updatedSnippet);
            toast.success('Snippet moved to trash successfully');
        } catch (error) {
            console.error(error);
            setSnippets(snippets.map(s => 
                s.id === parseInt(snippetId) ? snippet : s
            ));
            setSnippet(snippet);
            toast.error('Failed to move snippet to trash');
        }
        finally{
            setDialogOpen(false);
            setIsSaving(false);
        }
    }
    
    const handleFavorite = async () => {
        if(snippetId){
            const updatedSnippet: SnippetDetails = {
                ...snippet,
                isFavorite: !snippet.isFavorite,
            }
            setSnippet(updatedSnippet);
            setSnippets(snippets.map(s => 
                s.id === parseInt(snippetId) ? updatedSnippet : s
            ));
            try {
                await updateSnippet(parseInt(snippetId), updatedSnippet);
                if(updatedSnippet.isFavorite){
                    toast.success('Snippet added to favorites successfully');
                }
                else{
                    toast.success('Snippet removed from favorites successfully');
                }
            } catch (error) {
                console.error(error);
                setSnippet(snippet);
                setSnippets(snippets.map(s => 
                    s.id === parseInt(snippetId) ? snippet : s
                ));
                toast.error('Failed to update snippet');
            }
        }
        else{
            setSnippet({
                ...snippet,
                isFavorite: !snippet.isFavorite,
            }); 
            if(snippet.isFavorite){
                toast.success('Snippet added to favorites successfully');
            }
            else{
                toast.success('Snippet removed from favorites successfully');
            }
        }
    }
    
    return (
        <div className="h-screen p-4 w-full">
            <Card className="h-full flex flex-col overflow-hidden border-border">
                <div className="flex flex-col sm:flex-row items-stretch gap-y-4 sm:items-center justify-between p-4 border-b bg-card">
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.push('/dashboard')}
                            className="rounded-full"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h2 className="font-semibold text-lg">
                            {snippet.title || "Untitled Snippet"}
                        </h2>
                        {snippet.isFavorite && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 justify-end">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsPreview(!isPreview)}
                            className="gap-1.5"
                        >
                            {isPreview ? (
                                <>
                                    <Code2 className="h-4 w-4" />
                                    Code
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4" />
                                    Preview
                                </>
                            )}
                        </Button>
                        
                        <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleFavorite}
                            className="gap-1.5"
                        >
                            <Star className={`h-4 w-4 ${snippet.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                            {snippet.isFavorite ? "Favorited" : "Favorite"}
                        </Button>
                        
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors">
                                    <Pencil className="h-3.5 w-3.5" />
                                    Update
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
                                <DialogHeader className="text-left">
                                    <DialogTitle className="text-xl">Save Snippet</DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground">
                                        Add details to your code snippet for better organization.
                                    </DialogDescription>
                                </DialogHeader>   
                                
                                <div className="flex-1 overflow-y-auto p-2 my-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-medium">Title</Label>
                                            <Input 
                                                type="text" 
                                                id="name" 
                                                placeholder="My Awesome Snippet" 
                                                value={snippet?.title} 
                                                onChange={(e) => setSnippet({...snippet!, title: e.target.value})} 
                                                className="w-full rounded-lg"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                            <Textarea 
                                                id="description" 
                                                placeholder="A brief description of what this snippet does" 
                                                value={snippet?.description} 
                                                onChange={(e) => setSnippet({...snippet!, description: e.target.value})}
                                                className="resize-none rounded-lg min-h-[80px]"
                                                rows={3}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                                            <div className="flex gap-2">
                                                <Input 
                                                    type="text" 
                                                    id="tags" 
                                                    placeholder="Add a tag" 
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    className="flex-1 rounded-lg"
                                                />
                                                <Button 
                                                    type="button" 
                                                    variant="secondary" 
                                                    onClick={handleAddTag}
                                                    className="shrink-0"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 mt-2 max-h-[120px] overflow-y-auto p-2 rounded-lg bg-muted/30">
                                                {snippet?.tags.length === 0 && (
                                                    <p className="text-sm text-muted-foreground p-2">No tags added yet</p>
                                                )}
                                                {snippet?.tags.map((tag, index) => (
                                                    <Badge 
                                                        key={index} 
                                                        variant="secondary"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                                                    >
                                                        {tag}
                                                        <X 
                                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                                                            onClick={() => handleRemoveTag(tag)}
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <DialogFooter className="flex items-center justify-between sm:justify-between flex-col border-t pt-4 mt-auto">
                                    {snippetId && !snippet?.isTrash && (
                                        <Button 
                                            variant="outline" 
                                            type="button" 
                                            onClick={moveToTrash}
                                            className="gap-1.5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                                            disabled={isSaving}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="hidden sm:inline">Move to Trash</span>
                                        </Button>
                                    )}
                                    <Button 
                                        type="submit" 
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="min-w-[100px] rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>Save</>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                    {isPreview ? (
                        <div className="p-4 h-full">
                            <PreviewPanel 
                                html={snippet?.code.html || ""} 
                                css={snippet?.code.css || ""} 
                                js={snippet?.code.js || ""} 
                            />
                        </div>
                    ) : (
                        <Tabs defaultValue="html" className="h-full flex flex-col">
                            <div className="px-4 pt-2">
                                <TabsList className="w-full justify-start">
                                    <TabsTrigger value="html" className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                        HTML
                                    </TabsTrigger>
                                    <TabsTrigger value="css" className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                                        CSS
                                    </TabsTrigger>
                                    <TabsTrigger value="javascript" className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                        JavaScript
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                            <div className="flex-1 p-4 pt-2">
                                <TabsContent value="html" className="h-full m-0 mt-0 p-0">
                                    <CodePanel 
                                        title="" 
                                        language="html" 
                                        code={snippet?.code.html || ""} 
                                        setCode={(code: string) => setSnippet({...snippet!, code: {...snippet!.code, html: code}})} 
                                    />
                                </TabsContent>
                                <TabsContent value="css" className="h-full m-0 mt-0 p-0">
                                    <CodePanel 
                                        title="" 
                                        language="css" 
                                        code={snippet?.code.css || ""} 
                                        setCode={(code: string) => setSnippet({...snippet!, code: {...snippet!.code, css: code}})} 
                                    />
                                </TabsContent>
                                <TabsContent value="javascript" className="h-full m-0 mt-0 p-0">
                                    <CodePanel 
                                        title="" 
                                        language="javascript" 
                                        code={snippet?.code.js || ""} 
                                        setCode={(code: string) => setSnippet({...snippet!, code: {...snippet!.code, js: code}})} 
                                    />
                                </TabsContent>
                            </div>
                        </Tabs>
                    )}
                </div>
            </Card>
        </div>
    );
}
