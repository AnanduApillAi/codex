"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodePanel from "@/components/playground/CodePanel";
import PreviewPanel from "@/components/playground/previewPanel";
import { Badge } from "@/components/ui/badge";
import { Code2, Eye, Star, X } from "lucide-react";
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
            }
        }
    };
    const handleRemoveTag = (tag: string) => {
        setSnippet({
            ...snippet,
            tags: snippet.tags.filter(t => t !== tag) || []
        });
    };
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            const tag = (e.target as HTMLInputElement).value.trim();
                if(tag !== "" && !snippet.tags.includes(tag)){
                    setSnippet({
                        ...snippet,
                        tags: [...snippet.tags, tag]
                    });
                    (e.target as HTMLInputElement).value = "";
                }
        }
    };
    const moveToTrash = async () => {
        if(!snippetId || !snippet) return;
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
            <Card className="h-full">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Playground</h2>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsPreview(!isPreview)}
                    >
                        {isPreview ? (
                            <>
                                <Code2 className="h-4 w-4 mr-2" />
                                Code
                            </>
                        ) : (
                            <>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </>
                        )}
                    </Button>
                    
                    <Button size="sm" variant="outline" onClick={handleFavorite}>
                        {snippet?.isFavorite ? (
                            <Star className="h-4 w-4 mr-2" fill="yellow" />
                        ) : (
                            <Star className="h-4 w-4 mr-2" />
                        )}
                    </Button>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                Save
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Snippet</DialogTitle>
                                <DialogDescription>Add details to your snippet</DialogDescription>
                            </DialogHeader>   
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input type="text" id="name" placeholder="Snippet Name" value={snippet?.title} onChange={(e) => setSnippet({...snippet!, title: e.target.value})} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input type="text" id="description" placeholder="Snippet Description" value={snippet?.description} onChange={(e) => setSnippet({...snippet!, description: e.target.value})} />
                                </div>
                                <Input type="text" placeholder="Snippet Tags" onKeyDown={handleAddTag} />
                                <div className="flex flex-wrap gap-2">
                                    {snippet?.tags.map((tag, index) => (
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
                            </div>
                            
                            <DialogFooter>
                                <Button type="submit" onClick={handleSave}>{!snippet?.isTrash ? "Save" : "Save & Restore"}</Button>
                                {snippetId && !snippet?.isTrash && <Button variant="destructive" type="submit" onClick={moveToTrash}>Move to Trash</Button>}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                
                <div className="h-[calc(100%-4rem)]">
                    {isPreview ? (
                        <div className="p-4 h-full">
                            <PreviewPanel html={snippet?.code.html || ""} css={snippet?.code.css || ""} js={snippet?.code.js || ""} />
                        </div>
                    ) : (
                        <Tabs defaultValue="html" className="p-4 h-full">
                            <TabsList>
                                <TabsTrigger value="html">HTML</TabsTrigger>
                                <TabsTrigger value="css">CSS</TabsTrigger>
                                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                            </TabsList>
                            <TabsContent value="html" className="h-[calc(100%-3rem)]">
                                <CodePanel 
                                    title="" 
                                    language="html" 
                                    code={snippet?.code.html || ""} 
                                    setCode={(code: string) => setSnippet({...snippet!, code: {...snippet!.code, html: code}})} 
                                />
                            </TabsContent>
                            <TabsContent value="css" className="h-[calc(100%-3rem)]">
                                <CodePanel 
                                    title="" 
                                    language="css" 
                                    code={snippet?.code.css || ""} 
                                    setCode={(code: string) => setSnippet({...snippet!, code: {...snippet!.code, css: code}})} 
                                />
                            </TabsContent>
                            <TabsContent value="javascript" className="h-[calc(100%-3rem)]">
                                <CodePanel 
                                    title="" 
                                    language="javascript" 
                                    code={snippet?.code.js || ""} 
                                    setCode={(code: string) => setSnippet({...snippet!, code: {...snippet!.code, js: code}})} 
                                />
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </Card>
        </div>
    );
}
