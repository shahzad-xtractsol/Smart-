import axios from './auth.service';

const notificationService = {
  markAsRead: async () => {
    const res = await axios.patch(`/notification/seen`, {});
    return res.data;
  },
  getNotifications: async (query: any) => {
    const res = await axios.get(`/notification/getAll`, { params: query });
    return res.data;
  },
  getUnseenCount: async () => {
    const res = await axios.get(`/notification/count-unseen`);
    return res.data;
  }
};

export default notificationService;
