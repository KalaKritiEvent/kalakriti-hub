
import { toast } from 'sonner';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generic fetch function with error handling
export async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
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
