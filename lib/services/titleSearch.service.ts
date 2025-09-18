import { property } from 'lodash';
  
import './authOptions';
import axios from 'axios';
import { emitError } from '../errorBus';
import { get } from 'http';

// FIX: Property 'env' does not exist on type 'ImportMeta'.
// Prefer Vite env var for client apps; fallback to process.env.API_URI for other environments
const API_URL =  process.env.VITE_API_KEY || '';

// Small helper to normalize axios responses
const data = (res: any) => res?.data;

// Attach a single interceptor once
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let callers handle errors, but also emit to global dialog
    try {
      emitError('Request failed', error);
    } catch {}
    return Promise.reject(error);
  }
);

const titleSearchService = {
  // Basic stakeholders
  viewClerkOfCourt: (file: any): Promise<any> => axios.get(file, { responseType: 'text' }).then(data),
  addTitleSearchStakeholders: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/stakeholders/add`, body).then(data),
  removeTitleSearchStakeholders: (id: any): Promise<any> => axios.delete(`${API_URL}/title-search/stakeholders/remove/${id}`).then(data),
  updateTitleSearchStakeholders: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/stakeholders/update`, body).then(data),
  getTitleSearchStakeholder: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/stakeholders/get/${id}`).then(data),
  getAiSummaryLink: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/ai-summary/download/${titleSearchId}`).then(data),

getLegalDescription: (titleSearchId: any): Promise<any> =>  axios.get(`${API_URL}/title-search/legal-description/get/${titleSearchId}`).then(data),
listLegalDescription: (titleSearchId: any): Promise<any> =>  axios.get(`${API_URL}/title-search/legal-description/list/${titleSearchId}`).then(data),
deleteLegalDescription: (id: any): Promise<any> => axios.delete(`${API_URL}/title-search/legal-description/delete/${id}`).then(data),


