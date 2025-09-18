// FIX: Re-created this file with proper type definitions and exports to resolve circular dependencies and missing type errors.
export type UserRole = 'Title Admin' | 'Title User' | 'Title Abstractor' | 'Agent' | 'Seller Agent' | 'Buyer Agent' | 'Seller' | 'Buyer' | 'Title Company';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  avatarUrl: string;
  email: string;
  userTypeId?: string | number;
}

export interface ChatMessage {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
}

export type ClosingStageStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface ClosingProgressItem {
  status: ClosingStageStatus;
  assignedTo: number | null;
}

export interface ClosingStage {
  id: string;
  title: string;
  optional: boolean;
}

export interface MarketingData {
    agentName: string;
    agentEmail: string;
    brokerageName: string;
    agentPhoneNumber: string;
    packageType: string;
    invoicePaid: boolean;
    dueDate: string;
    address: string;
    bedrooms: number;
    fullBathrooms: number;
    sqFeet: number;
    propertyDescription: string;
    photos: string[];
    notes: string;
    brochureDesigner: string;
    hasFacebookPage: boolean;
    instagramAccount: string;
}

export interface AuthorizationData {
    authorizedBy: string;
    authorizedAt: string;
    documentUrl: string;
}

export interface Commission {
    recipient: string;
    role: string;
    amount: string;
    percentage: string;
    status: 'Paid' | 'Pending';
}

export interface SchedulingData {
    closingDate: string;
    fundingDate: string;
    buyerWireInstructions: {
        bankName: string;
        routingNumber: string;
        accountNumber: string;
        beneficiaryName: string;
    };
    sellerPayoutDetails: {
        method: string;
        bankName: string;
        accountLastFour: string;
    };
    commissions: Commission[];
}

export interface EarnestMoneyData {
    amount: number;
    fee: number;
    buyerEmail: string;
    buyerName: string;
    agentName?: string;
    sellerName?: string;
    status: 'unpaid' | 'Paid' | 'Received';
    date: string;
    receiptUrl: string | null;
    address?: string;
}

export type ConfigurableRole = 'Agent' | 'Buyer' | 'Seller';

export type RoleVisibilitySettings = {
    Agent: Record<string, boolean>;
    Buyer: Record<string, boolean>;
    Seller: Record<string, boolean>;
};

export interface SearchItem {
    name: string;
    status: 'completed' | 'in-progress' | 'pending' | 'warning';
}

export interface SearchParty {
  name: string;
  role: 'Buyer' | 'Seller' | 'Prior Owner';
  searchItems: SearchItem[];
}

export interface AuditorDetails {
  legalDescription: {
    propertyAddress: string;
    cityTwp: string;
    subDivision: string;
    lotNumber: string;
    pbpg: string;
    shortDescription: string;
    longDescription: string;
  };
  taxInformation: {
    parcelNumber: string;
    lValue: string;
    bValue: string;
    tValue: string;
    taxYearData: {
      year: number;
      firstHalf: { amount: string; status: 'paid' | 'unpaid' };
      assessment1: { amount: string; status: 'paid' | 'unpaid' };
      secondHalf: { amount: string; status: 'paid' | 'unpaid' };
      assessment2: { amount: string; status: 'paid' | 'unpaid' };
      total: string;
    }[];
    totalFirstHalfSecondHalf: string;
    delinquentTaxes: string;
    pendingAssessments: string;
    homestead: string;
    notes: string;
  };
  chainOfTitle: {
    propertyAddress: string;
    parcelNumber: string;
    records: {
      instNo: string;
      dateRecorded: string;
      grantee: string;
      instType: string;
      salesPrice: string;
    }[];
  };
}

export interface DeedRecord {
  id: string;
  stakeholderName: string;
  instNo: string;
  deedType: string;
  signedAt: string;
  filedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes: string;
}

export interface MortgageRecord {
  id: string;
  status: 'ACTIVE' | 'RELEASED';
  stakeholder: string;
  fileNumber: string;
  mortgageFrom: string;
  toBank: string;
  amount: string;
  dated: string;
  filed1: string;
  assignedTo: string;
  filed2: string;
  instNo2: string;
  notes: string;
}

export interface LienRecord {
  id: string;
  stakeholder: string;
  documentCategory: string;
  instrumentNumber: string;
  filedDate: string;
  notes: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface RecorderStakeholderDetails {
    deeds: DeedRecord[];
    mortgages: MortgageRecord[];
    liens: LienRecord[];
}

export interface RecorderDetails {
  sellers: RecorderStakeholderDetails;
  buyers: RecorderStakeholderDetails;
  priorOwners: RecorderStakeholderDetails;
}

export interface PreliminarySearchResult {
  parties: SearchParty[];
  disclaimer: string;
  auditorDetails: AuditorDetails;
  recorderDetails: RecorderDetails;
}

export type PropertyStatus = 'Draft' | 'In Progress' | 'In Review' | 'Closed';

export interface Property {
    id: number;
    address: string;
    location: string;
    status: PropertyStatus;
    imageUrl: string;
    price?: string;
    beds: number;
    baths: number;
    sqft: number;
    agentInfoSubmitted: boolean;
    participants: User[];
    closingProgress: Record<string, ClosingProgressItem>;
    apn: string;
    owners: string;
    searchType: string;
    startedAt: string;
    completedAt: string;
    workflowOptions: Record<string, boolean>;
    marketingRequestStatus: 'Pending' | 'Submitted';
    marketingRequestData: MarketingData | null;
    sellerAuthorizationStatus: 'Pending' | 'Submitted';
    sellerAuthorizationData: AuthorizationData | null;
    schedulingData: SchedulingData | null;
    earnestMoneyData: EarnestMoneyData | null;
    titleCommitmentContent: string;
    visibilitySettings: RoleVisibilitySettings;
    isArchived?: boolean;
    preliminarySearchStatus: 'Not Started' | 'In Progress' | 'Completed';
    preliminarySearchResult: PreliminarySearchResult | null;
    county: string;
    latitude: string;
    longitude: string;
    lastSoldPrice: string;
    propertyType: string;
    lastModified: string;
    billedYear: string;
    currentTaxAmount: string;
    halfBaths: number;
    aiSummaryContent?: string;
}

export interface PropertyDetails {
    currentOwner: string;
    parcelId: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    taxDistrict: string;
    appraisedValue: string;
    landValue: string;
    buildingValue: string;
    propertyType: string;
    dwellingCharacteristics: {
      yearBuilt: string;
      finishedArea: string;
      bedrooms: string;
      bathrooms: string;
      lotSize: string;
    };
}

// This type was imported but not used. Defining as empty interface for now.
export interface TitleSearchData {}
// FIX: Module '"../types"' has no exported member 'Person'.
export interface Person {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// FIX: Module '"../types"' has no exported member 'Agent'.
export interface Agent extends Person {
  side?: 'buyer' | 'seller';
}
