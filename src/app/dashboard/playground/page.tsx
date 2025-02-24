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
import { getSnippetById, updateSnippet } from "@/lib/db";
import { SnippetDetails } from "@/types/snippets";
import { DataContext } from "@/components/providers/dataProvider";
export default function Playground() {
    const [snippet, setSnippet] = useState<SnippetDetails | null>(null);
    const {snippets, setSnippets} = useContext(DataContext);
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");
    const [isPreview, setIsPreview] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const searchParams = useSearchParams();
    const snippetId = searchParams.get("snippet");
    const router = useRouter();
    
    useEffect(() => {
        if (snippetId) {
            const loadSnippet = async () => {
                const snippet = await getSnippetById(parseInt(snippetId));
                if (snippet) {
                    setSnippet(snippet);
                    setHtml(snippet.code.html);
                    setCss(snippet.code.css);
                    setJs(snippet.code.js);
                    setTitle(snippet.title);
                    setDescription(snippet.description);
                    setTags(snippet.tags);
                }
            };
            loadSnippet();
        }
    }, [snippetId]);

    const handleSave = async () => {

            await updateSnippet(parseInt(snippetId), {
                title: title,
                description: description,
                tags: tags,
                code: {
                    html: html,
                    css: css,
                    js: js,
                },
                
            });
    };
    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            const tag = (e.target as HTMLInputElement).value.trim();
            if(tag !== "" && !tags.includes(tag)){
                setTags([...tags, tag]);
                (e.target as HTMLInputElement).value = "";
            }
        }
    };
    const moveToTrash = async () => {
        const updatedSnippet: SnippetDetails = {
            ...snippet!,
            isTrash: true,
        }
        const updatedSnippetId = await updateSnippet(parseInt(snippetId!), updatedSnippet);
        if(updatedSnippetId) {
            setSnippets(snippets.map(s => 
                s.id === parseInt(snippetId!) ? updatedSnippet : s
            ));
            router.push('/dashboard');
        }
    }
    const handleFavorite = async () => {
        const updatedSnippet: SnippetDetails = {
            ...snippet!,
            isFavorite: !snippet?.isFavorite,
        }
        const updatedSnippetId = await updateSnippet(parseInt(snippetId!), updatedSnippet);
        if(updatedSnippetId) {
            setSnippet(updatedSnippet);
            setSnippets(snippets.map(s => 
                s.id === parseInt(snippetId!) ? updatedSnippet : s
            ));
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
                    <Dialog>
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
                                    <Input type="text" id="name" placeholder="Snippet Name" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input type="text" id="description" placeholder="Snippet Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <Input type="text" placeholder="Snippet Tags" onKeyDown={handleAddTag} />
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
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
                                <Button type="submit" onClick={handleSave}>Save</Button>
                                {snippetId && <Button variant="destructive" type="submit" onClick={moveToTrash}>Move to Trash</Button>}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                
                <div className="h-[calc(100%-4rem)]">
                    {isPreview ? (
                        <div className="p-4 h-full">
                            <PreviewPanel html={html} css={css} js={js} />
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
                                    code={html} 
                                    setCode={setHtml} 
                                />
                            </TabsContent>
                            <TabsContent value="css" className="h-[calc(100%-3rem)]">
                                <CodePanel 
                                    title="" 
                                    language="css" 
                                    code={css} 
                                    setCode={setCss} 
                                />
                            </TabsContent>
                            <TabsContent value="javascript" className="h-[calc(100%-3rem)]">
                                <CodePanel 
                                    title="" 
                                    language="javascript" 
                                    code={js} 
                                    setCode={setJs} 
                                />
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </Card>
        </div>
    );
}
