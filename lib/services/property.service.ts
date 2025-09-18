import axios from './auth.service';

const propertyService = {
  addPropertyImages: async (propertyId, data) => {
    const res = await axios.post(`/property/add-images/${propertyId}`, data);
    return res.data;
  },
  deletePropertyImage: async (id) => {
    const res = await axios.delete(`/property/delete-image/${id}`);
    return res.data;
  },
  getPropertySuggestions: async (params) => {
    params._googleSessonToken = propertyService.generateRandomString();
    const res = await axios.get(`/auto-complete`, { params });
    return res.data;
  },
  getPropertyById: async (id) => {
    const res = await axios.get(`/property/get/${id}`);
    return res.data;
  },
  getProperty: async (body) => {
    const res = await axios.post(`/title-search/single-address-details`, body);
    return res.data;
  },
  getPropertyOwner: async (body) => {
    const res = await axios.post(`/property/owner-details`, body);
    return res.data;
  },
  isPropertyAvailable: async (params) => {
    const res = await axios.get(`/property/is-property-available`, { params });
    return res.data;
  },
  getAddressDetails: async (params) => {
    const res = await axios.get(`/get-address-details`, { params });
    return res.data;
  },
  listProperty: async () => {
    const res = await axios.get(`/property/list/100/1`);
    return res.data;
  },
  createProperty: async (body) => {
    const res = await axios.post(`/property/create`, body);
    return res.data;
  },
  updateProperty: async (body, id) => {
    const res = await axios.put(`/property/update/${id}`, body, { headers: { enctype: 'multipart/form-data' } });
    return res.data;
  },
  generateRandomString: () => {
    const excludedChars = '"\'/\\:{}()[]^<>.,-;';
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
    const generateChar = (type) => {
      let charCode = 0;
      do {
        if (type === 'digit') charCode = randomInt(48, 58);
        else if (type === 'upper') charCode = randomInt(65, 91);
        else if (type === 'lower') charCode = randomInt(97, 123);
      } while (excludedChars.includes(String.fromCharCode(charCode)));
      return String.fromCharCode(charCode);
    };
    const result = [generateChar('digit'), generateChar('upper'), generateChar('lower')];
    while (result.length < 16) {
      let charCode;
      do {
        charCode = randomInt(33, 123);
      } while (
        excludedChars.includes(String.fromCharCode(charCode)) ||
        (charCode > 57 && charCode < 65) ||
        (charCode > 90 && charCode < 97)
      );
      result.push(String.fromCharCode(charCode));
    }
    return propertyService.shuffleArray(result).join('');
  },
  shuffleArray: (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
};

export default propertyService;
