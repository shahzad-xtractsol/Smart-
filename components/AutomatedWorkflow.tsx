import React, { useState } from 'react';
import type { Property } from '../types';
import { generateTitleSummary, generateTitleCommitment } from '../lib/gemini';
import { SparklesIcon, ChevronDoubleRightIcon, RefreshIcon } from './icons';
import { RichTextEditor } from './RichTextEditor';
import AIGeneratedSummary from './steps/AIGeneratedSummary';

interface AutomatedWorkflowProps {
    property: Property;
    stageId: string;
    onAdvanceStep: (currentStageId: string, updates: Partial<Property>) => void;
    onUpdateProperty: (updates: Partial<Property>) => void;
}

const LoadingState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="flex justify-center items-center mb-4">
            <RefreshIcon className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{message}</h3>
        <p className="text-gray-500 mt-2">This may take a few moments. Please don't close this window.</p>
    </div>
);

const Generator: React.FC<{
    title: string;
    description: string;
    buttonText: string;
    onGenerate: () => Promise<void>;
}> = ({ title, description, buttonText, onGenerate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await onGenerate();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingState message={`Generating ${title}...`} />;
    }

    return (
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                    <SparklesIcon className="w-12 h-12 text-blue-600" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">{description}</p>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            <button
                onClick={handleClick}
                className="inline-flex items-center space-x-2 px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
                <SparklesIcon className="w-5 h-5" />
                <span>{buttonText}</span>
            </button>
        </div>
    );
};

const Reviewer: React.FC<{
    title: string;
    initialContent: string;
    onAdvance: (editedContent: string) => void;
}> = ({ title, initialContent, onAdvance }) => {
    const [content, setContent] = useState(initialContent);

    return (
        <div className="w-full">
            {/* <RichTextEditor title={title} content={content} o
            nChange={setContent} /> */}
            <AIGeneratedSummary id='612' title={title}  />
            
        </div>
    );
};

const GenericActionStep: React.FC<{ title: string, description: string, buttonText: string, onAction: () => void }> = ({ title, description, buttonText, onAction }) => (
     <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">{description}</p>
        <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
        >
            <span>{buttonText}</span>
             <ChevronDoubleRightIcon className="w-5 h-5" />
        </button>
    </div>
)


export const AutomatedWorkflow: React.FC<AutomatedWorkflowProps> = (props) => {
    const { property, stageId, onAdvanceStep, onUpdateProperty } = props;

    // Helper to approve current stage and persist progress via onAdvanceStep
    const approveStage = (stage: string, additionalUpdates: Partial<Property> = {}) => {
        // Default: mark the stage as Completed in closingProgress if present
        const closingProgressUpdate: any = {};
        if (stage === 'aiSummary') {
            closingProgressUpdate.closingProgress = {
                ...property.closingProgress,
                aiSummary: { ...property.closingProgress?.aiSummary, status: 'Completed' }
            };
        } else if (stage === 'titleCommitment') {
            closingProgressUpdate.closingProgress = {
                ...property.closingProgress,
                titleCommitment: { ...property.closingProgress?.titleCommitment, status: 'Completed' }
            };
        } else if (stage === 'finalSettlement') {
            closingProgressUpdate.closingProgress = {
                ...property.closingProgress,
                finalSettlement: { ...property.closingProgress?.finalSettlement, status: 'Completed' }
            };
        }

        onAdvanceStep(stage, {
            ...closingProgressUpdate,
            ...additionalUpdates
        });
    };

    const handleGenerateSummary = async () => {
        const summary = await generateTitleSummary();
        onUpdateProperty({
            aiSummaryContent: summary,
            closingProgress: { 
                ...property.closingProgress, 
                aiSummary: { ...property.closingProgress.aiSummary, status: 'In Progress' } 
            }
        });
    };
    
    const handleGenerateCommitment = async () => {
        const commitment = await generateTitleCommitment();
        onUpdateProperty({
            titleCommitmentContent: commitment,
            closingProgress: { 
                ...property.closingProgress, 
                titleCommitment: { ...property.closingProgress.titleCommitment, status: 'In Progress' } 
            }
        });
    };

    const renderContent = () => {
        switch (stageId) {
            case 'aiSummary':
                return property.aiSummaryContent ? (
                        <div className="w-full">
                            <AIGeneratedSummary id='796'/>
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => approveStage('aiSummary', { aiSummaryContent: property.aiSummaryContent })}
                                    className="inline-flex items-center space-x-2 px-6 py-3 text-base font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700"
                                >
                                    <span>Approve & Continue to Next Step</span>
                                    <ChevronDoubleRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                        <Generator
                            title="Generate AI Title Summary"
                            description="Use AI to analyze all documents and data for this property. It will generate a professional summary, highlighting key information and potential risks."
                            buttonText="Generate AI Summary"
                            onGenerate={handleGenerateSummary}
                        />
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => approveStage('aiSummary')}
                                className="inline-flex items-center space-x-2 px-6 py-3 text-base font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700"
                            >
                                <span>Approve & Continue to Next Step</span>
                                <ChevronDoubleRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                        </div>
                    );
            case 'titleCommitment':
                return property.titleCommitmentContent ? (
                    <div className="w-full">
                        <Reviewer
                            title="Title Commitment"
                            initialContent={property.titleCommitmentContent}
                            onAdvance={(editedContent) => onAdvanceStep('titleCommitment', { titleCommitmentContent: editedContent })}
                        />
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => approveStage('titleCommitment', { titleCommitmentContent: property.titleCommitmentContent })}
                                className="inline-flex items-center space-x-2 px-6 py-3 text-base font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700"
                            >
                                <span>Approve & Continue to Next Step</span>
                                <ChevronDoubleRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                    <Generator
                        title="Create Title Commitment"
                        description="The AI summary has been reviewed. The next step is to generate the official Title Commitment document based on the findings."
                        buttonText="Generate Title Commitment"
                        onGenerate={handleGenerateCommitment}
                    />
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => approveStage('titleCommitment')}
                            className="inline-flex items-center space-x-2 px-6 py-3 text-base font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700"
                        >
                            <span>Approve & Continue to Next Step</span>
                            <ChevronDoubleRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                    </div>
                );
            case 'finalSettlement':
                 return <GenericActionStep 
                    title="Create Final Settlement Statement"
                    description="Now, let's proceed to create the Final Settlement Statement (Closing Disclosure)."
                    buttonText="Create Statement"
                    onAction={() => onAdvanceStep('finalSettlement', {})}
                />;
            default:
                return <div className="text-center text-gray-500">This automated step is not configured yet.</div>;
        }
    };

    return (
        <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm h-100 flex flex-col items-center justify-center">
            {renderContent()}
        </div>
    );
};