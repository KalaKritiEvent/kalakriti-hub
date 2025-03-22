
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Image, Mail, Phone, User as UserIcon, MapPin, Clock, FileText, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contestantId: string;
  createdAt: string;
}

interface Submission {
  _id: string;
  eventType: string;
  title: string;
  description: string;
  fileUrls: string[];
  paymentId: string;
  orderId: string;
  status: 'submitted' | 'under-review' | 'completed';
  result?: {
    rank?: number;
    score?: number;
    feedback?: string;
  };
  createdAt: string;
}

const UserDashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, submissionsData] = await Promise.all([
          api.users.getProfile(),
          api.submissions.getByUser()
        ]);
        
        setProfile(profileData);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-700';
      case 'under-review':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEventTitle = (eventType: string) => {
    const eventMap: Record<string, string> = {
      'art': 'Kalakriti Art Event',
      'photography': 'Kalakriti Photography Event',
      'mehndi': 'Kalakriti Mehndi Event',
      'rangoli': 'Kalakriti Rangoli Event',
      'dance': 'Kalakriti Dance Event',
      'singing': 'Kalakriti Singing Event'
    };
    
    return eventMap[eventType] || eventType;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold text-kalakriti-primary">Your Dashboard</h2>
        <p className="text-gray-600">
          Welcome back, {profile?.firstName || 'Artist'}! Manage your submissions and track your progress.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview" className="text-sm">
            <Activity size={16} className="mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="submissions" className="text-sm">
            <Image size={16} className="mr-2" />
            My Submissions
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-sm">
            <UserIcon size={16} className="mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Artist Stats */}
            <Card className="md:col-span-8 bg-white shadow-smooth">
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
                <CardDescription>
                  Overview of your participation and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">Total Submissions</p>
                    <p className="text-3xl font-bold text-kalakriti-primary mt-1">{submissions.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">Events Participated</p>
                    <p className="text-3xl font-bold text-kalakriti-primary mt-1">
                      {new Set(submissions.map(s => s.eventType)).size}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">Results Received</p>
                    <p className="text-3xl font-bold text-kalakriti-primary mt-1">
                      {submissions.filter(s => s.status === 'completed').length}
                    </p>
                  </div>
                </div>
                
                {submissions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Submissions</h4>
                    <div className="space-y-3">
                      {submissions.slice(0, 3).map((submission) => (
                        <div key={submission._id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 mr-3">
                            <div className="h-10 w-10 bg-kalakriti-blue-light rounded-full flex items-center justify-center">
                              <Image size={18} className="text-kalakriti-secondary" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-kalakriti-primary">{submission.title}</h5>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(submission.status)}`}>
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace('-', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{getEventTitle(submission.eventType)}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock size={12} className="mr-1" />
                              <span>{formatDate(submission.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveTab('submissions')}
                  className="ml-auto"
                >
                  View All Submissions
                </Button>
              </CardFooter>
            </Card>
            
            {/* Profile Card */}
            <Card className="md:col-span-4 bg-white shadow-smooth">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Personal information and contestant details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile && (
                  <>
                    <div className="flex flex-col items-center mb-6">
                      <div className="h-20 w-20 bg-gradient-to-br from-kalakriti-secondary to-blue-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </div>
                      <h3 className="font-medium">{profile.firstName} {profile.lastName}</h3>
                      <p className="text-sm text-gray-600">Contestant ID: {profile.contestantId}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail size={16} className="mr-3 text-gray-500" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={16} className="mr-3 text-gray-500" />
                        <span>{profile.phoneNumber}</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <MapPin size={16} className="mr-3 text-gray-500 mt-0.5" />
                        <span>
                          {profile.address}, {profile.city}, {profile.state} - {profile.pincode}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-3 text-gray-500" />
                        <span>Joined on {formatDate(profile.createdAt)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveTab('profile')}
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-6">
          <Card className="bg-white shadow-smooth">
            <CardHeader>
              <CardTitle>Your Submissions</CardTitle>
              <CardDescription>
                All your event submissions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Image size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No submissions yet</h3>
                  <p className="text-gray-500 mb-4">You haven't submitted any entries for events yet.</p>
                  <Button onClick={() => window.location.href = '/'}>
                    Browse Events
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {submissions.map((submission) => (
                    <motion.div 
                      key={submission._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 rounded-lg overflow-hidden"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-kalakriti-primary mr-3">{submission.title}</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(submission.status)}`}>
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace('-', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{getEventTitle(submission.eventType)}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              <span>{formatDate(submission.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <FileText size={14} className="mr-1" />
                              Description
                            </h4>
                            <p className="text-sm text-gray-600">{submission.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Submission Details</h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="w-24 flex-shrink-0">Order ID:</span>
                                <span className="font-mono">{submission.orderId}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="w-24 flex-shrink-0">Payment ID:</span>
                                <span className="font-mono">{submission.paymentId}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="w-24 flex-shrink-0">Files:</span>
                                <span>{submission.fileUrls.length} file(s)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Preview Images/Files */}
                        {submission.fileUrls.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Your Submission</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {submission.fileUrls.map((url, index) => (
                                <a 
                                  key={index} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block rounded-md overflow-hidden border border-gray-200 hover:border-kalakriti-secondary transition-colors h-24"
                                >
                                  {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                    <img 
                                      src={url} 
                                      alt={`Submission ${index + 1}`} 
                                      className="w-full h-full object-cover" 
                                    />
                                  ) : url.match(/\.(mp4|mov|avi)$/i) ? (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                                      <span className="text-xs">Video</span>
                                    </div>
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                      <span className="text-xs text-gray-500">File {index + 1}</span>
                                    </div>
                                  )}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Results if available */}
                        {submission.status === 'completed' && submission.result && (
                          <div className="mt-6 p-4 bg-kalakriti-blue-light rounded-md">
                            <h4 className="font-medium text-kalakriti-primary flex items-center mb-3">
                              <Award size={16} className="mr-2" />
                              Results
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {submission.result.rank && (
                                <div className="bg-white rounded-md p-3 text-center">
                                  <p className="text-sm text-gray-500">Rank</p>
                                  <p className="text-2xl font-bold text-kalakriti-primary">
                                    {submission.result.rank}
                                    <span className="text-sm font-normal text-gray-500 ml-1">
                                      {submission.result.rank === 1 ? 'st' : 
                                       submission.result.rank === 2 ? 'nd' : 
                                       submission.result.rank === 3 ? 'rd' : 'th'}
                                    </span>
                                  </p>
                                </div>
                              )}
                              
                              {submission.result.score && (
                                <div className="bg-white rounded-md p-3 text-center">
                                  <p className="text-sm text-gray-500">Score</p>
                                  <p className="text-2xl font-bold text-kalakriti-primary">
                                    {submission.result.score}
                                    <span className="text-sm font-normal text-gray-500 ml-1">/100</span>
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {submission.result.feedback && (
                              <div className="mt-3 p-3 bg-white rounded-md">
                                <p className="text-sm text-gray-500 mb-1">Feedback</p>
                                <p className="text-gray-700">{submission.result.feedback}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-white shadow-smooth">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                View and update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div>
                  <div className="flex flex-col items-center mb-8">
                    <div className="h-24 w-24 bg-gradient-to-br from-kalakriti-secondary to-blue-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                    </div>
                    <h3 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-gray-600 mt-1">Contestant ID: {profile.contestantId}</p>
                    <p className="text-sm text-gray-500 mt-1">Joined on {formatDate(profile.createdAt)}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                        <UserIcon size={16} className="mr-2" />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">First Name</p>
                          <p className="font-medium">{profile.firstName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Name</p>
                          <p className="font-medium">{profile.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{profile.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                        <MapPin size={16} className="mr-2" />
                        Address
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <p className="text-sm text-gray-500">Street Address</p>
                          <p className="font-medium">{profile.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="font-medium">{profile.city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">State</p>
                          <p className="font-medium">{profile.state}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pincode</p>
                          <p className="font-medium">{profile.pincode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button className="w-full sm:w-auto">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No profile information available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default UserDashboard;
