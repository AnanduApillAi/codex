"use client";
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

type CodePanelProps = {
    title: string;
    language: string;
    code: string;
    setCode: (code: string) => void;
};

export default function CodePanel({title, language, code, setCode}: CodePanelProps) {
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

    return (
        <div className="flex flex-col flex-1">
            <h3 className="mb-2">{title}</h3>
            <div className="flex-1 border rounded-lg overflow-hidden">
                <CodeMirror
                    value={code}
                    height="100%"
                    theme={vscodeDark}
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
                    className="h-full"
                />
            </div>
        </div>
    );
}
