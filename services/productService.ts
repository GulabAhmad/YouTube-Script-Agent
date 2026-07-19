import axios from 'axios';

const API_URL = "https://web-production-0a814.up.railway.app"
//  'https://web-production-0a814.up.railway.app/'  ;

export interface Product {
  id?: number;
  name: string;
  description: string;
  key_features: Array<{ name: string; description: string }>;
  target_audiences: Array<{
    name: string;
    description: string;
    geography?: string[];
    industry?: string[];
    budget_range?: string[];
    age_group?: string[];
    gender?: string[];
  }>;
  call_settings: {
    duration: number;
    warmupTime: number;
    maxAttempts: number;
  };
  status?: boolean;
  user_id?: number;
}


export const createProduct = async (product: Product, userId: number) => {
  const response = await axios.post(`${API_URL}/products/`, {
    ...product,
    user_id: userId
  }, {
    params: { user_id: userId }
  });
  return response.data;
};

export const updateProduct = async (productId: number, product: Product, userId: number) => {
  const response = await axios.put(`${API_URL}/products/${productId}`, {
    ...product,
    user_id: userId
  }, {
    params: { user_id: userId }
  });
  return response.data;
};

export const getProducts = async (userId: number) => {
  const response = await axios.get(`${API_URL}/products/`, {
    params: { user_id: userId }
  });
  return response.data;
};

export const getProduct = async (productId: number, userId: number) => {
  const response = await axios.get(`${API_URL}/products/${productId}`, {
    params: { user_id: userId }
  });
  return response.data;
};

export const deleteProduct = async (productId: number, userId: number) => {
  await axios.delete(`${API_URL}/products/${productId}`, {
    params: { user_id: userId }
  });
}; 