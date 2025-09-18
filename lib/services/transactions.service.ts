import axios from './auth.service';

export interface TransactionResponse {
  charges: any[];
  count: number;
}

const transactionsService = {
  getTransactions: async ({ page, limit }: { page: number; limit: number }): Promise<TransactionResponse | null> => {
    try {
      const res = await axios.get(`/title-company/transactions/${limit}/${page}`);
      console.log('Transactions response:', res);
      if (res.data.data.charges) {
        const charges = res.data.data.charges.payments;
        return { charges, count: res.data.data.charges.count };
      }
      return null;
    } catch (err) {
      // Optionally log or handle error here
      throw err;
    }
  }
};

export default transactionsService;
