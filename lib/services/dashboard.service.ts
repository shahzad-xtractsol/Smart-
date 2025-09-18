// import axios from 'utils/auth.service';
import './authOptions';
import axios from 'axios';
// FIX: Property 'env' does not exist on type 'ImportMeta'.
// Prefer Vite env var for client apps; fallback to process.env.API_URI for other environments
const baseURL =  process.env.VITE_API_KEY || '';

const dashboardService = {
  getEmdStatus: async () => {
    const res = await axios.get(`${baseURL}/title-company/emd-status`);
    return res.data;
  },
  getStakeholderCount: async () => {
    try {
      const res = await axios.get(`${baseURL}/title-company/get-stakeholders-count`);
      return res.data;
    } catch (error: any) {
      throw new Error('Failed to fetch stakeholder count: ' + (error?.message || error));
    }
  }
};

export default dashboardService;