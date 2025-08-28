import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Recipe API calls
export const recipeAPI = {
    getAll: (params) => api.get('/recipes', { params }),
    getById: (id) => api.get(`/recipes/${id}`),
    create: (recipeData) => api.post('/recipes', recipeData),
    update: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
    delete: (id) => api.delete(`/recipes/${id}`),
    save: (id) => api.post(`/recipes/${id}/save`),
    unsave: (id) => api.delete(`/recipes/${id}/save`),
    cook: (id, data) => api.post(`/recipes/${id}/cook`, data),
    getSaved: (params) => api.get('/recipes/saved/list', { params }),
    getCooked: (params) => api.get('/recipes/cooked/list', { params }),
};

// Dashboard API calls
export const dashboardAPI = {
    getDashboard: (userId) => api.get('/dashboard', { params: { userId } }),
    getMyRecipes: (userId) => api.get('/my-recipes', { params: { userId } }),
};

export default api;