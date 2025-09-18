import axios from './auth.service';

const getUserService = {
  getUser: async (id: any) => {
    const res = await axios.get(`/title-company/user/profile/${id}`);
    return res.data;
  },
  getUserBusiness: async (id: any) => {
    const res = await axios.get(`/title-company/user/business/${id}`);
    return res.data;
  },
  getUserList: async (userType?: string) => {
    const endpoint = `/title-search/user/list${userType ? '?userType=' + userType : ''}`;
    const res = await axios.get(`${endpoint}`);
    return res.data;
  },
  getStakeholdersList: async (userType?: string, name?: string) => {
    const res = await axios.get(`/title-search/stakeholder/list`, { params: { userType, name } });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await axios.get(`/title-company/user/profile`);
    const body = res.data as any;
    // Normalize to always have a top-level { data: person, ...extras }
    if (body && typeof body === 'object' && 'data' in body) return body;
    return { data: body };
  }
};

export default getUserService;
