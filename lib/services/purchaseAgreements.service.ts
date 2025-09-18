import axios from './auth.service';

const purchaseAgreementsService = {
  getPurchaseAgreements: async ({ page, limit }: { page: number; limit: number }, filters: any) => {
    const res = await axios.get(`/title-company/in-contract-purchase-agreements/${limit}/${page}`, { params: filters });
    return res.data;
  },
  getpurchaseAgreement: async (id: any) => {
    const res = await axios.get(`/title-company/purchase-agreement/${id}`);
    return res.data;
  },
  getVersions: async (purchaseAgreementId: any) => {
    const res = await axios.get(`/purchase-contract/previous-versions/${purchaseAgreementId}`, { headers: { responseType: 'blob' } });
    return res.data;
  },
  getVersion: async (purchaseAgreementId: any, version: any) => {
    const res = await axios.get(`/purchase-contract/version/${purchaseAgreementId}/${version}`);
    return res.data;
  }
};

export default purchaseAgreementsService;
