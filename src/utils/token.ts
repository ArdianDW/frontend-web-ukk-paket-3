import axios from 'axios';

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh: refreshToken,
    });
    const { access } = response.data;
    setTokens(access, refreshToken);
    return access;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};
