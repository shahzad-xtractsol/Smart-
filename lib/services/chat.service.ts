import axios from './auth.service';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const chatService = {
  getChatCount: async (body: any) => {
    const res = await axios.post(`/chat/unseen-count`, body);
    return res.data;
  },
  getContacts: async () => {
  try {
    const response = await axios.get('/chat/all-conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
},
  getChat: async (body: any) => {
  try {
    const response = await axios.post('/chat/conversation', body);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
},
  readMessage: async (conversationId: any) => {
  try {
    const response = await axios.post('/chat/read-message', { conversationId });
    return response.data;
  } catch (error) {
    console.error('Error reading message:', error);
    throw error;
  }
}}

export default chatService;
