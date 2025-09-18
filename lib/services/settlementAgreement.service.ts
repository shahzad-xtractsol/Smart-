import axios from './auth.service';

const settlementAgreementService = {
  getSettlementAgreement: async (purchaseAgreementId: any) => {
    const res = await axios.post(`/settlement-statement/get/${purchaseAgreementId}`, {});
    return res.data;
  }
};

export default settlementAgreementService;
