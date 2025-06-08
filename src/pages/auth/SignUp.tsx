
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Lock, User, Phone, CreditCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const SignUp = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    contestantId: '',
    acceptTerms: false
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
  };
  
  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    // Terms acceptance
    if (!formData.acceptTerms) {
      toast.error('You must accept the terms and conditions');
      return false;
    }
    
    // If contestant signup, validate contestant ID
    if (activeTab === 'contestant' && !formData.contestantId) {
      toast.error('Please enter your Contestant ID');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const signupData = {
        ...formData,
        signupType: activeTab
      };
      
      // Call signup API
      await api.auth.signup(signupData);
      
      toast.success('Sign up successful!');
      
      // Log in the user
      await api.auth.login(formData.email, formData.password);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('There was an error creating your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-smooth">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-heading">Create Your Account</CardTitle>
                  <CardDescription>
                    Join Kalakriti Events to participate in our competitions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6 w-full">
                      <TabsTrigger value="general" className="flex-1">General Signup</TabsTrigger>
                      <TabsTrigger value="contestant" className="flex-1">Contestant Signup</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general">
                      <div className="mb-4 px-4 py-3 bg-blue-50 rounded-md text-sm text-blue-800">
                        <p className="font-medium mb-1">General Signup</p>
                        <p>Create a new account to browse and participate in Kalakriti events.</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contestant">
                      <div className="mb-4 px-4 py-3 bg-blue-50 rounded-md text-sm text-blue-800">
                        <p className="font-medium mb-1">Contestant Signup</p>
                        <p>If you've already participated in an event and received a contestant ID, use this option to create your account.</p>
                      </div>
                    </TabsContent>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>
                      
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
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="10-digit mobile number"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      {activeTab === 'contestant' && (
                        <div className="space-y-2">
                          <Label htmlFor="contestantId">Contestant ID</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="contestantId"
                              name="contestantId"
                              value={formData.contestantId}
                              onChange={handleInputChange}
                              placeholder="Enter the ID received in your confirmation email"
                              className="pl-10"
                              required={activeTab === 'contestant'}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
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
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input 
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 mt-6">
                        <Checkbox 
                          id="acceptTerms" 
                          checked={formData.acceptTerms}
                          onCheckedChange={handleCheckboxChange}
                          className="mt-1"
                        />
                        <Label 
                          htmlFor="acceptTerms" 
                          className="text-sm font-normal leading-relaxed"
                        >
                          I agree to the{' '}
                          <Link to="/terms-of-service" className="text-kalakriti-secondary hover:text-blue-700">
                            Terms of Service
                          </Link>
                          {' '}and{' '}
                          <Link to="/privacy-policy" className="text-kalakriti-secondary hover:text-blue-700">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-kalakriti-secondary hover:bg-blue-600 mt-6"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </Tabs>
                </CardContent>
                <CardFooter className="justify-center">
                  <div className="text-center text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link 
                      to="/auth/login" 
                      className="text-kalakriti-secondary hover:text-blue-700 font-medium"
                    >
                      Log in
                    </Link>
                  </div>
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

export default SignUp;
