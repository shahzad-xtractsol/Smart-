import './authOptions';
import axios from 'axios';
// FIX: Property 'env' does not exist on type 'ImportMeta'.
// Prefer Vite env var for client apps; fallback to process.env.API_URI for other environments
const API_URL =  process.env.VITE_API_KEY || '';

const titleSearchVersionService = {
  getTitleSearchVersionList: async (titleSearchId: any) => {
    const res = await axios.get(`${API_URL}/title-search/version/list/${titleSearchId}`);
    return res.data;
  },
  getTitleSearchVersionById: async (titleSearchId: any) => {
    const res = await axios.get(`${API_URL}/title-search-version/get/${titleSearchId}`);
    return res.data;
  },
  isLatestVersion: async (titleSearchId: any) => {
    const res = await axios.get(`${API_URL}/title-search-version/is-latest/${titleSearchId}`);
    return res.data;
  }
};

export default titleSearchVersionService;