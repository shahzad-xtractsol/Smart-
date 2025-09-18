import axios from 'axios';
import './authOptions';
// FIX: Property 'env' does not exist on type 'ImportMeta'.
// Prefer Vite env var for client apps; fallback to process.env.API_URI for other environments
const API_URL =  process.env.VITE_API_KEY || '';

const titleUsersService = {
  createConversation: async (userId: any) => {
    try {
      const res = await axios.get(`${API_URL}/chat/create/${userId}`);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  getTitleUsers: async ({ page, limit }: { page: any; limit: any }, filters: any) => {
    try {
      const res = await axios.get(`${API_URL}/title-company/user/list/${limit}/${page}`, { params: filters });
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  getTitleUser: async (userId: any) => {
    try {
      const res = await axios.get(`${API_URL}/title-company/user/get/${userId}`);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  statusChangeTitleUsers: async (userId: any, body: any) => {
    try {
      const res = await axios.put(`${API_URL}/title-company/user/status/${userId}`, body);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  getTitleAbstractById: async (titleSearchId: any) => {
    try {
      const res = await axios.get(`${API_URL}/title-search/abstract/get/${titleSearchId}`);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  getTitleAbstractOrderDetailsById: async (titleSearchId: any) => {
    try {
      const res = await axios.get(`${API_URL}/title-search/abstract/order-details/get/${titleSearchId}`);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  getTitleAbstractAuditorById: async (titleSearchId: any, body: any) => {
    try {
      const res = await axios.post(`${API_URL}/title-search/abstract/auditor/get/${titleSearchId}`, body);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  getTitleAbstractRecorderById: async (titleSearchId: any, body: any) => {
    try {
      const res = await axios.post(`${API_URL}/title-search/abstract/recorder/get/${titleSearchId}`, body);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  addParticipant: async (body: any) => {
    try {
      const res = await axios.post(`${API_URL}/title-company/participant/create`, body);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  deleteParticipant: async (body: any) => {
    try {
      const res = await axios.post(`${API_URL}/title-company/participant/delete`, body);
      console.log('Response from deleteParticipant:', res);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  createTitleEmployee: async (body: any) => {
    try {
      const res = await axios.post(`${API_URL}/title-company/user/create`, body);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  updateTitleEmployee: async (id: any, body: any) => {
    try {
      const res = await axios.put(`${API_URL}/title-company/user/update/${id}`, body);
      console.log('Response from updateTitleEmployee:', res.data);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  getTempPassword: async (userId: any) => {
    try {
      const res = await axios.get(`${API_URL}/title-company/user/get-temp-password/${userId}`);
      return res.data;
    } catch (error) {
      return { error };
    }
  },
  shareCreds: async (userId: any) => {
    try {
      const res = await axios.get(`${API_URL}/title-company/user/share-creds/${userId}`);
      return res.data;
    } catch (error) {
      return { error };
    }
  }
};

export default titleUsersService;