
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const authStatus = api.auth.isAuthenticated();
        setIsAuthenticated(authStatus);
        
        if (!authStatus) {
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-kalakriti-secondary mx-auto mb-4" />
            <h1 className="text-2xl font-medium mb-2">Loading Dashboard</h1>
            <p className="text-gray-600">Please wait while we load your information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="h2 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">You need to log in to access your dashboard.</p>
            <Button onClick={() => navigate('/auth/login')}>
              Log In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // If authenticated, show dashboard
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20 bg-gray-50">
        <UserDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
