import type { User, ClosingStage, PropertyDetails, PreliminarySearchResult, AuditorDetails, RecorderDetails } from './types';

export const STEPS = [
  { id: 1, title: 'Contract Details' },
  { id: 2, title: 'Property Details' },
  { id: 3, title: 'Mortgage Liens' },
  { id: 4, title: 'Active Judgements & Liens' },
  { id: 5, title: 'Final Review' },
];

export const CLOSING_STAGES: ClosingStage[] = [
  { id: 'marketingRequest', title: 'Marketing request', optional: true },
  { id: 'preliminaryTitleSearch', title: 'Preliminary title search', optional: true },
  { id: 'netToSeller', title: 'Net to seller (V2)', optional: true },
  { id: 'purchaseContract', title: 'Purchase contract', optional: true },
  { id: 'earnestMoney', title: 'Earnest money', optional: true },
  { id: 'titleSearch', title: 'Title search', optional: true },
  { id: 'aiSummary', title: 'AI Summary', optional: true },
  { id: 'titleCommitment', title: 'Title commitment', optional: true },
  { id: 'sellerAuthorization', title: 'Seller authorization', optional: true },
  { id: 'payoffs', title: 'Payoffs (V2)', optional: true },
  { id: 'loanStatus', title: 'Loan status', optional: true },
  { id: 'closingDisclosure', title: 'Closing disclosure (V2)', optional: true },
  { id: 'scheduling', title: 'Scheduling', optional: true },
  { id: 'finalSettlement', title: 'Final Settlement Statement (V2)', optional: true },
  { id: 'sendForApproval', title: 'Send for approval', optional: true },
  { id: 'closing', title: 'Closing', optional: true },
  { id: 'funding', title: 'Funding', optional: true },
  { id: 'postClosingRecording', title: 'Post closing & recording (V2)', optional: true },
  { id: 'recordingVerification', title: 'Recording verification', optional: true },
  { id: 'titlePolicyCreation', title: 'Title policy creation', optional: true },
];

// FIX: Add missing MOCK_DETAIL_DATA export to be used in Step2PropertyDetails.tsx.
export const MOCK_DETAIL_DATA: { propertyDetails: PropertyDetails } = {
  propertyDetails: {
    currentOwner: 'Christopher & Sarah Sauerzopf',
    parcelId: '04-120-02-008.000',
    address: {
      street: '456 Oak Avenue',
      city: 'Pleasantville',
      state: 'OH',
      zip: '44123',
    },
    taxDistrict: 'Pleasantville CSD',
    appraisedValue: '$320,000',
    landValue: '$80,000',
    buildingValue: '$240,000',
    propertyType: 'Single Family Residential',
    dwellingCharacteristics: {
      yearBuilt: '1998',
      finishedArea: '2,200 sqft',
      bedrooms: '4',
      bathrooms: '2.5',
      lotSize: '0.3 acres',
    },
  },
};

export const MOCK_AUDITOR_DETAILS: AuditorDetails = {
  legalDescription: {
    propertyAddress: '881 West Broad Street, Columbus, OH, USA',
    cityTwp: 'COLUMBUS',
    subDivision: '',
    lotNumber: '',
    pbpg: '',
    shortDescription: 'A short description of the property would go here.',
    longDescription: 'A much longer, more detailed legal description of the property boundaries, easements, and other relevant information would be placed in this text area.',
  },
  taxInformation: {
    parcelNumber: '010-918273-00',
    lValue: '$14,180.00',
    bValue: '$18,310.00',
    tValue: '$32,490.00',
    taxYearData: [
      { year: 2024, firstHalf: { amount: '$1,205.74', status: 'paid' }, assessment1: { amount: '$505.00', status: 'paid' }, secondHalf: { amount: '$1,205.74', status: 'paid' }, assessment2: { amount: '$0.00', status: 'unpaid' }, total: '$1,205.74' },
    ],
    totalFirstHalfSecondHalf: '$2,411.48',
    delinquentTaxes: '$0.00',
    pendingAssessments: '$0.00',
    homestead: '$0.00',
    notes: 'BOR:2019-332913, Year 2019, Decision Code 3 - Change, Status U - Unsuccessful, Hearing Type N - Non-Appeal, Decision Not Appealed. 2018-325020: Year 2018, Status F - Finalized, Hearing Type N - Non Appeal, Decision Not Appealed.',
  },
  chainOfTitle: {
    propertyAddress: '881 West Broad Street, Columbus, OH, USA',
    parcelNumber: '010-018273-00',
    records: [
      { instNo: '196501190000074', dateRecorded: 'Feb 24, 1965', grantee: 'GRANT WILLIAM M &', instType: 'DEED', salesPrice: '$0.00' },
    ],
  },
};

