import React, { useState, useEffect, ReactNode } from 'react';
import { CLOSING_STAGES, MOCK_USERS } from '../constants';
import { userTypes } from '../lib/userTypes';
import type { Property, ClosingProgressItem, User, ClosingStage, ClosingStageStatus, ConfigurableRole, RoleVisibilitySettings } from '../types';
import { AgentInformationForm } from './AgentInformationForm';
import { PropertyInfoSidebar } from './PropertyInfoSidebar';
import { Step1ContractDetails } from './steps/Step1ContractDetails';
import { Step3MortgageLiens } from './steps/Step3MortgageLiens';
import { Step4Judgements } from './steps/Step4Judgements';
import { Step5FinalReview } from './steps/Step5FinalReview';
import { CheckCircleIcon, ClockIcon, CircleIcon, ChevronDoubleRightIcon, ChevronDoubleLeftIcon, SettingsIcon, UserCircleIcon, EyeIcon, FullScreenIcon, CloseIcon } from './icons';
import { StepActionPlaceholder } from './steps/StepActionPlaceholder';
import { AutomatedWorkflow } from './AutomatedWorkflow';
import { TitleSearchDataView } from './TitleSearchDataView';
import { GenericStepView } from './GenericStepView';
import { WorkflowConfigModal } from './WorkflowConfigModal';
import permissionService from '../lib/services/permission.service';
import CircularLoader from './CircularLoader';
import EmptyList from './EmptyList';
import { VisibilityConfigModal } from './VisibilityConfigModal';
import { MarketingRequestView } from './steps/MarketingRequestView';
import { SellerAuthorizationView } from './steps/SellerAuthorizationView';
import { SchedulingView } from './steps/SchedulingView';
import { PreliminaryTitleSearchView } from './steps/PreliminaryTitleSearchView';
import AIGeneratedSummary from './steps/AIGeneratedSummary';


interface PropertyDetailViewProps {
    property: Property;
    onUpdateProperty: (property: Property) => void;
    currentUser: User;
    onArchiveProperty: (id: number) => void;
}

import StepWrapper from './StepWrapper';
import titleSearchService from '../lib/services/titleSearch.service';
import UploadResultDialog from './UploadResultDialog';
import {EarnestMoneyView} from './steps/EarnestMoneyView';

const getStageContent = (
    stageId: string,
    property: Property,
    onUpdateProperty: (p: Property) => void,
    onAdvance?: (currentStageId: string, updates?: Partial<Property>) => void
): ReactNode => {
    const stage = CLOSING_STAGES.find(s => s.id === stageId);
    if (!stage) return <GenericStepView title="Unknown Step" />;

    const componentMap: Record<string, React.ReactNode> = {
        'marketingRequest': <MarketingRequestView property={property} onUpdateProperty={onUpdateProperty} />,
        'sellerAuthorization': <SellerAuthorizationView property={property} onUpdateProperty={onUpdateProperty} />,
        'purchaseContract': <Step1ContractDetails />,
        'titleSearch': <TitleSearchDataView />,
        'preliminaryTitleSearch': <PreliminaryTitleSearchView property={property} onUpdateProperty={onUpdateProperty} />,
           'earnestMoney':  
// FIX: Type '{ property: Property; onUpdateProperty: (p: Property) => void; }' is not assignable to type 'IntrinsicAttributes & EarnestMoneyViewProps'.
// Property 'property' does not exist on type 'IntrinsicAttributes & EarnestMoneyViewProps'.
            <EarnestMoneyView  />,
           'scheduling': <SchedulingView property={property} />,
        'closing': <Step5FinalReview />,
        'aiSummary': 
                <AIGeneratedSummary id={'796'} title='AI Generated Summary' />
        ,
        'titleCommitment': (
                <AIGeneratedSummary id={'796'}  title='Title Commitment'/>
        )
    };
    
    // Use a generic view for any stage not explicitly mapped
    return componentMap[stageId] || <GenericStepView title={stage.title} />;
};

