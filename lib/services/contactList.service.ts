import './authOptions';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const contactListService = {
  getContactList: async ({ page, limit }: { page: any; limit: any }, filters: any) => {
    try {
      const res = await axios.get(`${API_URL}/title-company/get-contacts/${limit}/${page}`, { params: filters });
      return res.data;
    } catch (error) {
      throw new Error('Failed to fetch contact list: ' + (error?.message || error));
    }
  }
};

export default contactListService;
