import { useEffect, useState } from "react";

type PreviewPanelProps = {
    html: string;
    css: string;
    js: string;
};

export default function PreviewPanel({ html, css, js }: PreviewPanelProps) {
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        setPreview(`
            <html style="background-color: transparent;">
                <head>
                    <style>${css}</style>
                </head>
                <body style="margin: 0;">
                    ${html}
                    <script>${js}</script>
                </body>
            </html>
        `);
    }, [html, css, js]);

    return (
        <iframe 
            srcDoc={preview}
            className="w-full h-full rounded-lg border bg-background"
            sandbox="allow-scripts"
            title="preview"
        />
    );
}