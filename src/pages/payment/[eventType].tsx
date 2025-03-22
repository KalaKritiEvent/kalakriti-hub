
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, CreditCard, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getEventDetails, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import SubmissionForm from '@/components/forms/SubmissionForm';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const { eventType } = useParams<{ eventType: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialArtworks = Number(queryParams.get('artworks')) || 1;
  
  const [numberOfArtworks, setNumberOfArtworks] = useState(initialArtworks);
  const [loading, setLoading] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    orderId: string;
  } | null>(null);
  
  // Validate event type
  if (!eventType || !getEventDetails(eventType)) {
    navigate('/');
    return null;
  }
  
  const eventDetails = getEventDetails(eventType);
  
  // Find pricing for selected number of artworks
  const selectedPricing = eventDetails.pricing.find(p => p.artworks === numberOfArtworks);
  
  // Handle payment initiation
  const handlePayment = async () => {
    if (!selectedPricing) return;
    
    try {
      setLoading(true);
      
      // Ensure user is logged in
      if (!api.auth.isAuthenticated()) {
        // If not logged in, store intended payment details and redirect to login
        localStorage.setItem('kalakriti-payment-intent', JSON.stringify({
          eventType,
          numberOfArtworks
        }));
        
        toast.info('Please log in to continue with your payment');
        navigate('/auth/login?redirect=payment');
        return;
      }
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again later.');
        return;
      }
      
      // Create order on server
      const order = await api.payments.createOrder(eventType, numberOfArtworks);
      
      // Open Razorpay payment dialog
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY_ID',
        amount: order.amount,
        currency: order.currency,
        name: 'Kalakriti Hub',
        description: `Payment for ${eventDetails.title}`,
        order_id: order.id,
        prefill: {
          name: api.auth.getCurrentUser()?.name || '',
          email: api.auth.getCurrentUser()?.email || '',
          contact: api.auth.getCurrentUser()?.phoneNumber || ''
        },
        theme: {
          color: '#4F6BFF'
        },
        handler: function(response: any) {
          // Payment successful
          setPaymentDetails({
            paymentId: response.razorpay_payment_id,
            orderId: order.id
          });
          setPaymentSuccessful(true);
          
          // Verify payment on server
          api.payments.verifyPayment({
            paymentId: response.razorpay_payment_id,
            orderId: order.id,
            signature: response.razorpay_signature,
            eventType,
            numberOfArtworks
          });
        }
      };
      
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('There was an error processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/events/${eventType}`)}
              className="flex items-center text-kalakriti-secondary hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to {eventDetails.title}</span>
            </button>
          </div>
          
          {paymentSuccessful ? (
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-smooth p-6 mb-12 text-center"
              >
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-heading font-semibold mb-2 text-kalakriti-primary">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Your payment for {eventDetails.title} has been processed successfully.
                  Please complete the submission form below.
                </p>
                
                <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-lg text-left">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-24 flex-shrink-0 font-medium">Payment ID:</span>
                      <span className="font-mono">{paymentDetails?.paymentId}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-24 flex-shrink-0 font-medium">Order ID:</span>
                      <span className="font-mono">{paymentDetails?.orderId}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-24 flex-shrink-0 font-medium">Amount:</span>
                      <span>{formatCurrency(selectedPricing?.price || 0)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Submission Form */}
              {paymentDetails && (
                <SubmissionForm
                  eventType={eventType}
                  numberOfArtworks={numberOfArtworks}
                  paymentId={paymentDetails.paymentId}
                  orderId={paymentDetails.orderId}
                />
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="shadow-smooth">
                    <CardHeader>
                      <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Select Number of Artworks</h3>
                        <RadioGroup 
                          value={numberOfArtworks.toString()} 
                          onValueChange={(value) => setNumberOfArtworks(Number(value))}
                        >
                          {eventDetails.pricing.map((price) => (
                            <div key={price.artworks} className="flex items-center space-x-2 mb-2">
                              <RadioGroupItem 
                                value={price.artworks.toString()} 
                                id={`artworks-${price.artworks}`} 
                              />
                              <Label htmlFor={`artworks-${price.artworks}`} className="flex flex-1 justify-between">
                                <span>{price.artworks} {price.artworks > 1 ? 'Artworks' : 'Artwork'}</span>
                                <span className="font-medium">{formatCurrency(price.price)}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Package</span>
                            <span>{numberOfArtworks} {numberOfArtworks > 1 ? 'Artworks' : 'Artwork'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Event</span>
                            <span>{eventDetails.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatCurrency(selectedPricing?.price || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span>₹0</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(selectedPricing?.price || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-kalakriti-secondary hover:bg-blue-600 text-white"
                        onClick={handlePayment}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay {formatCurrency(selectedPricing?.price || 0)}
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
              
              <div className="md:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-gray-50 shadow-smooth">
                    <CardHeader>
                      <CardTitle className="text-base">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <div className="h-16 w-16 bg-white rounded overflow-hidden mr-3 flex-shrink-0">
                          <img 
                            src={eventDetails.image} 
                            alt={eventDetails.title} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{eventDetails.title}</h3>
                          <p className="text-sm text-gray-600">
                            {numberOfArtworks} {numberOfArtworks > 1 ? 'Artworks' : 'Artwork'} Package
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Secure payment with Razorpay</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Submit {numberOfArtworks} {numberOfArtworks > 1 ? 'artworks' : 'artwork'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Receive digital certificate</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Get feedback from experts</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Access contestant dashboard</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start">
                      <p className="text-xs text-gray-500">
                        By proceeding with the payment, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </CardFooter>
                  </Card>
                  
                  <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-1">What happens next?</p>
                    <p>After payment, you'll complete a submission form and upload your {numberOfArtworks > 1 ? 'artworks' : 'artwork'}. You'll receive a confirmation email with your contestant ID.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;
