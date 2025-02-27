"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodePanel from "@/components/playground/CodePanel";
import PreviewPanel from "@/components/playground/previewPanel";
import { Badge } from "@/components/ui/badge";
import { Code2, Eye, Star, X, Save, Trash2, ChevronLeft, Loader2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function Playground() {
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
                }
            } catch (error) {
                console.error(error);
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
                }
            } catch (error) {
                console.error(error);
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
        } catch (error) {
            console.error(error);
            setSnippets(snippets.map(s => 
                s.id === parseInt(snippetId) ? snippet : s
            ));
            setSnippet(snippet);
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
            } catch (error) {
                console.error(error);
                setSnippet(snippet);
                setSnippets(snippets.map(s => 
                    s.id === parseInt(snippetId) ? snippet : s
                ));
            }
        }
        else{
            setSnippet({
                ...snippet,
                isFavorite: !snippet.isFavorite,
            }); 
        }
    }
    
    return (
        <div className="h-screen p-4 w-full">
            <Card className="h-full flex flex-col overflow-hidden border-border">
                <div className="flex items-center justify-between p-4 border-b bg-card">
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
                    
                    <div className="flex items-center gap-2">
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
                                <Button size="sm" className="gap-1.5">
                                    <Save className="h-4 w-4" />
                                    Save
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Save Snippet</DialogTitle>
                                    <DialogDescription>
                                        Add details to your code snippet for better organization.
                                    </DialogDescription>
                                </DialogHeader>   
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Title</Label>
                                        <Input 
                                            type="text" 
                                            id="name" 
                                            placeholder="My Awesome Snippet" 
                                            value={snippet?.title} 
                                            onChange={(e) => setSnippet({...snippet!, title: e.target.value})} 
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea 
                                            id="description" 
                                            placeholder="A brief description of what this snippet does" 
                                            value={snippet?.description} 
                                            onChange={(e) => setSnippet({...snippet!, description: e.target.value})}
                                            className="resize-none"
                                            rows={3}
                                        />
                                    </div>
                                    
                                    <div className="grid gap-2">
                                        <Label htmlFor="tags">Tags</Label>
                                        <div className="flex gap-2">
                                            <Input 
                                                type="text" 
                                                id="tags" 
                                                placeholder="Add a tag" 
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <Button 
                                                type="button" 
                                                variant="secondary" 
                                                onClick={handleAddTag}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {snippet?.tags.length === 0 && (
                                                <p className="text-sm text-muted-foreground">No tags added yet</p>
                                            )}
                                            {snippet?.tags.map((tag, index) => (
                                                <Badge 
                                                    key={index} 
                                                    variant="secondary"
                                                    className="flex items-center gap-1 px-2 py-1"
                                                >
                                                    {tag}
                                                    <X 
                                                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                                        onClick={() => handleRemoveTag(tag)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <DialogFooter className="flex items-center justify-between sm:justify-between">
                                    {snippetId && !snippet?.isTrash && (
                                        <Button 
                                            variant="outline" 
                                            type="button" 
                                            onClick={moveToTrash}
                                            className="gap-1.5"
                                            disabled={isSaving}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Move to Trash
                                        </Button>
                                    )}
                                    <Button 
                                        type="submit" 
                                        onClick={handleSave}
                                        disabled={isSaving}
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
