
import React, { useState, useEffect, useCallback } from 'react';

import { SearchIcon, DocumentIcon, ChevronDownIcon, EyeIcon, DownloadIcon, CloseIcon, ZoomInIcon, ZoomOutIcon, DocumentTextIcon } from './icons';
import titleSearchService from '../lib/services/titleSearch.service';

interface Doc {
    id: number;
    documentPath: string;
    documentName: string;
    documentType: string;
    summary: string | null;
    keywords: string;
    fileSize: string;
    notes?: string;
    fileExt?: string;
}

const DocumentViewerModal: React.FC<{ doc: Doc; onClose: () => void }> = ({ doc, onClose }) => {
    const [previewLoading, setPreviewLoading] = useState(true);
    const keywords = Array.isArray(doc.keywords) ? doc.keywords : (doc.keywords || '').split(',').map(k => k.trim()).filter(Boolean);

    const onIframeLoad = () => setPreviewLoading(false);

    const renderPreview = () => {
        // Both PDF and TXT files might be served with a 'Content-Disposition: attachment' header, forcing a download.
        // Using an embedding service like Google Docs Viewer is the most reliable way to display the content in an iframe instead.
        if (doc.documentPath && (doc.fileExt === 'pdf' || doc.fileExt === 'txt')) {
            const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(doc.documentPath)}&embedded=true`;
            return (
                <div className="relative w-full h-full">
                    {previewLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        </div>
                    )}
                    <iframe src={viewerUrl} className="w-full h-full border-0" frameBorder="0" title={doc.documentName} onLoad={onIframeLoad} />
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center h-full text-gray-600 p-4">
                <p>Preview is not available for this file type.</p>
            </div>
        );
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Left Details Panel */}
                <aside className="w-1/3 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">
                    <header className="p-6 border-b border-gray-200">
                         <div className="flex items-center">
                            <DocumentIcon className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                            <div>
                                <h2 className="font-bold text-lg text-gray-800 break-words">{doc.documentName}</h2>
                                <p className="text-sm text-gray-500">{doc.documentType}</p>
                            </div>
                        </div>
                    </header>
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Details</h3>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between"><span>File Size:</span> <span className="font-medium text-gray-700">{doc.fileSize ? `${(parseFloat(doc.fileSize) * 1024).toFixed(2)} KB` : 'N/A'}</span></div>
                                <div className="flex justify-between"><span>File Extension:</span> <span className="font-medium text-gray-700">{doc.fileExt || 'N/A'}</span></div>
                            </div>
                        </div>
                        {doc.summary && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Summary</h3>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded-md border">{doc.summary}</p>
                            </div>
                        )}
                        {keywords.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map((kw, i) => (
                                        <span key={i} className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">{kw}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
                
                {/* Right Preview Panel */}
                <main className="flex-1 flex flex-col">
                    <header className="flex items-center justify-between p-3 border-b border-gray-200 bg-white flex-shrink-0">
                        <div className="flex items-center space-x-1">
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50" disabled><ZoomOutIcon className="w-5 h-5"/></button>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50" disabled><ZoomInIcon className="w-5 h-5"/></button>
                        </div>
                        <div className="flex items-center space-x-2">
                             <a href={doc.documentPath} download={doc.documentName} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                <DownloadIcon className="w-4 h-4" /><span>Download</span>
                            </a>
                            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-200">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </header>
                    <div className="flex-1 bg-gray-100 overflow-auto">
                       {renderPreview()}
                    </div>
                </main>
            </div>
        </div>
    );
};


const getFileTypeBadge = (fileExt?: string) => {
    if (!fileExt) return null;

    const ext = fileExt.toUpperCase();
    let style = "bg-gray-200 text-gray-700"; // default

    switch (fileExt) {
        case 'pdf':
            style = "bg-red-100 text-red-800";
            break;
        case 'txt':
            style = "bg-gray-200 text-gray-700";
            break;
        default:
             style = "bg-blue-100 text-blue-800";
             break;
    }

    return (
        <span className={`ml-2 px-1.5 py-0.5 text-xs font-medium rounded-md ${style}`}>
            {ext}
        </span>
    );
};

const DocumentRow: React.FC<{ doc: Doc; onSelect: (doc: Doc) => void }> = ({ doc, onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const parseKeywords = (kw: any): string[] => {
        if (!kw) return [];
        if (Array.isArray(kw)) return kw.filter(Boolean).map(String);
        if (typeof kw === 'string') {
            return kw.split(/,/).map(s => s.trim()).filter(Boolean);
        }
        return [];
    };

    const keywords = parseKeywords(doc.keywords);
    
     const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (doc.documentPath) {
            window.open(doc.documentPath, '_blank');
        }
    };
    
    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(doc);
    };

    const getFileIcon = (fileExt?: string) => {
        switch(fileExt) {
            case 'pdf':
                return <DocumentIcon className="w-6 h-6 text-red-500 flex-shrink-0" />;
            case 'txt':
                return <DocumentTextIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />;
            default:
                return <DocumentIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />;
        }
    };


    return (
        <div className="border-b border-gray-200">
            <div
                className="flex items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {getFileIcon(doc.fileExt)}
                <div className="ml-4 flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate" title={doc.documentName}>{doc.documentName}</p>
                    <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-500">{doc.documentType}</p>
                        {getFileTypeBadge(doc.fileExt)}
                    </div>
                </div>
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                     <button onClick={handleView} className="p-2 text-gray-500 rounded-full hover:bg-gray-200" title="View Document"><EyeIcon className="w-5 h-5"/></button>
                     <button onClick={handleDownload} className="p-2 text-gray-500 rounded-full hover:bg-gray-2