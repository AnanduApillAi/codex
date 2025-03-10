"use client";
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type CodePanelProps = {
    title: string;
    language: string;
    code: string;
    setCode: (code: string) => void;
};

export default function CodePanel({title, language, code, setCode}: CodePanelProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const getLanguageExtension = (lang: string) => {
        switch (lang) {
            case 'html':
                return html();
            case 'css':
                return css();
            case 'javascript':
                return javascript();
            default:
                return html();
        }
    };

    // Get language display name
    const getLanguageDisplayName = (lang: string) => {
        switch (lang) {
            case 'html':
                return 'HTML';
            case 'css':
                return 'CSS';
            case 'javascript':
                return 'JavaScript';
            default:
                return lang.toUpperCase();
        }
    };

    // Get language color
    const getLanguageColor = (lang: string) => {
        switch (lang) {
            case 'html':
                return 'text-blue-500';
            case 'css':
                return 'text-pink-500';
            case 'javascript':
                return 'text-yellow-500';
            default:
                return 'text-primary';
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col flex-1 h-full">
            {title && <h3 className="mb-2 font-medium">{title}</h3>}
            
            <div className="flex-1 border rounded-lg overflow-hidden flex flex-col bg-card">
                <div className="flex items-center px-4 py-2 border-b bg-muted/50">
                    <div className={`text-sm font-medium ${getLanguageColor(language)}`}>
                        {getLanguageDisplayName(language)}
                    </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                    <CodeMirror
                        value={code}
                        height="100%"
                        theme={theme === 'dark' ? vscodeDark : 'light'}
                        extensions={[getLanguageExtension(language)]}
                        onChange={(value) => setCode(value)}
                        basicSetup={{
                            lineNumbers: true,
                            highlightActiveLineGutter: true,
                            highlightSpecialChars: true,
                            foldGutter: true,
                            dropCursor: true,
                            allowMultipleSelections: true,
                            indentOnInput: true,
                            bracketMatching: true,
                            closeBrackets: true,
                            autocompletion: true,
                            rectangularSelection: true,
                            crosshairCursor: true,
                            highlightActiveLine: true,
                            highlightSelectionMatches: true,
                            closeBracketsKeymap: true,
                            defaultKeymap: true,
                            searchKeymap: true,
                            historyKeymap: true,
                            foldKeymap: true,
                            completionKeymap: true,
                            lintKeymap: true,
                        }}
                        className="h-full font-mono text-sm"
                    />
                </div>
            </div>
        </div>
    );
}