export const MOCK_RECORDER_DETAILS: RecorderDetails = {
  sellers: {
    deeds: [
      { id: 'd1', stakeholderName: 'TARIK EZZINE', instNo: '202407220072359', deedType: 'General Warranty Deed', signedAt: 'Jul 17, 2024', filedAt: 'Jul 22, 2024', status: 'ACTIVE', notes: '' },
      { id: 'd2', stakeholderName: 'TARIK EZZINE', instNo: '202108080100324', deedType: 'General Warranty Deed', signedAt: 'May 21, 2021', filedAt: 'Jun 8, 2021', status: 'ACTIVE', notes: '' },
      { id: 'd3', stakeholderName: 'TARIK EZZINE', instNo: '202010220020288', deedType: 'General Warranty Deed', signedAt: 'Nov 24, 2020', filedAt: 'Feb 2, 2021', status: 'ACTIVE', notes: '' },
      { id: 'd4', stakeholderName: 'TARIK EZZINE', instNo: '202001280014035', deedType: 'General Warranty Deed', signedAt: 'Jan 23, 2020', filedAt: 'Jan 28, 2020', status: 'ACTIVE', notes: '' },
      { id: 'd5', stakeholderName: 'TARIK EZZINE', instNo: '201812280175144', deedType: 'Deed of Trustee', signedAt: 'Dec 20, 2018', filedAt: 'Dec 28, 2018', status: 'ACTIVE', notes: '' },
    ],
    mortgages: [
      { id: 'm1', status: 'ACTIVE', stakeholder: 'TARIK EZZINE', fileNumber: '202407220072359', mortgageFrom: 'Tarik Ezzine', toBank: 'Larry Whiteside II', amount: '$30,000.00', dated: 'Jul 17, 2024', filed1: '', assignedTo: '', filed2: '', instNo2: '', notes: '' },
      { id: 'm2', status: 'RELEASED', stakeholder: 'TARIK EZZINE', fileNumber: '202407310078397', mortgageFrom: 'TARIK EZZINE AND LARRY D WHITESIDE II', toBank: 'MORTGAGE ELECTRONICS REGISTRATION SYSTEMS, INC. AS MORTGAGEE, AS NOMINEE FOR UNION HOME MORTGAGE CORP, ITS SUCCESSORS AND ASSIGNS', amount: '$0.00', dated: 'Sep 12, 2018', filed1: '202407310078397', assignedTo: '', filed2: '', instNo2: '201809120123313', notes: '' },
      { id: 'm3', status: 'RELEASED', stakeholder: 'TARIK EZZINE', fileNumber: '201809120123313', mortgageFrom: 'Tarik Ezzine', toBank: 'Some Other Bank', amount: '$150,000.00', dated: 'Aug 01, 2018', filed1: '201809120123313', assignedTo: '', filed2: '', instNo2: '', notes: '' },
    ],
    liens: [
      { id: 'l1', stakeholder: 'TARIK EZZINE', documentCategory: 'NOTICE', instrumentNumber: '202105080081030', filedDate: 'May 8, 2021', notes: 'Lis pendens filed regarding 2861 Sullivant Avenue, Franklin County, Oh, naming Tarik Ezzine as defendant and notifying of a pending court case affecting title.', status: 'ACTIVE' }
    ],
  },
  buyers: {
    deeds: [],
    mortgages: [],
    liens: [],
  },
  priorOwners: {
    deeds: [],
    mortgages: [],
    liens: [],
  }
};