const VerticalStepper: React.FC<{
    stages: ClosingStage[],
    progress: Record<string, ClosingProgressItem>,
    activeStageId: string,
    onStageClick: (stageId: string) => void,
    currentUser: User,
    onAssignTask: (stageId: string, userId: number | null) => void,
}> = ({ stages, progress, activeStageId, onStageClick, currentUser, onAssignTask }) => {
    
    const getStatusIcon = (status: ClosingStageStatus) => {
        switch (status) {
          case 'Completed': return <CheckCircleIcon className="w-6 h-6 text-teal-500" />;
          case 'In Progress': return <ClockIcon className="w-6 h-6 text-blue-500" />;
          default: return <CircleIcon className="w-6 h-6 text-gray-300" strokeWidth="1.5" />;
        }
    };
    
    // Resolve the user's role label safely: prefer currentUser.role, otherwise try mapping via userTypeId
// FIX: Property 'userTypeId' does not exist on type 'User'.
    const resolvedRoleLabel = currentUser.role ?? userTypes.find(t => t.value === String(currentUser.userTypeId))?.label ?? 'Unknown';

    const assignableUsers = MOCK_USERS.filter(u => u.role === 'Title User' || u.role === 'Title Abstractor');
    const canAssign = ['Title Admin', 'Title User'].includes(resolvedRoleLabel);

    return (
        <nav className="space-y-1">
            {stages.map((stage, index) => {
                const progressItem = progress[stage.id] || { status: 'Not Started', assignedTo: null };
                const isActive = stage.id === activeStageId;
                const assignedUser = MOCK_USERS.find(u => u.id === progressItem.assignedTo);

                return (
                    <div key={stage.id} className={`p-3 rounded-lg border-2 transition-all duration-200 ${isActive ? 'bg-blue-50 border-blue-500 shadow-sm' : 'border-transparent'}`}>
                        <button
                            onClick={() => onStageClick(stage.id)}
                            className="w-full flex items-center text-left"
                        >
                            <div className="flex-shrink-0 mr-4">
                                {getStatusIcon(progressItem.status)}
                            </div>
                            <div className="flex-1">
                                <p className={`font-semibold ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                                    {index + 1}. {stage.title}
                                </p>
                                <p className={`text-sm text-gray-500`}>{progressItem.status}</p>
                            </div>
                        </button>
                        {(canAssign || assignedUser) && (
                             <div className="mt-2 pl-10 flex items-center">
                                <UserCircleIcon className="w-5 h-5 text-gray-400 mr-2"/>
                                {canAssign ? (
                                    <select
                                        value={progressItem.assignedTo || ''}
                                        onChange={(e) => onAssignTask(stage.id, e.target.value ? parseInt(e.target.value) : null)}
                                        className="text-xs text-gray-600 bg-gray-100 border-gray-300 rounded-md p-1 w-full focus:ring-blue-500 focus:border-blue-500"
                                        onClick={(e) => e.stopPropagation()} // Prevent card click
                                    >
                                        <option value="">Unassigned</option>
                                        {assignableUsers.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                        {assignedUser ? assignedUser.name : 'Unassigned'}
                                    </span>
                                )}
                             </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ property, onUpdateProperty, currentUser, onArchiveProperty }) => {
    const [activeStageId, setActiveStageId] = useState<string>('');
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Resolve the user's role label safely (fallback to mapping via userTypeId)
// FIX: Property 'userTypeId' does not exist on type 'User'.
    const resolvedRoleLabel = currentUser.role ?? userTypes.find(t => t.value === String(currentUser.userTypeId))?.label ?? 'Unknown';

    const handleToggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const onFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
    }, []);

    const getVisibleStages = (): ClosingStage[] => {
        const baseStages = CLOSING_STAGES.filter(stage => 
           property.workflowOptions && property.workflowOptions[stage.id]
        );

        if (resolvedRoleLabel === 'Title Abstractor') {
                return baseStages.filter(stage => property.closingProgress[stage.id]?.assignedTo === currentUser.id);
            }

        let roleGroup: ConfigurableRole | null = null;
    if (resolvedRoleLabel.includes('Agent')) roleGroup = 'Agent';
    else if (resolvedRoleLabel === 'Buyer') roleGroup = 'Buyer';
    else if (resolvedRoleLabel === 'Seller') roleGroup = 'Seller';
        
        if (roleGroup && property.visibilitySettings?.[roleGroup]) {
            const settingsForRole = property.visibilitySettings[roleGroup] ?? {};
            return baseStages.filter(stage => settingsForRole[stage.id]);
        }
        
        // Default for Title Admin, Title User, etc. is to see all active stages
        return baseStages;
    };
    
    const visibleStages = getVisibleStages();

    useEffect(() => {
        if (visibleStages.length > 0) {
            const currentActiveIsVisible = visibleStages.some(s => s.id === activeStageId);
            if (!currentActiveIsVisible) {
                const firstActive = visibleStages.find(s => property.closingProgress[s.id]?.status === 'In Progress') 
                    || visibleStages.find(s => property.closingProgress[s.id]?.status === 'Not Started');
                setActiveStageId(firstActive ? firstActive.id : visibleStages[0].id);
            }
        }
    }, [property, currentUser]);
    
    const handleUpdatePropertyDetails = (updates: Partial<Property>) => {
        onUpdateProperty({ ...property, ...updates });
    };

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadDialogMessage, setUploadDialogMessage] = useState<string | undefined>(undefined);

    const handleStartStep = async (stageId: string, docId?: string | null) => {
        const newProgress = { 
            ...property.closingProgress, 
            [stageId]: { ...property.closingProgress[stageId], status: 'In Progress' as ClosingStageStatus }
        };
        handleUpdatePropertyDetails({ closingProgress: newProgress });
        setActiveStageId(stageId);

        // If this is the purchaseContract step and we have a titleSearchId on the property, re-fetch the title search order
        const tsId = (property as any).titleSearchId;
        if (stageId === 'purchaseContract' && tsId) {
            try {
                const res = await titleSearchService.getTitleSearchOrder(tsId);
                const data = res?.data ?? res;
                // Merge back any useful info into property (e.g., stakeholders/docs)
                if (data?.property) {
                    handleUpdatePropertyDetails({ ...data.property } as any);
                }
                setUploadDialogMessage(docId ? `Upload successful (doc ${docId}).` : 'Upload processed successfully.');
                setUploadDialogOpen(true);
            } catch (e: any) {
                setUploadDialogMessage('Upload succeeded but failed to refresh order data.');
                setUploadDialogOpen(true);
            }
        } else if (stageId === 'purchaseContract' && !tsId) {
            // No titleSearchId yet; show basic success if docId provided
            if (docId) {
                setUploadDialogMessage(`Upload successful (doc ${docId}).`);
                setUploadDialogOpen(true);
            }
        }
    };

    const handleAdvanceStep = (currentStageId: string, updates: Partial<Property> = {}) => {
        const currentIndex = visibleStages.findIndex(s => s.id === currentStageId);
        if (currentIndex === -1 || currentIndex === visibleStages.length - 1) return;

        const nextStageId = visibleStages[currentIndex + 1].id;

        const newProgress = { 
            ...property.closingProgress, 
            [currentStageId]: { ...property.closingProgress[currentStageId], status: 'Completed' as ClosingStageStatus },
            [nextStageId]: { ...property.closingProgress[nextStageId], status: 'In Progress' as ClosingStageStatus },
        };
                    onUpdateProperty({ ...property, ...updates, closingProgress: newProgress } as any);
        setActiveStageId(nextStageId);
    };

    const handleWorkflowConfigSave = async (newOptions: Record<string, boolean>) => {
        // Determine changed stages and sync permissions for buyer(1), seller(2), agent(4)
        try {
            const prev = property.workflowOptions || {};
            const changed = Object.keys(newOptions).filter(k => (prev[k] ?? false) !== (newOptions[k] ?? false));
            // Persist local workflow options first
            handleUpdatePropertyDetails({ workflowOptions: newOptions });
            // Fire-and-forget sync for each changed stage
            await Promise.all(changed.map(async (stageId) => {
                await syncWorkflowPermissionToUserTypes(stageId, Boolean(newOptions[stageId]));
            }));
        } catch (e) {
            // global handler
        }
    };

    // Map stage ids to permission names used by backend (best-effort mapping)
    const STAGE_TO_PERMISSION_NAME: Record<string, string> = {
        marketingRequest: 'f-marketing-request',
        preliminaryTitleSearch: 'f-preliminary-title-search',
        netToSeller: 'f-net-to-seller-v2',
        purchaseContract: 'f-purchase-contract',
        earnestMoney: 'f-earnest-money',
        titleSearch: 'f-title-search',
        aiSummary: 'f-ai-summary',
        titleCommitment: 'f-title-commitment',
        sellerAuthorization: 'f-seller-authorization',
        payoffs: 'f-payoffs-v2',
        loanStatus: 'f-loan-status',
        closingDisclosure: 'f-closing-disclosure-v2',
        scheduling: 'f-scheduling',
        finalSettlement: 'f-final-settlement-statement-v2',
        sendForApproval: 'f-send-for-approval',
        closing: 'f-closing',
        funding: 'f-funding',
        postClosingRecording: 'f-post-closing-recording-v2',
        recordingVerification: 'f-recording-verification',
        titlePolicyCreation: 'f-title-policy-creation'
    };

    // When workflow option changes, persist permission enable/disable for buyer(1), seller(2), agent(4)
    const syncWorkflowPermissionToUserTypes = async (stageId: string, enabled: boolean) => {
        const permissionName = STAGE_TO_PERMISSION_NAME[stageId];
        if (!permissionName) return;

        try {
            // The listAllPermissions({ name: 'space-feature' }) response contains a `data.userType` array
            // Find the titleUser entry and use its permissionGroups -> permission tree to locate the permission
            const all = await permissionService.listUserTypePermissions({ name: 'space-feature' });
            const allData = all?.data ?? all;
            const userTypesTree = allData?.userType ?? allData;
            if (!userTypesTree) return;

            // titleUser may be nested under keys or be an array; normalize
            let titleUserEntry: any = null;
            if (Array.isArray(userTypesTree)) {
                titleUserEntry = userTypesTree.find((ut: any) => ut.name === 'titleUser');
            } else if (typeof userTypesTree === 'object') {
                // keys may be role names
                const possible = Object.values(userTypesTree).flat ? Object.values(userTypesTree) : [userTypesTree];
                // possible may be array of userType objects or nested
                for (const v of Object.values(userTypesTree)) {
                    if (Array.isArray(v)) {
                        const found = v.find((ut: any) => ut && typeof ut === 'object' && (ut as any).name === 'titleUser');
                        if (found) { titleUserEntry = found; break; }
                    } else if (v && typeof v === 'object' && (v as any).name === 'titleUser') {
                        titleUserEntry = v as any; break;
                    }
                }
            }
            if (!titleUserEntry) return;

            const group = (titleUserEntry.permissionGroups || []).find((g: any) => g.id === 237 || g.name === 'space-feature');
            if (!group) return;

            const perm = (group.permission || []).find((p: any) => p.name === permissionName);
            if (!perm) return;

            const permissionId = perm.id;
            const userTypePermissionId = perm.userTypePermission?.id ?? null;

            // Use titleUser only
            const userTypeId = [1,2,4];
            if ( !permissionId) return;
            for (const uid of userTypeId) {
                const body = {
                    permissionId,
                    userTypePermissionId,
                    userTypeId: uid,
                    granted: enabled
                };
                try {
                    const res = await permissionService.updateUserTypePermissions(body);
                    console.log('Permission sync result:', res);
                } catch (e) {
                    // global handler elsewhere
                }
            }
        } catch (e) {
            // global handler elsewhere
        }
    };

    // Permission modal helper state & loaders for workflow permissions (space-feature id 237)
    const [userTypesPerms, setUserTypesPerms] = useState<any[]>([]);
    const [loadingUserTypes, setLoadingUserTypes] = useState(false);
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [currentUserType, setCurrentUserType] = useState<any | null>(null);
    const [updatingPermId, setUpdatingPermId] = useState<number | null>(null);

    const loadUserTypes = async (name?: string) => {
        setLoadingUserTypes(true);
        try {
            const res = await permissionService.listUserTypePermissions({ name });
            const data = res?.data ?? res;
            const ut = (data?.userType ?? data) as any;
            let list: any[] = [];
            if (Array.isArray(ut)) list = ut;
            else if (ut && typeof ut === 'object') {
                const order = ['titleUser', 'titleAbstractor'];
                list = order.map((k) => ut[k]).filter(Boolean);
            }
            setUserTypesPerms(list);
            if (list.length > 0 && !currentUserType) setCurrentUserType(list[0]);
        } catch (e) {
            // global handler elsewhere
        } finally {
            setLoadingUserTypes(false);
        }
    };

    useEffect(() => {
        if (isConfigModalOpen) {
            loadUserTypes();
        }
    }, [isConfigModalOpen]);

    const onToggleGrant = async (perm: any, granted: boolean) => {
        setUpdatingPermId(perm?.id);
        const body = {
          permissionId: perm?.id,
          userTypePermissionId: perm?.userTypePermission?.id,
          userTypeId: currentUserType?.id,
          granted
        };
        try {
          await permissionService.updateUserTypePermissions(body);
          await loadUserTypes(filter || undefined);
        } finally {
          setUpdatingPermId(null);
        }
      };

    const handleVisibilityConfigSave = (newSettings: RoleVisibilitySettings) => {
        handleUpdatePropertyDetails({ visibilitySettings: newSettings });
    };
    
    const handleAssignTask = (stageId: string, userId: number | null) => {
         const newProgress = { 
            ...property.closingProgress, 
            [stageId]: { ...property.closingProgress[stageId], assignedTo: userId }
        };
        handleUpdatePropertyDetails({ closingProgress: newProgress });
    };

    if (!property.agentInfoSubmitted && resolvedRoleLabel.includes('Agent')) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                     <AgentInformationForm onSubmit={() => handleUpdatePropertyDetails({ agentInfoSubmitted: true })} propertyAddress={property.address} />
                </div>
            </main>
        );
    }
    
    const isTitleAdmin = resolvedRoleLabel === 'Title Admin';
    const isTitleUser = ['Title Admin', 'Title User'].includes(resolvedRoleLabel);
    const automatedSteps = ['aiSummary', 'titleCommitment', 'finalSettlement'];
    const isCurrentStepAutomated = automatedSteps.includes(activeStageId);

    return (
        <div className={`flex h-full ${isFullScreen ? 'fixed inset-0 bg-gray-100 z-50' : ''}`}>
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {!isFullScreen && (
                    <header className="flex-shrink-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Closing Progress</h2>
                            <p className="text-sm text-gray-500">{property.address}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {isTitleUser && (
                                <button 
                                    onClick={() => setIsVisibilityModalOpen(true)}
                                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                    <span>Configure Visibility</span>
                                </button>
                            )}
                            {isTitleAdmin && (
                                <button 
                                    onClick={() => setIsConfigModalOpen(true)}
                                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <SettingsIcon className="w-4 h-4" />
                                    <span>Configure Workflow</span>
                                </button>
                            )}
                             <button 
                                onClick={handleToggleFullScreen}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <FullScreenIcon className="w-4 h-4" />
                                <span>{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</span>
                            </button>
                        </div>
                    </header>
                )}
                <div className={`flex flex-1 overflow-hidden ${isFullScreen ? 'p-6' : ''}`}>
                    {/* Left Sidebar */}
                    <aside className={
                        isFullScreen
                        ? "w-96 p-6 rounded-xl bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg flex-shrink-0"
                        : "w-96 p-6 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0"
                    }>
                        <div className={isFullScreen ? "h-full overflow-y-auto" : ""}>
                            <VerticalStepper 
                                stages={visibleStages}
                                progress={property.closingProgress}
                                activeStageId={activeStageId}
                                onStageClick={setActiveStageId}
                                currentUser={currentUser}
                                onAssignTask={handleAssignTask}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className={`flex-1 overflow-y-auto ${isFullScreen ? 'ml-6 bg-white rounded-xl shadow-2xl p-8' : 'bg-gray-50 p-8'}`}>
                        {isTitleUser && isCurrentStepAutomated ? (
                             <AutomatedWorkflow
                                property={property}
                                stageId={activeStageId}
                                onAdvanceStep={handleAdvanceStep}
                                onUpdateProperty={handleUpdatePropertyDetails}
                            />
                        ) : (
                            <>
                                {property.closingProgress[activeStageId]?.status === 'Not Started' ? (
                                    <StepActionPlaceholder stageId={activeStageId} onStartStep={handleStartStep} titleSearchId={(property as any).titleSearchId} />
                                ) : (
                                    getStageContent(activeStageId, property, onUpdateProperty, handleAdvanceStep)
                                )}
                            </>
                        )}
                    </main>

                    {/* Right Sidebar for Fullscreen */}
                    {isFullScreen && (
                        <div className={`relative transition-all duration-300 ease-in-out ${isRightSidebarOpen ? 'ml-6 w-[400px]' : 'w-0'}`}>
                            <aside className={`h-full w-full rounded-xl bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg`}>
                                <div className={`h-full w-[400px] overflow-hidden transition-opacity duration-100 ${isRightSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                                    <PropertyInfoSidebar property={property} currentUser={currentUser} onArchiveProperty={onArchiveProperty} />
                                </div>
                            </aside>
                            <button
                                onClick={() => setIsRightSidebarOpen(p => !p)}
                                className="absolute top-1/2 -translate-y-1/2 -left-3 z-10 bg-white/60 backdrop-blur-sm p-1.5 rounded-full border border-white/40 shadow-md hover:bg-white/90"
                                aria-label={isRightSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                            >
                                {isRightSidebarOpen ? <ChevronDoubleRightIcon className="w-5 h-5 text-gray-800" /> : <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-800" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
             <div className={`relative ${isFullScreen ? 'hidden' : ''}`}>
                 <div className={`h-full transition-all duration-300 ease-in-out ${isRightSidebarOpen ? 'w-[400px]' : 'w-0'}`}>
                    <div className="h-full w-[400px] overflow-hidden">
                        <PropertyInfoSidebar property={property} currentUser={currentUser} onArchiveProperty={onArchiveProperty} />
                    </div>
                </div>
                <button 
                    onClick={() => setIsRightSidebarOpen(p => !p)} 
                    className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 bg-white p-1 rounded-full border shadow-md hover:bg-gray-100 transition-transform"
                    aria-label={isRightSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isRightSidebarOpen ? <ChevronDoubleRightIcon className="w-5 h-5 text-gray-600" /> : <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-600" />}
                </button>
            </div>

            {isFullScreen && (
                <button
                    onClick={handleToggleFullScreen}
                    className="absolute top-8 right-8 z-20 flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-800 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg shadow-md hover:bg-white/90"
                >
                    <CloseIcon className="w-4 h-4" />
                    <span>Exit</span>
                </button>
            )}

            {isConfigModalOpen && (
                <WorkflowConfigModal 
                    onClose={() => setIsConfigModalOpen(false)}
                    onSave={handleWorkflowConfigSave}
                    currentOptions={property.workflowOptions}
                    optionalStages={CLOSING_STAGES.filter(s => s.optional)}
                    closingProgress={property.closingProgress}
                />
            )}
             {isVisibilityModalOpen && (
                <VisibilityConfigModal
                    onClose={() => setIsVisibilityModalOpen(false)}
                    onSave={handleVisibilityConfigSave}
                    currentSettings={property.visibilitySettings}
                    activeStages={CLOSING_STAGES.filter(s => property.workflowOptions[s.id])}
                />
            )}
            <UploadResultDialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} message={uploadDialogMessage} />
        </div>
    );
};