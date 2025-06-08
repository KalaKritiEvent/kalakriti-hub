
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Call login API
      await api.auth.login(formData.email, formData.password);
      
      toast.success('Login successful!');
      
      // Check if there's a redirectPath or stored payment intent
      const paymentIntent = localStorage.getItem('kalakriti-payment-intent');
      
      if (redirectPath === 'payment' && paymentIntent) {
        // If there's a payment intent, redirect to payment page
        const { eventType, numberOfArtworks } = JSON.parse(paymentIntent);
        localStorage.removeItem('kalakriti-payment-intent');
        navigate(`/payment/${eventType}?artworks=${numberOfArtworks}`);
      } else {
        // Otherwise redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-smooth">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-heading">Welcome Back</CardTitle>
                  <CardDescription>
                    Login to your Kalakriti Events account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link 
                          to="/auth/forgot-password" 
                          className="text-sm text-kalakriti-secondary hover:text-blue-700"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-kalakriti-secondary hover:bg-blue-600"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link 
                      to="/auth/signup" 
                      className="text-kalakriti-secondary hover:text-blue-700 font-medium"
                    >
                      Sign up
                    </Link>
                  </div>
                  
                  {redirectPath === 'payment' && (
                    <div className="flex items-center p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                      <div className="mr-2 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                      </div>
                      <p>Login to continue with your payment process.</p>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
