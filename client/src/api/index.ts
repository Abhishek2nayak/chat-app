import axios, { AxiosError, AxiosInstance } from 'axios';

const apiService: AxiosInstance = axios.create({
  baseURL: import.meta.env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = (): string | null => {
  return localStorage.getItem('chat-token') || "";
};

apiService.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      console.error('Unauthorized request:', error.message);
        window.location.href = "/login";
      // handle unauthorized error
      // Example: router.push('/login'); // for Vue Router
    }
    return Promise.reject(error);
  }
);

export const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  try {
    const response = await apiService.get<T>(url, { params });
    return response.data;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

export const post = async <T>(url: string, data: Record<string, unknown>): Promise<T> => {
  try {
    const response = await apiService.post<T>(url, data);
    return response.data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};
