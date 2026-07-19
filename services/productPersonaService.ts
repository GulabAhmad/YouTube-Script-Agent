import axios from 'axios';

// const API_URL = "http://localhost:8001"
const API_URL = "https://web-production-dded.up.railway.app"
//  'https://web-production-0a814.up.railway.app/'  ;


export const getProductPersonas = async ( productId: number) => {
  const response = await axios.get(`${API_URL}/api/product-persona/${productId}`);
  return response.data;
};
export const getUserProductPersonas = async ( userId: number) => {
  const response = await axios.get(`${API_URL}/api/product-persona/user/${userId}`);
  return response.data;
};