export const MOCK_PRELIMINARY_SEARCH_RESULT: PreliminarySearchResult = {
  parties: [
    { name: 'Hayder Aln...', role: 'Buyer', searchItems: [ { name: 'Recorder', status: 'completed' }, { name: 'Probate Marriage', status: 'completed' }] },
    { name: 'Anwar Alnu...', role: 'Buyer', searchItems: [ { name: 'Recorder', status: 'completed' }, { name: 'Probate Marriage', status: 'completed' }] },
    { name: 'WILLIAM M...', role: 'Seller', searchItems: [
        { name: 'Auditor', status: 'completed' },
        { name: 'Treasurer', status: 'completed' },
        { name: 'Recorder', status: 'completed' },
        { name: 'Pacer', status: 'completed' },
        { name: 'Clerk', status: 'completed' },
        { name: 'Mc Clerk', status: 'completed' },
        { name: 'Probate', status: 'completed' },
        { name: 'Probate Marriage', status: 'completed' },
        { name: 'Patriot', status: 'completed' },
        { name: 'Public Finance', status: 'completed' },
    ]},
     { name: 'Michael P...', role: 'Seller', searchItems: [
        { name: 'Auditor', status: 'completed' },
        { name: 'Treasurer', status: 'completed' },
        { name: 'Recorder', status: 'completed' },
        { name: 'Pacer', status: 'completed' },
        { name: 'Clerk', status: 'completed' },
        { name: 'Mc Clerk', status: 'completed' },
        { name: 'Probate', status: 'completed' },
        { name: 'Probate Marriage', status: 'completed' },
        { name: 'Patriot', status: 'completed' },
        { name: 'Public Finance', status: 'completed' },
    ]},
     { name: 'Deborah Evi...', role: 'Seller', searchItems: [
        { name: 'Auditor', status: 'completed' },
        { name: 'Treasurer', status: 'completed' },
        { name: 'Recorder', status: 'completed' },
        { name: 'Pacer', status: 'completed' },
        { name: 'Clerk', status: 'completed' },
        { name: 'Mc Clerk', status: 'completed' },
        { name: 'Probate', status: 'completed' },
        { name: 'Probate Marriage', status: 'completed' },
        { name: 'Patriot', status: 'completed' },
        { name: 'Public Finance', status: 'completed' },
    ]},
    { name: 'Mark M. Gr...', role: 'Seller', searchItems: [
        { name: 'Auditor', status: 'completed' },
        { name: 'Treasurer', status: 'pending' },
        { name: 'Recorder', status: 'in-progress' },
        { name: 'Pacer', status: 'completed' },
        { name: 'Clerk', status: 'completed' },
        { name: 'Mc Clerk', status: 'completed' },
        { name: 'Probate', status: 'completed' },
        { name: 'Probate Marriage', status: 'completed' },
        { name: 'Patriot', status: 'completed' },
        { name: 'Public Finance', status: 'completed' },
    ]},
    { name: 'Julia Siem...', role: 'Seller', searchItems: [
        { name: 'Auditor', status: 'completed' },
        { name: 'Treasurer', status: 'completed' },
        { name: 'Recorder', status: 'completed' },
        { name: 'Pacer', status: 'completed' },
        { name: 'Clerk', status: 'completed' },
        { name: 'Mc Clerk', status: 'completed' },
        { name: 'Probate', status: 'completed' },
        { name: 'Probate Marriage', status: 'completed' },
        { name: 'Patriot', status: 'completed' },
        { name: 'Public Finance', status: 'completed' },
    ]},
  ],
  disclaimer: 'THIS SEARCH EXCLUDES ANY DEFECTS, LIENS, ENCUMBRANCES, ADVERSE CLAIMS OR OTHER MATTERS, AS A RESULT OF OR CAUSED BY COMPUTER ERROR, PROGRAM ERROR, OR INDEXING ERROR WHEN SEARCHING ANY COUNTY, STATE, OR FEDERAL RECORD SYSTEM.',
  auditorDetails: MOCK_AUDITOR_DETAILS,
  recorderDetails: MOCK_RECORDER_DETAILS,
};


const placeholderImage = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export const MOCK_USERS: User[] = [
    { id: 1, name: 'Dana Scully', role: 'Title Admin', avatarUrl: 'https://i.pravatar.cc/150?u=admin', email: 'dana.scully@example.com' },
    { id: 5, name: 'Fox Mulder', role: 'Title User', avatarUrl: 'https://i.pravatar.cc/150?u=title_user', email: 'fox.mulder@example.com' },
    { id: 9, name: 'Alex Krycek', role: 'Title Abstractor', avatarUrl: 'https://i.pravatar.cc/150?u=abstractor', email: 'a.krycek@example.com' },
    { id: 6, name: 'Walter Skinner', role: 'Agent', avatarUrl: 'https://i.pravatar.cc/150?u=agent', email: 'walter.skinner@example.com' },
    { id: 7, name: 'Samantha Carter', role: 'Seller Agent', avatarUrl: 'https://i.pravatar.cc/150?u=seller_agent', email: 's.carter@example.com' },
    { id: 8, name: 'Jack O\'Neill', role: 'Buyer Agent', avatarUrl: 'https://i.pravatar.cc/150?u=buyer_agent', email: 'j.oneill@example.com' },
    { id: 2, name: 'Christopher Sauerzopf', role: 'Seller', avatarUrl: 'https://i.pravatar.cc/150?u=seller', email: 'chris.s@example.com' },
    { id: 3, name: 'John Buyer', role: 'Buyer', avatarUrl: 'https://i.pravatar.cc/150?u=buyer', email: 'john.buyer@example.com' },
    { id: 4, name: 'Title Inc.', role: 'Title Company', avatarUrl: 'https://i.pravatar.cc/150?u=title', email: 'contact@titleinc.com' },
];
