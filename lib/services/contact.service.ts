import './authOptions';
import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const contactService = {
  getContactList: async () => {
    try {
      const res = await axios.get(`${baseURL}/title-company/get-contacts`);
      return res.data;
    } catch (error) {
      throw new Error('Failed to fetch contact list: ' + (error?.message || error));
    }
  },
  addContact: async (body: any) => {
    try {
      const res = await axios.post(`${baseURL}/invitation/create`, body);
      return res.data;
    } catch (error) {
      throw new Error('Failed to fetch contact list: ' + (error?.message || error));
    }
  }
};

export default contactService;