// Title search lists
  getTitleSearchStakeholdersList: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/related-stakeholder/list/${titleSearchId}`).then(data),

  stakeholdersList: ({ id, filters }: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/stakeholder/list/${id}`, { params: filters }).then(data),

  createJsonField: ({ body, stakeholderId, field }: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/stakeholder/${field}/create/${stakeholderId}`, body).then(data),

  updateJsonField: ({ body, stakeholderId, recordId, field }: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/stakeholder/${field}/update/${stakeholderId}/${recordId}`, body).then(data),

  deleteJsonField: ({ stakeholderId, recordId, field }: any): Promise<any> =>
    axios.delete(`${API_URL}/title-search/stakeholder/${field}/delete/${stakeholderId}/${recordId}`).then(data),

  uploadPurchaseAgreement: (body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/upload/purchase-agreement`, body, { headers: { Accept: 'application/json' } }).then(data),

  saveDocumentDetails: (id: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/document-details/update/${id}`, body).then(data),

  getDocuments: (id: any, body: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/document/get/${id}/${limit}/${page}`, body, { params: filters }).then(data),

  smartSearch: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/smart-search/${id}`).then(data),

  regenerateTitleSearch: (id: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/regenerate-ai-summary/${id}`, body).then(data),

  rateTitleSearch: (id: any, body: any): Promise<any> => axios.post(`${API_URL}/title-search/rating/${id}`, body).then(data),

  updateTitleSearch: (id: any, body: any): Promise<any> => axios.post(`${API_URL}/title-search/update/${id}`, body).then(data),

  sendInvitation: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/send-invite/${id}`).then(data),

  updatePC: (id: any, body: any): Promise<any> => axios.post(`${API_URL}/title-search/update/purchase-contract/${id}`, body).then(data),

  saveRecorder: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/recorder/save`, body).then(data),

  saveAuditor: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/auditor/save`, body).then(data),

  addTrustDeed: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/trust-deed/create`, body).then(data),
  updateTrustDeed: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/trust-deed/update`, body).then(data),
  getTrustDeed: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/trust-deed/get/${id}`).then(data),
  getStatuses: (id: any): Promise<any> => axios.post(`${API_URL}/title-search/get-statuses/${id}`, id).then(data),
  deleteTrustDeed: (id: any): Promise<any> => axios.delete(`${API_URL}/title-search/trust-deed/delete/${id}`).then(data),
  listTrustDeed: (titleSearchId: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/trust-deed/list/${titleSearchId}/${limit}/${page}`, { params: filters }).then(data),

  addJudgementLiens: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/judgement-liens/create`, body).then(data),
  updateJudgementLiens: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/judgement-liens/update`, body).then(data),
  getJudgementLiens: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/judgement-liens/get/${id}`).then(data),
  deleteJudgementLiens: (id: any): Promise<any> => axios.delete(`${API_URL}/title-search/judgement-liens/delete/${id}`).then(data),
  listJudgementLiens: (titleSearchId: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/judgement-liens/list/${titleSearchId}/${limit}/${page}`, { params: filters }).then(data),

  addMortgage: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/mortgage/create`, body).then(data),
  updateMortgage: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/mortgage/update`, body).then(data),
  getMortgage: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/mortgage/get/${id}`).then(data),
  deleteMortgage: (id: any): Promise<any> => axios.delete(`${API_URL}/title-search/mortgage/delete/${id}`).then(data),
  listMortgage: (titleSearchId: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/mortgage/list/${titleSearchId}/${limit}/${page}`, { params: filters }).then(data),

  addPropertyTax: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/property-tax/create`, body).then(data),
  updatePropertyTax: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/property-tax/update`, body).then(data),
  getPropertyTax: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/property-tax/get/${id}`).then(data),
  deletePropertyTax: (id: any): Promise<any> => axios.delete(`${API_URL}/title-search/property-tax/delete/${id}`).then(data),
  listPropertyTax: (propertyId: any): Promise<any> => axios.get(`${API_URL}/title-search/property-tax/list/${propertyId}`).then(data),

  addTaxInformation: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/tax-information/create`, body).then(data),
  updateTaxInformation: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/tax-information/update`, body).then(data),
  getTaxInformation: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/tax-information/get/${id}`).then(data),
  deleteTaxInformation: (id: any): Promise<any> => axios.delete(`${API_URL}/title-search/tax-information/delete/${id}`).then(data),
  listTaxInformation: (propertyId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/tax-information/list/${propertyId}`).then(data),

  addTitleChain: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/title-chain/create`, body).then(data),
  updateTitleChain: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/title-chain/update`, body).then(data),
  getTitleChain: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/title-chain/get/${id}`).then(data),
  deleteTitleChain: (id: any): Promise<any> => axios.delete(`${API_URL}/title-search/title-chain/delete/${id}`).then(data),
  listTitleChain: (titleSearchId: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/title-chain/list/${titleSearchId}/${limit}/${page}`, { params: filters }).then(data),

  // Clerk, Municipal, Pacer, Patriot, Probate, etc. (CRUD wrappers)
  getClerkOfCourt: (id: any): Promise<any> => axios.get(`${API_URL}/clerk-of-court/get/${id}`).then(data),
  searchClerkOfCourt: (id: any, { limit, page }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/clerk-of-court/search/${id}/${limit}/${page}`, { params: filters }).then(data),
  createClerkOfCourt: (body: any): Promise<any> => axios.post(`${API_URL}/clerk-of-court/create`, body).then(data),
  updateClerkOfCourt: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/clerk-of-court/update/${id}`, body).then(data),
  deleteClerkOfCourt: (id: any): Promise<any> => axios.delete(`${API_URL}/clerk-of-court/delete/${id}`).then(data),

  getMunicipalClerk: (id: any): Promise<any> => axios.get(`${API_URL}/municipal-clerk/get/${id}`).then(data),
  searchMunicipalClerk: (id: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/municipal-clerk/search/${id}/${limit}/${page}`, { params: filters }).then(data),
  createMunicipalClerk: (body: any): Promise<any> => axios.post(`${API_URL}/municipal-clerk/create`, body).then(data),
  updateMunicipalClerk: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/municipal-clerk/update/${id}`, body).then(data),
  deleteMunicipalClerk: (id: any): Promise<any> => axios.delete(`${API_URL}/municipal-clerk/delete/${id}`).then(data),
  createMunicipalClerkDocket: (body: any): Promise<any> => axios.post(`${API_URL}/municipal-clerk/docket/create`, body).then(data),
  updateMunicipalClerkDocket: (id: any, body: any): Promise<any> =>
    axios.put(`${API_URL}/municipal-clerk/docket/update/${id}`, body).then(data),
  deleteMunicipalClerkDocket: (id: any): Promise<any> => axios.delete(`${API_URL}/municipal-clerk/docket/delete/${id}`).then(data),
  createMunicipalClerkParty: (body: any): Promise<any> => axios.post(`${API_URL}/municipal-clerk/party/create`, body).then(data),
  updateMunicipalClerkParty: (id: any, body: any): Promise<any> =>
    axios.put(`${API_URL}/municipal-clerk/party/update/${id}`, body).then(data),
  deleteMunicipalClerkParty: (id: any): Promise<any> => axios.delete(`${API_URL}/municipal-clerk/party/delete/${id}`).then(data),

  getPacer: (id: any): Promise<any> => axios.get(`${API_URL}/pacer/get/${id}`).then(data),
  searchPacer: (id: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/pacer/search/${id}/${limit}/${page}`, { params: filters }).then(data),
  createPacer: (body: any): Promise<any> => axios.post(`${API_URL}/pacer/create`, body).then(data),
  updatePacer: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/pacer/update/${id}`, body).then(data),
  deletePacer: (id: any): Promise<any> => axios.delete(`${API_URL}/pacer/delete/${id}`).then(data),
  getPacerStatusDetail: (id: any): Promise<any> => axios.get(`${API_URL}/pacer/status-detail/get/${id}`).then(data),
  searchPacerStatusDetails: (params: any): Promise<any> => axios.get(`${API_URL}/pacer/status-detail/search`, { params }).then(data),
  createPacerStatusDetail: (body: any): Promise<any> => axios.post(`${API_URL}/pacer/status-detail/create`, body).then(data),
  updatePacerStatusDetail: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/pacer/status-detail/update/${id}`, body).then(data),
  deletePacerStatusDetail: (id: any): Promise<any> => axios.delete(`${API_URL}/pacer/status-detail/delete/${id}`).then(data),
  getPacerTrustee: (id: any): Promise<any> => axios.get(`${API_URL}/pacer/trustee/get/${id}`).then(data),
  searchPacerTrustees: (params: any): Promise<any> => axios.get(`${API_URL}/pacer/trustee/search`, { params }).then(data),
  createPacerTrustee: (body: any): Promise<any> => axios.post(`${API_URL}/pacer/trustee/create`, body).then(data),
  updatePacerTrustee: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/pacer/trustee/update/${id}`, body).then(data),
  deletePacerTrustee: (id: any): Promise<any> => axios.delete(`${API_URL}/pacer/trustee/delete/${id}`).then(data),

  // Patriot Act
  getPatriotAct: (id: any): Promise<any> => axios.get(`${API_URL}/patriot-act/get/${id}`).then(data),
  searchPatriotAct: (id: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/patriot-act/search/${id}/${limit}/${page}`, { params: filters }).then(data),
  createPatriotAct: (body: any): Promise<any> => axios.post(`${API_URL}/patriot-act/create`, body).then(data),
  updatePatriotAct: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/patriot-act/update/${id}`, body).then(data),
  deletePatriotAct: (id: any): Promise<any> => axios.delete(`${API_URL}/patriot-act/delete/${id}`).then(data),
  getPatriotActAKA: (id: any): Promise<any> => axios.get(`${API_URL}/patriot-act/aka/get/${id}`).then(data),
  searchPatriotActAKA: (params: any): Promise<any> => axios.get(`${API_URL}/patriot-act/aka/search`, { params }).then(data),
  createPatriotActAKA: (body: any): Promise<any> => axios.post(`${API_URL}/patriot-act/aka/create`, body).then(data),
  updatePatriotActAKA: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/patriot-act/aka/update/${id}`, body).then(data),
  deletePatriotActAKA: (id: any): Promise<any> => axios.delete(`${API_URL}/patriot-act/aka/delete/${id}`).then(data),

  // Probate
  getProbate: (id: any): Promise<any> => axios.get(`${API_URL}/probate/get/${id}`).then(data),
  searchProbate: (id: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/probate/search/${id}/${limit}/${page}`, { params: filters }).then(data),
  createProbate: (body: any): Promise<any> => axios.post(`${API_URL}/probate/create`, body).then(data),
  updateProbate: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/probate/update/${id}`, body).then(data),
  deleteProbate: (id: any): Promise<any> => axios.delete(`${API_URL}/probate/delete/${id}`).then(data),
  getProbateDocketData: (id: any): Promise<any> => axios.get(`${API_URL}/probate/docket-data/get/${id}`).then(data),
  searchProbateDocketData: (params: any): Promise<any> => axios.get(`${API_URL}/probate/docket-data/search`, { params }).then(data),
  createProbateDocketData: (body: any): Promise<any> => axios.post(`${API_URL}/probate/docket-data/create`, body).then(data),
  updateProbateDocketData: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/probate/docket-data/update/${id}`, body).then(data),
  deleteProbateDocketData: (id: any): Promise<any> => axios.delete(`${API_URL}/probate/docket-data/delete/${id}`).then(data),

  getProbateMarriage: (id: any): Promise<any> => axios.get(`${API_URL}/probate-marriage/get/${id}`).then(data),
  searchProbateMarriage: (id: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/probate-marriage/search/${id}/${limit}/${page}`, { params: filters }).then(data),
  createProbateMarriage: (body: any): Promise<any> => axios.post(`${API_URL}/probate-marriage/create`, body).then(data),
  updateProbateMarriage: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/probate-marriage/update/${id}`, body).then(data),
  deleteProbateMarriage: (id: any): Promise<any> => axios.delete(`${API_URL}/probate-marriage/delete/${id}`).then(data),

  // Title commitment / summaries / search orders
  generateTitleCommitment: (titleSearchId: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/smart/title-commitment/generate/${titleSearchId}`, body).then(data),
  getTitleCommitmentText: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/title-commitment-text/get/${titleSearchId}`).then(data),
  updateTitleCommitment: (titleSearchId: any, body: any): Promise<any> =>
    axios.put(`${API_URL}/title-search/title-commitment/update/${titleSearchId}`, body).then(data),
  getTitleCommitment: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/title-commitment/get/${titleSearchId}`).then(data),
  shareTitleCommitment: (body: any): Promise<any> => axios.put(`${API_URL}/title-search/share-title-commitment`, body).then(data),
  shareTitleCommitmentOutside: (body: any): Promise<any> =>
    axios.put(`${API_URL}/title-search/share-title-commitment-outside`, body).then(data),
  shareAiSummary: (body: any): Promise<any> => axios.put(`${API_URL}/title-search/share-ai-summary`, body).then(data),
  shareAiSummaryOutside: (body: any): Promise<any> => axios.put(`${API_URL}/title-search/share-ai-summary-outside`, body).then(data),

  getFileSizeFromSignedUrl: async (signedUrl: string): Promise<number> => {
    try {
      const res = await axios.head(signedUrl);
      const contentLength = res.headers['content-length'] || res.headers['Content-Length'];
      return contentLength ? parseInt(contentLength as string, 10) : 0;
    } catch (err) {
      console.error('Error fetching file size:', err);
      return 0;
    }
  },

  downloadTitleCommitmentOutside: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/title-commitment/download/${titleSearchId}`).then(data),

  getTitleSearchById: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/order/get/${id}`).then(data),
  getTitleSearchOrder: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/view-order/get/${titleSearchId}`).then(data),

  createSearchVersionStakeholders: (titleSearchId: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/smart-version/stakeholders/create/${titleSearchId}`, body).then(data),

  retryFailedPublicRecords: (titleSearchId: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/retry-record/${titleSearchId}`, body).then(data),

  getTitleCaseDecisionReport: (id: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/get-title-case-decision-report/${id}`).then(data),
  getTitleCaseAuxiliaryReport: (id: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/get-title-case-auxiliary-report/${id}`, body).then(data),

  getAiSummary: (id: any, body: any): Promise<any> => axios.post(`${API_URL}/title-search/ai-generated-summary/get/${id}`, body).then(data),
  retryAiSummary: (id: any, body: any): Promise<any> => axios.post(`${API_URL}/title-search/retry-ai-summary/${id}`, body).then(data),
  updateAiSummary: (id: any, body: any): Promise<any> =>
    axios.put(`${API_URL}/title-search/ai-generated-summary/update/${id}`, body).then(data),

  listTitleSearch: (id: string, page: number, limit: number, filters: any = {}): Promise<any> =>
    axios.get(`${API_URL}/title-search/order/list/${id}/${limit}/${page}`, { params: filters }).then(data),

  titleSearchOrder: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/request-order`, body).then(data),
  updateSmartSearch: (body: any): Promise<any> => axios.post(`${API_URL}/title-search/smart-search/update`, body).then(data),
  rerunSmartSearch: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/smart-search/rerun/${titleSearchId}`).then(data),

  createTitleSearchOrder: (id: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/request-order/create/${id}`, body).then(data),
  updateTitleSearchOrder: (id: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/request-order/update/${id}`, body).then(data),
  resubmitTitleSearchOrder: (id: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/request-order/resubmit/${id}`, body).then(data),

  updateTitleAbstract: (id: any, body: any): Promise<any> => axios.post(`${API_URL}/title-search/abstract/update/${id}`, body).then(data),
  requestEarnestOutside: (body: any): Promise<any> => axios.post(`${API_URL}/title-company/request-earnest-outside-buyer`, body).then(data),

  generateRandomString: (): string => {
    const excludedChars = '"' + "'" + '/\\:{}()[]^<>.,-;';
    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
    const generateChar = (type: string) => {
      let charCode = 0;
      do {
        if (type === 'digit') charCode = randomInt(48, 58);
        else if (type === 'upper') charCode = randomInt(65, 91);
        else charCode = randomInt(97, 123);
      } while (excludedChars.includes(String.fromCharCode(charCode)));
      return String.fromCharCode(charCode);
    };
    const result: string[] = [generateChar('digit'), generateChar('upper'), generateChar('lower')];
    while (result.length < 16) {
      let charCode: number;
      do {
        charCode = randomInt(33, 123);
      } while (
        excludedChars.includes(String.fromCharCode(charCode)) ||
        (charCode > 57 && charCode < 65) ||
        (charCode > 90 && charCode < 97)
      );
      result.push(String.fromCharCode(charCode));
    }
    // shuffle
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result.join('');
  },

  getAllCounties: (): Promise<any> => axios.get(`${API_URL}/county/get/all`).then(data),

  getSummariesAndComparisonReport: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/get-summaries-n-comparison-report/${titleSearchId}`).then(data),

  uploadComparisonFile: (titleSearchId: any, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file as any);
    return axios.post(`${API_URL}/title-search/get-status-comparison-report/${titleSearchId}`, formData).then(data);
  },

  generateStructuredSummary: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/smart-summary-json/${titleSearchId}`).then(data),

  retryTitleCommitment: (id: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/retry-title-commitment/${id}`, body).then(data),

  getRecorderByUserType: (titleSearchId: any, body: any, { page, limit }: any, params?: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/recorder/get-by-usertype/${titleSearchId}/${limit}/${page}`, body, { params }).then(data),

  // Missing methods from Angular service
  getPublicFinance: (id: any): Promise<any> => axios.get(`${API_URL}/public-finance/get/${id}`).then(data),
  searchPublicFinance: (id: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/public-finance/search/${id}/${limit}/${page}`, { params: filters }).then(data),
  createPublicFinance: (body: any): Promise<any> => axios.post(`${API_URL}/public-finance/create`, body).then(data),
  updatePublicFinance: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/public-finance/update/${id}`, body).then(data),
  deletePublicFinance: (id: any): Promise<any> => axios.delete(`${API_URL}/public-finance/delete/${id}`).then(data),

  getAttorneyGeneral: (id: any): Promise<any> => axios.get(`${API_URL}/attorney-general/get/${id}`).then(data),
  searchAttorneyGeneral: (id: any, { page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/attorney-general/search/${id}/${limit}/${page}`, { params: filters }).then(data),
  createAttorneyGeneral: (body: any): Promise<any> => axios.post(`${API_URL}/attorney-general/create`, body).then(data),
  updateAttorneyGeneral: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/attorney-general/update/${id}`, body).then(data),
  deleteAttorneyGeneral: (id: any): Promise<any> => axios.delete(`${API_URL}/attorney-general/delete/${id}`).then(data),

  // Migrated from title-users.service.ts
  createConversation: (userId: any): Promise<any> => axios.get(`${API_URL}/chat/create/${userId}`).then(data),

  getTitleUsers: ({ page, limit }: any, filters: any): Promise<any> =>
    axios.get(`${API_URL}/title-company/user/list/${limit}/${page}`, { params: filters }).then(data),

  getTitleUser: (userId: number): Promise<any> => axios.get(`${API_URL}/title-company/user/get/${userId}`).then(data),

  statusChangeTitleUsers: (userId: number, body: any): Promise<any> =>
    axios.put(`${API_URL}/title-company/user/status/${userId}`, body).then(data),

  getTitleAbstractById: (titleSearchId: any): Promise<any> => axios.get(`${API_URL}/title-search/abstract/get/${titleSearchId}`).then(data),

  getTitleAbstractOrderDetailsById: (titleSearchId: any): Promise<any> =>
    axios.get(`${API_URL}/title-search/abstract/order-details/get/${titleSearchId}`).then(data),

  getTitleAbstractAuditorById: (titleSearchId: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/abstract/auditor/get/${titleSearchId}`, body).then(data),

  getTitleAbstractRecorderById: (titleSearchId: any, body: any): Promise<any> =>
    axios.post(`${API_URL}/title-search/abstract/recorder/get/${titleSearchId}`, body).then(data),

  addParticipant: (body: any): Promise<any> => axios.post(`${API_URL}/title-company/participant/create`, body).then(data),

  deleteParticipant: (body: any): Promise<any> => axios.post(`${API_URL}/title-company/participant/delete`, body).then(data),

  createTitleEmployee: (body: any): Promise<any> => axios.post(`${API_URL}/title-company/user/create`, body).then(data),

  updateTitleEmployee: (id: any, body: any): Promise<any> => axios.put(`${API_URL}/title-company/user/update/${id}`, body).then(data),

  getTempPassword: (userId: any): Promise<any> => axios.get(`${API_URL}/title-company/user/get-temp-password/${userId}`).then(data),

  getTitleSearchVersion: (id: any): Promise<any> => axios.get(`${API_URL}/title-search/version/${id}`).then(data),

  shareCreds: (userId: any): Promise<any> => axios.get(`${API_URL}/title-company/user/share-creds/${userId}`).then(data),

  shuffleArray: (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  // --- FEEDBACK API ---
  getTitleSearchFeedback: async (id: string) => {
    try {
      const res = await axios.get(`${API_URL}/title-search-feedback/get/${id}`);
      return data(res);
    } catch (err) {
      throw err;
    }
  },

  listTitleSearchFeedback: async (limit: number, page: number, filters?: any) => {
    try {
      const params: any = { page, limit };
      if (filters) {
        Object.keys(filters).forEach((key) => {
          if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
            params[key] = filters[key];
          }
        });
      }
      const res = await axios.get(`${API_URL}/title-search-feedback/list/${limit}/${page}`, { params });
      return data(res);
    } catch (err) {
      throw err;
    }
  },

  createTitleSearchFeedback: async (body: any) => {
    try {
      const res = await axios.post(`${API_URL}/title-search-feedback/save`, body);
      return data(res);
    } catch (err) {
      throw err;
    }
  },

  updateTitleSearchFeedback: async (body: any) => {
    try {
      const res = await axios.post(`${API_URL}/title-search-feedback/update`, body);
      return data(res);
    } catch (err) {
      throw err;
    }
  },
  // Global search (migrated from Angular)
  globalSearch: (query: string, types: string[] = []): Promise<any> => {
    const params: any = { query };
    if (types && types.length > 0) {
      params.types = types;
    }
    return axios
      .get(`${API_URL}/global-search/search`, { params })
      .then(res => res.data)
      .catch((err) => {
        emitError('Global search failed', err);
        throw err;
      });
  },
};

export default titleSearchService;