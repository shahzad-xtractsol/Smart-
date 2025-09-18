import axios from './auth.service';

const titleCompanyService = {
  updateBusiness: async (body: any) => {
    const res = await axios.post(`/title-company/business/update`, body);
    return res.data;
  },
  createTitleFee: async (titleSearchId: any, body: any) => {
    const res = await axios.post(`/title-company/fee/create/${titleSearchId}`, body);
    return res.data;
  },
  updateTitleFee: async (id: any, body: any) => {
    const res = await axios.post(`/title-company/fee/update/${id}`, body);
    return res.data;
  },
  getTitleFee: async (id: any) => {
    const res = await axios.get(`/title-company/fee/get/${id}`);
    return res.data;
  }
};

export default titleCompanyService;
