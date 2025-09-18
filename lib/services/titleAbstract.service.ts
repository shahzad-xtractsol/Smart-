import titleSearchService from './titleSearch.service';

/**
 * Focused wrapper that exposes only the auditor/recorder and related subsection
 * endpoints. This keeps call-sites concise and centralizes any request-shaping.
 */
const titleAbstractService = {
  // Auditor
  getAuditor: (titleSearchId: string, body: any) => titleSearchService.getTitleAbstractAuditorById(titleSearchId, body),
  saveAuditor: (body: any) => titleSearchService.saveAuditor(body),
  getLegalDescription: (body: any) => titleSearchService.saveAuditor(body),

  // Recorder
  // The Next.js service exposes a couple of recorder endpoints. Provide a wrapper
  // that accepts optional paging and params to match the hook signature.
  getRecorder: (titleSearchId: string, body: any, paging?: { page?: number; limit?: number } | any, params?: any) =>
    // If paging is provided use the getRecorderByUserType endpoint which supports paging,
    // otherwise call the base auditor/recorder get endpoint.
    paging && (paging.page || paging.limit)
      ? titleSearchService.getRecorderByUserType(titleSearchId, body, paging, params)
      : titleSearchService.getTitleAbstractRecorderById(titleSearchId, body),
  saveRecorder: (body: any) => titleSearchService.saveRecorder(body),

  // Subsections commonly used by the auditor UI
  // Tax information
  listTaxInformation: (titleSearchId: any) => titleSearchService.listTaxInformation(titleSearchId),
  addTaxInformation: (body: any) => titleSearchService.addTaxInformation(body),
  updateTaxInformation: (body: any) => titleSearchService.updateTaxInformation(body),
  deleteTaxInformation: (id: any) => titleSearchService.deleteTaxInformation(id),

  // Title chain
  listTitleChain: (titleSearchId: any, paging: any, filters?: any) => titleSearchService.listTitleChain(titleSearchId, paging, filters),
  addTitleChain: (body: any) => titleSearchService.addTitleChain(body),
  updateTitleChain: (body: any) => titleSearchService.updateTitleChain(body),
  deleteTitleChain: (id: any) => titleSearchService.deleteTitleChain(id),

  // Generic JSON field helpers (for flexible subsections)
  createJsonField: (opts: { body: any; stakeholderId: any; field: string }) => titleSearchService.createJsonField(opts),
  updateJsonField: (opts: { body: any; stakeholderId: any; recordId: any; field: string }) => titleSearchService.updateJsonField(opts),
  deleteJsonField: (opts: { stakeholderId: any; recordId: any; field: string }) => titleSearchService.deleteJsonField(opts),
};

export default titleAbstractService;
