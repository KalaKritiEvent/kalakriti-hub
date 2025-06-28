
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';

const eventPricing = {
  art: { name: 'Art Competition', fee: 500, color: 'from-red-500 to-pink-600' },
  photography: { name: 'Photography Contest', fee: 600, color: 'from-blue-500 to-cyan-600' },
  mehndi: { name: 'Mehndi Championship', fee: 450, color: 'from-orange-500 to-red-500' },
  rangoli: { name: 'Rangoli Festival', fee: 400, color: 'from-purple-500 to-pink-500' },
  dance: { name: 'Dance Competition', fee: 700, color: 'from-green-500 to-teal-600' },
  singing: { name: 'Singing Contest', fee: 650, color: 'from-indigo-500 to-purple-600' }
};

const PaymentPage = () => {
  const { eventType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const queryParams = new URLSearchParams(location.search);
  const numberOfArtworks = parseInt(queryParams.get('artworks') || '1');
  const totalAmount = parseInt(queryParams.get('amount') || '0');
  
  const event = eventPricing[eventType as keyof typeof eventPricing];

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('kalakriti-token');
    setIsAuthenticated(!!token);
  }, []);

  if (!event) {
    return <div>Event not found</div>;
  }

  const handlePayment = async () => {
    setLoading(true);

    // If user is not authenticated, store payment intent and redirect to login
    if (!isAuthenticated) {
      localStorage.setItem('kalakriti-payment-intent', JSON.stringify({
        eventType,
        numberOfArtworks,
        totalAmount
      }));
      navigate('/auth/login?redirect=payment');
      return;
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate contestant ID
      const contestantId = generateContestantId(eventType);
      
      // Store payment success info
      localStorage.setItem('kalakriti-payment-success', JSON.stringify({
        eventType,
        numberOfArtworks,
        totalAmount,
        contestantId,
        paymentId: 'PAY_' + Date.now()
      }));
      
      toast.success('Payment successful! Redirecting to submission form...');
      
      // Redirect to submission form
      setTimeout(() => {
        navigate(`/submission/${eventType}?contestantId=${contestantId}`);
      }, 1500);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateContestantId = (eventType: string) => {
    const eventCodes = {
      art: 'A',
      photography: 'P',
      mehndi: 'M',
      rangoli: 'R',
      dance: 'D',
      singing: 'S'
    };
    
    const season = 'S1';
    const eventCode = eventCodes[eventType as keyof typeof eventCodes];
    const year = '25';
    const participantNumber = String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0');
    
    return `${season}${eventCode}${year}${participantNumber}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <Badge className="mb-4">Payment</Badge>
              <h1 className="text-3xl font-bold mb-2">Complete Your Registration</h1>
              <p className="text-gray-600">Secure payment for Kalakriti {event.name}</p>
            </div>

            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Event:</span>
                  <span className="font-medium">Kalakriti {event.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Artworks:</span>
                  <span className="font-medium">{numberOfArtworks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee per Artwork:</span>
                  <span className="font-medium">₹{event.fee}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!isAuthenticated && (
              <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-blue-800">
                    <Lock className="h-5 w-5" />
                    <p>You need to log in to complete the payment process.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>Powered by Razorpay</span>
                  </div>
                </div>

                <Button 
                  className={`w-full bg-gradient-to-r ${event.color} hover:opacity-90 text-white`}
                  size="lg"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ₹${totalAmount}`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  After successful payment, you'll receive a contestant ID and access to the submission form.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;
