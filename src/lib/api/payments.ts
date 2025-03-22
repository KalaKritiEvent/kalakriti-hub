
import { fetchWithErrorHandling, API_BASE_URL } from '../apiUtils';

export const paymentsApi = {
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
};
