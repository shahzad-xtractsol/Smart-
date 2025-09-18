import './authOptions';
import axios from 'axios';
// FIX: Property 'env' does not exist on type 'ImportMeta'.
// Prefer Vite env var for client apps; fallback to process.env.API_URI for other environments
const API_URL =  process.env.VITE_API_KEY || '';

const permissionService = {
  currentUserPermissionList: async () => {
    const res = await axios.get(`${API_URL}/permission/list`);
    const body = res?.data;
    const payload = body?.data ?? body;

    try {
      const hash: Record<string, any> = {};

      if (Array.isArray(payload?.permissionGroups)) {
        payload.permissionGroups.forEach((group: any) => {
          if (!Array.isArray(group?.permission)) return;
          group.permission.forEach((permission: any) => {
            if (permission?.id && !hash[permission.id]) {
              hash[permission.id] = { ...permission, granted: true };
            }
          });
        });
      }

      if (Array.isArray(payload?.userPermissions)) {
        payload.userPermissions.forEach((group: any) => {
          if (!Array.isArray(group?.userPermission)) return;
          group.userPermission.forEach((permission: any) => {
            if (permission?.permissionId) {
              hash[permission.permissionId] = permission;
            }
          });
        });
      }

      try {
        localStorage.setItem('permissions', JSON.stringify(hash));
      } catch (e) {
        // ignore localStorage errors
      }
    } catch (e) {
      // swallow mapping errors to avoid breaking caller
    }

    return res.data;
  },
  listUserTypePermissions: async (filters: any) => {
    const res = await axios.get(`${API_URL}/permission/list-user-type-permissions`, { params: filters });
    return res.data;
  },
  addUserPermission: async (body: any) => {
    const res = await axios.post(`${API_URL}/permission/add-user-permission`, body);
    return res.data;
  },
  removeUserPermission: async (userPermissionId: any) => {
    const res = await axios.delete(`${API_URL}/permission/remove-user-permission/${userPermissionId}`);
    return res.data;
  },
  updateUserTypePermissions: async (body: any) => {
    const res = await axios.post(`${API_URL}/permission/update-user-type-permissions`, body);
    return res.data;
  },
  listUserSpecialPermissions: async ({ limit, page }: { limit: number; page: number }) => {
    const res = await axios.get(`${API_URL}/permission/list-user-special-permissions/${limit}/${page}`);
    return res.data;
  },
  listAllPermissions: async (filter: any) => {
    const res = await axios.get(`${API_URL}/permission/list-all`, { params: filter });
    return res.data;
  }
};

export default permissionService;