
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Calendar, 
  FileText, 
  Download, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Image,
  Award,
  Clock
} from 'lucide-react';

const UserDashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    // Load user data
    const user = localStorage.getItem('kalakriti-user');
    const submission = localStorage.getItem('kalakriti-submission');
    
    if (user) {
      setUserData(JSON.parse(user));
    }
    
    if (submission) {
      setSubmissionData(JSON.parse(submission));
    }
  }, []);

  const getEventName = (eventType: string) => {
    const eventNames = {
      art: 'Art Competition',
      photography: 'Photography Contest',
      mehndi: 'Mehndi Championship',
      rangoli: 'Rangoli Festival',
      dance: 'Dance Competition',
      singing: 'Singing Contest'
    };
    return eventNames[eventType as keyof typeof eventNames] || eventType;
  };

  const getEventColor = (eventType: string) => {
    const colors = {
      art: 'from-red-500 to-pink-600',
      photography: 'from-blue-500 to-cyan-600',
      mehndi: 'from-orange-500 to-red-500',
      rangoli: 'from-purple-500 to-pink-500',
      dance: 'from-green-500 to-teal-600',
      singing: 'from-indigo-500 to-purple-600'
    };
    return colors[eventType as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
          <p className="text-gray-600">
            Contestant ID: <span className="font-mono font-bold text-blue-600">{userData.contestantId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {submissionData ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                        {submissionData.firstName?.[0]}{submissionData.lastName?.[0]}
                      </div>
                      <h3 className="font-semibold text-lg">
                        {submissionData.firstName} {submissionData.lastName}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{submissionData.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{submissionData.phone}</span>
                      </div>
                      {submissionData.city && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{submissionData.city}, {submissionData.state}</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Complete your submission to see profile details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Participation */}
            {submissionData && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Current Participation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`bg-gradient-to-r ${getEventColor(submissionData.eventType)} p-6 rounded-lg text-white mb-4`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          Kalakriti {getEventName(submissionData.eventType)}
                        </h3>
                        <p className="text-white/80">Season 1 • 2025</p>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        Submitted
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Artwork Title:</strong> {submissionData.artworkTitle || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Files Submitted:</strong> {submissionData.numberOfArtworks}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Submitted:</strong> {new Date(submissionData.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Status:</strong> Under Review
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {submissionData.artworkDescription && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm"><strong>Description:</strong></p>
                      <p className="text-sm text-gray-600 mt-1">{submissionData.artworkDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Download className="h-6 w-6" />
                    <span>Download Certificate</span>
                    <span className="text-xs text-gray-500">Available after results</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Award className="h-6 w-6" />
                    <span>View Results</span>
                    <span className="text-xs text-gray-500">Coming soon</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Account created successfully</p>
                      <p className="text-xs text-gray-500">
                        {new Date(userData.signedUpAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {submissionData && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Artwork submitted for review</p>
                        <p className="text-xs text-gray-500">
                          {new Date(submissionData.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment completed</p>
                      <p className="text-xs text-gray-500">Registration fee processed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
