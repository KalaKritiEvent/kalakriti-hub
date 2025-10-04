
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, FileText, Download, Edit2, Save, X, CheckCircle2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [originalUserData, setOriginalUserData] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [hasParticipated, setHasParticipated] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('kalakriti-user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      setOriginalUserData(user);
      setHasParticipated(!!user.contestantId || user.hasParticipated);
    }
    
    // Load submissions from localStorage
    const storedSubmissions = localStorage.getItem('kalakriti-submissions');
    if (storedSubmissions && userData) {
      const allSubmissions = JSON.parse(storedSubmissions);
      const userSubmissions = allSubmissions.filter((s: any) => s.email === userData.email);
      setSubmissions(userSubmissions);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Save to localStorage
    localStorage.setItem('kalakriti-user', JSON.stringify(userData));
    setOriginalUserData(userData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setUserData(originalUserData);
    setIsEditing(false);
  };

  const handleDownloadCertificate = () => {
    const results = JSON.parse(localStorage.getItem('kalakriti-event-results') || '[]');
    let userResult = null;
    let position = '';
    let category = '';

    // Find user's result
    for (const result of results) {
      for (const [cat, entries] of Object.entries(result.results || {})) {
        const entry = (entries as any[]).find((e: any) => e.participantId === userData.contestantId);
        if (entry) {
          userResult = result;
          position = entry.rank || entry.position;
          category = cat;
          break;
        }
      }
      if (userResult) break;
    }

    if (!userResult) {
      toast.error('Certificate not available. Results must be declared and you must be a winner.');
      return;
    }

    // Generate certificate
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(1);
    doc.rect(15, 15, 267, 180);
    doc.setFontSize(40);
    doc.setTextColor(88, 28, 135);
    doc.text('Certificate of Achievement', 148.5, 50, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(100, 116, 139);
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });
    doc.setFontSize(32);
    doc.setTextColor(30, 41, 59);
    doc.text(userData.fullName, 148.5, 90, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text(`has secured ${position} position in ${category}`, 148.5, 105, { align: 'center' });
    doc.text(`at Kalakriti ${userResult.eventType.charAt(0).toUpperCase() + userResult.eventType.slice(1)} Competition`, 148.5, 115, { align: 'center' });
    doc.text(`${userResult.season} - ${new Date(userResult.publishDate).getFullYear()}`, 148.5, 125, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(139, 92, 246);
    doc.text('Kalakriti Events', 148.5, 165, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 148.5, 175, { align: 'center' });
    doc.text(`Contestant ID: ${userData.contestantId}`, 148.5, 182, { align: 'center' });
    doc.save(`Kalakriti_Certificate_${userData.contestantId}.pdf`);
    toast.success('Certificate downloaded successfully!');
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-kalakriti-primary mb-2">
                My Dashboard
              </h1>
              <p className="text-gray-600">
                {hasParticipated 
                  ? "Welcome back! Here's an overview of your activities and submissions."
                  : "Welcome! Get started by participating in your first event."}
              </p>
            </div>
            {hasParticipated && userData?.contestantId && (
              <Badge variant="default" className="text-lg px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                {userData.contestantId}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Status Banner for Non-Participants */}
        {!hasParticipated && (
          <Card className="mb-6 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start Your Creative Journey
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Participate in an event to get your unique Contestant ID and unlock full dashboard features including certificate downloads, result tracking, and submission history.
                  </p>
                  <Button 
                    onClick={() => navigate('/events')}
                    className="bg-kalakriti-secondary hover:bg-blue-600"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Browse Events & Participate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Profile Information
                    {hasParticipated && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Participant
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isEditing ? "Update your personal details" : "Your account information"}
                  </CardDescription>
                </div>
                {hasParticipated && !isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : isEditing ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSaveProfile}
                      className="bg-kalakriti-secondary hover:bg-blue-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={userData?.fullName || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cannot be edited</p>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={userData?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cannot be edited</p>
                  </div>
                </div>
                
                {hasParticipated && userData?.contestantId && (
                  <div>
                    <Label htmlFor="contestantId">Contestant ID</Label>
                    <Input
                      id="contestantId"
                      name="contestantId"
                      value={userData?.contestantId || 'Not assigned yet'}
                      disabled
                      className="bg-gray-50 font-mono font-bold"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your unique participant identifier</p>
                  </div>
                )}
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={userData?.phoneNumber || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      value={userData?.age || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={userData?.address || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={!hasParticipated ? "Complete after participating" : ""}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={userData?.city || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={!hasParticipated ? "N/A" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={userData?.state || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={!hasParticipated ? "N/A" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={userData?.pincode || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={!hasParticipated ? "N/A" : ""}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access key features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasParticipated ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50"
                    onClick={handleDownloadCertificate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-purple-50"
                    onClick={() => navigate('/results')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-green-50"
                    onClick={() => navigate('/events')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit New Artwork
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-4">
                    Participate in an event to unlock dashboard features
                  </p>
                  <Button 
                    className="w-full bg-kalakriti-secondary hover:bg-blue-600"
                    onClick={() => navigate('/events')}
                  >
                    Explore Events
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submissions History */}
        {hasParticipated && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    My Submissions
                    {submissions.length > 0 && (
                      <Badge variant="secondary">{submissions.length}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Track all your competition entries
                  </CardDescription>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/events')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  New Submission
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission, index) => (
                    <div 
                      key={index}
                      className="p-4 border-2 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{submission.title}</h4>
                            <Badge variant="outline" className="capitalize">
                              {submission.eventType}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{submission.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs">
                            <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              <Award className="h-3 w-3 mr-1" />
                              {submission.contestantId || 'Processing'}
                            </span>
                            <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center text-purple-600 bg-purple-50 px-2 py-1 rounded">
                              <FileText className="h-3 w-3 mr-1" />
                              {submission.files?.length || submission.numberOfArtworks} artwork(s)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">No submissions yet</p>
                  <p className="text-sm text-gray-500 mb-4">Start your creative journey by submitting your first artwork</p>
                  <Button 
                    className="bg-kalakriti-secondary hover:bg-blue-600"
                    onClick={() => navigate('/events')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Your First Artwork
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
