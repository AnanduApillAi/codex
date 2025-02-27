import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type PreviewPanelProps = {
    html: string;
    css: string;
    js: string;
};

export default function PreviewPanel({ html, css, js }: PreviewPanelProps) {
    const [preview, setPreview] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        
        // Small delay to show loading state for better UX
        const timer = setTimeout(() => {
            setPreview(`
                <html style="background-color: transparent;">
                    <head>
                        <style>${css}</style>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="margin: 0; overflow: auto; height: 100%;">
                        ${html}
                        <script>${js}</script>
                    </body>
                </html>
            `);
            setLoading(false);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [html, css, js]);

    return (
        <div className="w-full h-full rounded-lg border bg-background relative overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}
            
            <iframe 
                srcDoc={preview}
                className="w-full h-full"
                sandbox="allow-scripts"
                title="preview"
            />
        </div>
    );
}