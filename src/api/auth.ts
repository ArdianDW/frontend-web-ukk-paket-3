import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/petugas';

export const login = async (username: string, password: string) => {
  try {
    const loginData = { username, password };
    console.log('Sending login request with:', loginData);
    const response = await axios.post(`${API_URL}/login/`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Login response:', response.data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login error:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', (error as Error).message);
    }
    throw error;
  }
};

export const refreshToken = async (refreshToken: string) => {
  return axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
};
