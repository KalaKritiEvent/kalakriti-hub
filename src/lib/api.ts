
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generic fetch function with error handling
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, options);
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error(errorMessage);
    throw error;
  }
}

// Implement functions to handle API requests
export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      localStorage.setItem('kalakriti-token', data.token);
      localStorage.setItem('kalakriti-user', JSON.stringify(data.user));
      
      return data;
    },
    
    signup: async (userData: any) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
    },
    
    getCurrentUser: () => {
      const userString = localStorage.getItem('kalakriti-user');
      return userString ? JSON.parse(userString) : null;
    },
    
    logout: () => {
      localStorage.removeItem('kalakriti-token');
      localStorage.removeItem('kalakriti-user');
    },
    
    isAuthenticated: () => {
      return !!localStorage.getItem('kalakriti-token');
    },
  },
  
  // Events
  events: {
    getAll: async () => {
      return fetchWithErrorHandling(`${API_BASE_URL}/events`);
    },
    
    getByType: async (eventType: string) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/events/${eventType}`);
    },
  },
  
  // Submissions
  submissions: {
    create: async (formData: FormData) => {
      const token = localStorage.getItem('kalakriti-token');
      
      return fetchWithErrorHandling(`${API_BASE_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // FormData for file uploads
      });
    },
    
    getByUser: async () => {
      const token = localStorage.getItem('kalakriti-token');
      
      return fetchWithErrorHandling(`${API_BASE_URL}/submissions/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    },
  },
  
  // Payments
  payments: {
    createOrder: async (eventType: string, numberOfArtworks: number) => {
      const token = localStorage.getItem('kalakriti-token');
      
      return fetchWithErrorHandling(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventType, numberOfArtworks }),
      });
    },
    
    verifyPayment: async (paymentDetails: any) => {
      const token = localStorage.getItem('kalakriti-token');
      
      return fetchWithErrorHandling(`${API_BASE_URL}/payments/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentDetails),
      });
    },
  },

  // User profile
  users: {
    getProfile: async () => {
      const token = localStorage.getItem('kalakriti-token');
      
      return fetchWithErrorHandling(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    },
    
    updateProfile: async (profileData: any) => {
      const token = localStorage.getItem('kalakriti-token');
      
      return fetchWithErrorHandling(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
    },
  },
};
