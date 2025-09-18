import React, { useRef } from 'react';
import { DownloadIcon, BoldIcon, ItalicIcon, UnderlineIcon } from './icons';

interface RichTextEditorProps {
    title: string;
    content: string;
    onChange: (newContent: string) => void;
}

const ToolbarButton: React.FC<{ onClick: () => void; children: React.ReactNode, 'aria-label': string }> = (props) => (
    <button
        type="button"
        onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus
        onClick={props.onClick}
        className="p-2 text-gray-600 rounded-md hover:bg-gray-200 hover:text-gray-800"
        aria-label={props['aria-label']}
    >
        {props.children}
    </button>
);


export const RichTextEditor: React.FC<RichTextEditorProps> = ({ title, content, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const handleFormat = (command: string) => {
        document.execCommand(command, false);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleDownload = () => {
        // In a real app, this would trigger a PDF generation library like jsPDF or a server-side process.
        alert('PDF download functionality is not implemented in this demo.');
    };

    return (
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <div className="flex items-center space-x-1">
                    <ToolbarButton onClick={() => handleFormat('bold')} aria-label="Bold"><BoldIcon className="w-5 h-5" /></ToolbarButton>
                    <ToolbarButton onClick={() => handleFormat('italic')} aria-label="Italic"><ItalicIcon className="w-5 h-5" /></ToolbarButton>
                    <ToolbarButton onClick={() => handleFormat('underline')} aria-label="Underline"><UnderlineIcon className="w-5 h-5" /></ToolbarButton>
                     <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <ToolbarButton onClick={handleDownload} aria-label="Download as PDF"><DownloadIcon className="w-5 h-5" /></ToolbarButton>
                </div>
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onChange(e.currentTarget.innerHTML)}
                className="prose max-w-none p-4 h-96 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-b-lg"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};