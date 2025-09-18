import axios from './auth.service';

const verificationService = {
  createLinkToken: async (userId?: number) => {
    const body: any = {
      country_codes: ['US'],
      language: 'en',
      prod: false
    };
    if (userId) body.userId = userId;
    const res = await axios.post(`/verification/plaid/link`, body);
    return res.data;
  },
  createLinkTokenAuth: async () => {
    const body = { country_codes: ['US'], language: 'en', prod: false };
    const res = await axios.post(`/verification/plaid/link/auth`, body);
    return res.data;
  },
  createLinkTokenLiabilities: async () => {
    const body = { country_codes: ['US'], language: 'en', prod: false };
    const res = await axios.post(`/verification/plaid/link/mortgage`, body);
    return res.data;
  },
  exchangePublicToken: async (body: any) => {
    const res = await axios.post(`/verification/plaid/exchange-public-token`, body);
    return res.data;
  },
  verifyIdentity: async (body: any) => {
    const res = await axios.post(`/verification/plaid/identity`, body);
    return res.data;
  },
  saveCurrentUserBankDetails: async (body: any) => {
    const res = await axios.post(`/verification/plaid/save-bank-details`, body);
    return res.data;
  },
  saveUserBankDetails: async (id: any, body: any) => {
    const res = await axios.post(`/verification/plaid/save-bank-details/${id}`, body);
    return res.data;
  },
  connectStripe: async (body: any) => {
    const res = await axios.post(`/payment/createAccount`, body);
    return res.data;
  },
  linkAccount: async (body: any) => {
    const res = await axios.post(`/payment/account-link-title`, body);
    return res.data;
  },
  redirectStripeURL: async ({ status, userId }: { status: string; userId: number }) => {
    const res = await axios.get(`/payment/payment-return/${userId}/${status}`);
    return res.data;
  }
};

export default verificationService;
