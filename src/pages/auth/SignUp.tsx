
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, User, IdCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

const SignUp = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    contestantId: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateContestantId = (id: string) => {
    // Format: S1A25001 (Season-Event-Year-Number)
    const pattern = /^S1[APMDRS]\d{5}$/;
    return pattern.test(id);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contestantId || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (!validateContestantId(formData.contestantId)) {
      toast.error('Invalid contestant ID format. Example: S1A25001');
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call for signup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user data
      const userData = {
        contestantId: formData.contestantId,
        signedUpAt: new Date().toISOString()
      };
      
      localStorage.setItem('kalakriti-token', 'signed-up-token');
      localStorage.setItem('kalakriti-user', JSON.stringify(userData));
      
      toast.success('Account created successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
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
                  <CardTitle className="text-2xl font-heading">Create Account</CardTitle>
                  <CardDescription>
                    Sign up using your contestant ID to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contestantId">Contestant ID</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="contestantId"
                          name="contestantId"
                          type="text"
                          value={formData.contestantId}
                          onChange={handleInputChange}
                          placeholder="S1A25001"
                          className="pl-10 font-mono"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Use the contestant ID you received after submission
                      </p>
                    </div>
                    
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
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
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
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-center text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link 
                      to="/auth/login" 
                      className="text-kalakriti-secondary hover:text-blue-700 font-medium"
                    >
                      Log in
                    </Link>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                    <p className="font-medium mb-1">Don't have a contestant ID?</p>
                    <p>You need to participate in an event first to get your contestant ID via email.</p>
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
