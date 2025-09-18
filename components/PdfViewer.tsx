

import React from 'react';
import { ZoomInIcon, ZoomOutIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

type Props = {
    pdfUrl?: string | null;
    title?: string;
};

export default function PdfViewer({ pdfUrl, title = 'Purchase_Contract.pdf' }: Props) {
    const src = pdfUrl || '';
    return (
        <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-gray-50">
            <div className="bg-gray-200 px-4 py-2 flex items-center justify-between border-b border-gray-300">
                <span className="text-sm font-medium text-gray-700">{title}</span>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-white border border-gray-300 rounded">
                        <button className="p-1.5 text-gray-600 hover:bg-gray-100 border-r border-gray-300 disabled:opacity-50" disabled>
                            <ZoomOutIcon className="h-5 w-5" />
                        </button>
                        <span className="px-3 text-sm text-gray-800">100%</span>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-100 border-l border-gray-300 disabled:opacity-50" disabled>
                            <ZoomInIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex items-center bg-white border border-gray-300 rounded">
                        <button className="p-1.5 text-gray-600 hover:bg-gray-100 border-r border-gray-300 disabled:opacity-50" disabled>
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <span className="px-3 text-sm text-gray-800">1 / 1</span>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-100 border-l border-gray-300 disabled:opacity-50" disabled>
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <a href={src || '#'} download={title} className="p-1.5 text-gray-600 hover:bg-gray-100 bg-white border border-gray-300 rounded" aria-disabled={!src}>
                        <DownloadIcon className="h-5 w-5" />
                    </a>
                </div>
            </div>
            <div className="bg-white h-[600px] overflow-auto">
                {src ? (
                    <iframe src={src} title={title} className="w-full h-full border-0" />
                ) : (
                    <div className="p-6 text-gray-500">No document available</div>
                )}
            </div>
        </div>
    );
}