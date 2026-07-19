import axios from 'axios';

const API_URL = "https://web-production-dded.up.railway.app"
//  'https://web-production-0a814.up.railway.app/'  ;


export const getCalls = async (userId: number) => {
  const response = await axios.get(`${API_URL}/api/call-data/user/${userId}`);
  return response.data;
};
