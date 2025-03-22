
import { toast } from 'sonner';
import { connectToDatabase, COLLECTIONS } from './mongoConfig';

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

// MongoDB implementation note: In a real production environment,
// you would create API endpoints that interact with MongoDB
// and call those endpoints from these functions.

// Implement functions to handle API requests
export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      try {
        // In a real implementation, you would:
        // 1. Call your backend API which would use MongoDB to verify credentials
        // 2. The API would return a JWT token and user data
        
        // For now, using the mock implementation
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
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    signup: async (userData: any) => {
      try {
        // In a real implementation, you would:
        // 1. Call your backend API which would use MongoDB to create a user
        // 2. The API would hash the password, store user data, and return a result
        
        // For now, using the mock implementation
        return fetchWithErrorHandling(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
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
      // In a real implementation, you would:
      // 1. Call your backend API to get events from MongoDB
      
      return fetchWithErrorHandling(`${API_BASE_URL}/events`);
    },
    
    getByType: async (eventType: string) => {
      // In a real implementation, you would:
      // 1. Call your backend API to get a specific event from MongoDB
      
      return fetchWithErrorHandling(`${API_BASE_URL}/events/${eventType}`);
    },
  },
  
  // Submissions
  submissions: {
    create: async (formData: FormData) => {
      // In a real implementation, you would:
      // 1. Call your backend API which would:
      //    - Upload files to Amazon S3
      //    - Save submission metadata to MongoDB
      //    - Return success/failure and submission details
      
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
      // In a real implementation, you would:
      // 1. Call your backend API which would get submissions for the current user from MongoDB
      
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
      // In a real implementation, you would:
      // 1. Call your backend API which would create a payment order in your payment gateway
      //    and save the order details to MongoDB
      
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
      // In a real implementation, you would:
      // 1. Call your backend API which would verify the payment with your payment gateway
      //    and update the payment status in MongoDB
      
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
      // In a real implementation, you would:
      // 1. Call your backend API which would get the user's profile data from MongoDB
      
      const token = localStorage.getItem('kalakriti-token');
      
      return fetchWithErrorHandling(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    },
    
    updateProfile: async (profileData: any) => {
      // In a real implementation, you would:
      // 1. Call your backend API which would update the user's profile in MongoDB
      
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
