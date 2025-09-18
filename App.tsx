
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PropertyList } from './components/PropertyList';
import { PropertyDetailView } from './components/PropertyDetailView';
import { AddPropertyModal } from './components/AddPropertyModal';
import { CLOSING_STAGES, MOCK_USERS } from './constants';
import type { Property, User, ClosingProgressItem, MarketingData, EarnestMoneyData } from './types';
// FIX: Property 'getSession' does not exist on type 'AxiosInstance'.
import { authService } from './lib/services/auth.service';
import { userTypes } from './lib/userTypes';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import VerifyPin from './components/auth/VerifyPin';
import ResetPassword from './components/auth/ResetPassword';
import ForgetPassword from './components/auth/ForgetPassword';
import AuthGuard from './lib/route-guard/AuthGuard';
import GuestGuard from './lib/route-guard/GuestGuard';
import Register from './components/auth/Register';

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Restore session on app mount so reload doesn't lose user
  useEffect(() => {
    try {
      const user = authService.getSession().user;
      if (user) {
            const currentUserType = userTypes.find(t => t.value === String(user.userTypeId));
      user.role=currentUserType?.label ?? 'Unknown'
      setCurrentUser(user as User)
      }
    } catch (e) {
      // no active session
    }
  // mark auth check complete whether session exists or not
  setAuthChecked(true);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("https://xtractsol.app.n8n.cloud/webhook/15e1147a-fd14-493c-9a92-6320ddb13712");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        if (!responseText) {
            console.warn("API returned an empty response. Setting properties to an empty array.");
            setProperties([]);
            return;
        }
        const data = JSON.parse(responseText);

        const transformedProperties: Property[] = data.map((apiItem: any): Property | null => {
          try {
            if (typeof apiItem.property !== 'string' || !apiItem.property.trim()) {
              console.warn("Skipping API item due to missing or invalid 'property' field:", apiItem);
              return null;
            }
            const propertyData = JSON.parse(apiItem.property);
            const { gallery, details, agent } = propertyData;

            const addressParts = apiItem.property_address.split(',');
            const location = addressParts.length > 1 ? addressParts.pop().trim() : '';
            const address = addressParts.join(',').trim();
            
            const marketingData: MarketingData = {
              agentName: agent.name,
              agentEmail: agent.email,
              brokerageName: agent.brokerage,
              agentPhoneNumber: agent.phone,
              packageType: details.package_type,
              invoicePaid: details.invoice_paid,
              dueDate: details.due_date,
              address: details.address,
              bedrooms: details.bedrooms,
              fullBathrooms: details.bathrooms,
              sqFeet: details.square_feet,
              propertyDescription: details.description,
              photos: gallery.map((p: any) => p.url),
              notes: details.notes,
              brochureDesigner: details.designer,
              hasFacebookPage: !!agent.social_media?.facebook_page,
              instagramAccount: agent.social_media?.instagram,
            };

            const defaultWorkflowOptions = CLOSING_STAGES.reduce((acc, stage) => {
              if (!stage.optional || stage.id === 'marketingRequest') {
                acc[stage.id] = true;
              }
              return acc;
            }, {} as Record<string, boolean>);
            
            const closingProgress = CLOSING_STAGES.reduce((acc, stage) => {
              if (defaultWorkflowOptions[stage.id]) {
                 acc[stage.id] = { status: 'Not Started', assignedTo: null };
              }
              return acc;
            }, {} as Record<string, ClosingProgressItem>);
            closingProgress['marketingRequest'] = { status: 'Completed', assignedTo: null };
            
            const visibilitySettingsForAll = Object.keys(defaultWorkflowOptions).filter(k => defaultWorkflowOptions[k]).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {} as Record<string, boolean>);

            return {
              id: apiItem.id,
              address: address,
              location: location,
              status: 'In Progress',
              imageUrl: gallery.length > 0 ? gallery[0].url : `https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`,
              price: details.price ? `$${Number(details.price).toLocaleString()}` : undefined,
              beds: details.bedrooms,
              baths: details.bathrooms,
              sqft: details.square_feet,
              agentInfoSubmitted: true,
              participants: [MOCK_USERS[0]],
              closingProgress,
              apn: '010-014105',
              owners: 'COLUMBUS STATE COMMUNITY COLLEGE',
              searchType: 'SMART',
              startedAt: new Date().toLocaleString(),
              completedAt: 'N/A',
              workflowOptions: defaultWorkflowOptions,
              marketingRequestStatus: 'Submitted',
              marketingRequestData: marketingData,
              sellerAuthorizationStatus: 'Pending',
              sellerAuthorizationData: null,
              schedulingData: null,
              earnestMoneyData: null,
              titleCommitmentContent: '',
              visibilitySettings: {
                Agent: { ...visibilitySettingsForAll },
                Buyer: { ...visibilitySettingsForAll },
                Seller: { ...visibilitySettingsForAll },
              },
              preliminarySearchStatus: 'Not Started',
              preliminarySearchResult: null,
              county: 'Franklin',
              latitude: '39°58\'07.8"N',
              longitude: '82°59\'23.9"W',
              lastSoldPrice: '$2,707,560,000.00',
              propertyType: 'COLLEGES, UNIVERSITY - PUBLIC',
              lastModified: '2025-05-28',
              billedYear: '2024',
              currentTaxAmount: '$136,331.16',
              halfBaths: 0,
            };
          } catch (e) {
            console.error("Failed to parse property item:", apiItem, e);
            return null;
          }
        }).filter((p): p is Property => p !== null);

        setProperties(transformedProperties);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred while fetching properties.');
        console.error("Failed to fetch properties:", e);
        setProperties([]); // Fallback to empty array on API error
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
        fetchProperties();
    }
  }, [currentUser]);

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/\/property\/(\d+)/);
    if (match) {
        const propertyId = match[1];
        if (properties.length > 0) {
            const property = properties.find(p => p.id.toString() === propertyId);
            setSelectedProperty(property || null);
        }
    } else {
        setSelectedProperty(null);
    }
  }, [location.pathname, properties]);

  const handleLogin = () => {
    try {
      const session = authService.getSession();
      if (session?.user) {
        const user = session.user;
        const currentUserType = userTypes.find(t => t.value === String(user.userTypeId));
        user.role = currentUserType?.label ?? 'Unknown';
        setCurrentUser(user as User);
        navigate('/');
      }
    } catch(e) {
      // ignore, session not found
    }
  };
  
  const handleSelectProperty = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  const handleAddProperty = (address: string, location: string, workflowOptions: Record<string, boolean>) => {
    const finalWorkflowOptions: Record<string, boolean> = { ...workflowOptions };
    CLOSING_STAGES.forEach(stage => {
        if (!stage.optional) {
            finalWorkflowOptions[stage.id] = true;
        }
    });

    const closingProgress = CLOSING_STAGES.reduce((acc, stage) => {
        if (finalWorkflowOptions[stage.id]) {
            acc[stage.id] = { status: 'Not Started', assignedTo: null };
        }
        return acc;
    }, {} as Record<string, ClosingProgressItem>);

    const activeWorkflowKeys = Object.keys(finalWorkflowOptions).filter(k => finalWorkflowOptions[k]);
    const visibilitySettingsForAll = activeWorkflowKeys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
    }, {} as Record<string, boolean>);

    const newProperty: Property = {
        id: Date.now(),
        address,
        location,
        status: 'Draft',
        imageUrl: `https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`,
        price: undefined,
        beds: 3,
        baths: 2,
        sqft: 1800,
        agentInfoSubmitted: false,
        participants: [MOCK_USERS[0]],
        closingProgress,
        apn: 'N/A',
        owners: 'New Property Owner',
        searchType: 'SMART',
        startedAt: new Date().toLocaleDateString(),
        completedAt: 'N/A',
        workflowOptions: finalWorkflowOptions,
        marketingRequestStatus: 'Pending',
        marketingRequestData: null,
        sellerAuthorizationStatus: 'Pending',
        sellerAuthorizationData: null,
        schedulingData: null,
        earnestMoneyData: null,
        titleCommitmentContent: '',
        visibilitySettings: {
            Agent: { ...visibilitySettingsForAll },
            Buyer: { ...visibilitySettingsForAll },
            Seller: { ...visibilitySettingsForAll },
        },
        isArchived: false,
        preliminarySearchStatus: 'Not Started',
        preliminarySearchResult: null,
        county: 'N/A',
        latitude: 'N/A',
        longitude: 'N/A',
        lastSoldPrice: 'N/A',
        propertyType: 'N/A',
        lastModified: 'N/A',
        billedYear: 'N/A',
        currentTaxAmount: 'N/A',
        halfBaths: 1,
    };
    setProperties([newProperty, ...properties]);
    setIsAddModalOpen(false);
  };

  const handleUpdateProperty = (updatedProperty: Property) => {
     let propertyToUpdate = { ...updatedProperty };
    if (propertyToUpdate.status === 'Closed') {
        propertyToUpdate.isArchived = true;
    }
    setProperties(properties.map(p => p.id === propertyToUpdate.id ? propertyToUpdate : p));
    setSelectedProperty(propertyToUpdate);
  };
  
  const handleArchiveProperty = (id: number) => {
      setProperties(properties.map(p => p.id === id ? { ...p, isArchived: true } : p));
      if (selectedProperty?.id === id) {
          navigate('/');
      }
  };
  
  const MainLayout = () => (
     <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar 
        user={currentUser!} 
        onNavigate={handleBackToDashboard}
        isCollapsed={isSidebarCollapsed}
        selectedProperty={selectedProperty}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser!} onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
            {selectedProperty ? (
                  <PropertyDetailView 
                      property={selectedProperty}
                      onUpdateProperty={handleUpdateProperty}
                      currentUser={currentUser!}
                      onArchiveProperty={handleArchiveProperty}
                  />
              ) : isLoading ? (
                <div className="text-center text-gray-500">Loading properties from API...</div>
              ) : error ? (
                <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
                  <strong>Failed to load properties:</strong> {error}
                </div>
              ) : (
                <PropertyList 
                    properties={properties} 
                    onSelectProperty={handleSelectProperty}
                    onAddNew={() => setIsAddModalOpen(true)}
                    currentUser={currentUser!}
                />
              )}
        </main>
      </div>
      {isAddModalOpen && (
        <AddPropertyModal 
            onClose={() => setIsAddModalOpen(false)}
            onAddProperty={handleAddProperty}
        />
      )}
    </div>
  );
  
  if (!authChecked) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
      <Routes>
        <Route path="/code-verification" element={<GuestGuard><VerifyPin /></GuestGuard>} />
        <Route path="/reset-password" element={<GuestGuard><ResetPassword /></GuestGuard>} />
        <Route path='/forgot-password' element={<GuestGuard><ForgetPassword/></GuestGuard>}/>
        <Route path="/login" element={<GuestGuard><Login handleLogin={handleLogin} /></GuestGuard>} />
        <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />
        
        <Route path="/*" element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          } />

      </Routes>
  );
};


export default App;
