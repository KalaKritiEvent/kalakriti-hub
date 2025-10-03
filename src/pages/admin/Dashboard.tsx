import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Trophy, 
  FileText, 
  LogOut, 
  Search, 
  Award,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import ResultUpload from '@/components/admin/ResultUpload';
import QueriesManagement from '@/components/admin/QueriesManagement';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import * as XLSX from 'xlsx';

interface Participant {
  participantId: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  eventType: string;
  eventName: string;
  registrationDate: string;
  status: string;
  paymentStatus: string;
  submissionFileName: string;
  previousExperience?: string;
}

interface Result {
  participantId: string;
  eventType: string;
  position: number;
  score: number;
  remarks: string;
  publishedDate: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [newResult, setNewResult] = useState({
    participantId: '',
    eventType: '',
    position: 1,
    score: 0,
    remarks: ''
  });

  const eventTypes = ['art', 'photography', 'mehndi', 'rangoli', 'dance', 'singing'];
  const eventNames = {
    art: 'Art Competition',
    photography: 'Photography Competition',
    mehndi: 'Mehndi Competition',
    rangoli: 'Rangoli Competition',
    dance: 'Dance Competition',
    singing: 'Singing Competition'
  };

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('kalakriti-admin-token');
    if (!adminToken) {
      navigate('/admin');
      return;
    }

    // Load participants and results from localStorage
    const storedParticipants = JSON.parse(localStorage.getItem('kalakriti-participants') || '[]');
    const storedResults = JSON.parse(localStorage.getItem('kalakriti-results') || '[]');
    
    setParticipants(storedParticipants);
    setResults(storedResults);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('kalakriti-admin-token');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const getAvailableSeasons = () => {
    const seasons = ['all', '2024', '2025'];
    return seasons;
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.participantId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === 'all' || participant.eventType === selectedEvent;
    const matchesSeason = selectedSeason === 'all' || participant.registrationDate.includes(selectedSeason);
    return matchesSearch && matchesEvent && matchesSeason;
  });

  const exportToExcel = () => {
    if (filteredParticipants.length === 0) {
      toast.error('No participants to export');
      return;
    }

    const exportData = filteredParticipants.map(p => ({
      'Participant ID': p.participantId,
      'Full Name': p.fullName,
      'Email': p.email,
      'Phone': p.phone,
      'City': p.city,
      'State': p.state,
      'Competition': eventNames[p.eventType as keyof typeof eventNames],
      'Registration Date': new Date(p.registrationDate).toLocaleDateString(),
      'Status': p.status,
      'Payment Status': p.paymentStatus,
      'Artwork File': p.submissionFileName || 'Not submitted'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    
    const filename = `participants_${selectedEvent}_${selectedSeason}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    toast.success('Excel file downloaded successfully!');
  };

  const getEventStats = () => {
    const stats = eventTypes.map(eventType => ({
      eventType,
      eventName: eventNames[eventType as keyof typeof eventNames],
      participantCount: participants.filter(p => p.eventType === eventType).length,
      resultsPublished: results.filter(r => r.eventType === eventType).length
    }));
    return stats;
  };

  const handlePublishResult = () => {
    if (!newResult.participantId || !newResult.eventType) {
      toast.error('Please fill all required fields');
      return;
    }

    const participant = participants.find(p => p.participantId === newResult.participantId);
    if (!participant) {
      toast.error('Participant not found');
      return;
    }

    const result: Result = {
      ...newResult,
      publishedDate: new Date().toISOString()
    };

    const updatedResults = [...results, result];
    setResults(updatedResults);
    localStorage.setItem('kalakriti-results', JSON.stringify(updatedResults));

    setNewResult({
      participantId: '',
      eventType: '',
      position: 1,
      score: 0,
      remarks: ''
    });

    toast.success('Result published successfully!');
  };

  const downloadParticipantData = (eventType: string) => {
    const eventParticipants = participants.filter(p => p.eventType === eventType);
    const csvContent = [
      'Participant ID,Name,Email,Phone,City,State,Registration Date,Status',
      ...eventParticipants.map(p => 
        `${p.participantId},${p.fullName},${p.email},${p.phone},${p.city},${p.state},${new Date(p.registrationDate).toLocaleDateString()},${p.status}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventType}-participants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-kalakriti-primary">Kalakriti Admin Panel</h1>
              <p className="text-gray-600 mt-1">Manage competitions, participants & results</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="queries">Queries</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-kalakriti-primary" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Participants</p>
                      <p className="text-2xl font-bold text-kalakriti-primary">{participants.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Results Published</p>
                      <p className="text-2xl font-bold text-yellow-600">{results.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Competitions</p>
                      <p className="text-2xl font-bold text-green-600">6</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Days to Deadline</p>
                      <p className="text-2xl font-bold text-blue-600">16</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Competition Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getEventStats().map((stat, index) => (
                    <div key={stat.eventType} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-kalakriti-primary">{stat.eventName}</h4>
                        <p className="text-sm text-gray-600">{stat.participantCount} participants registered</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={stat.resultsPublished > 0 ? "default" : "secondary"}>
                          {stat.resultsPublished} results
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadParticipantData(stat.eventType)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Participant Management</CardTitle>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search participants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="all">All Competitions</option>
                      {eventTypes.map(type => (
                        <option key={type} value={type}>
                          {eventNames[type as keyof typeof eventNames]}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="all">All Seasons</option>
                      {getAvailableSeasons().filter(s => s !== 'all').map(season => (
                        <option key={season} value={season}>
                          Season {season}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={exportToExcel}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Showing {filteredParticipants.length} of {participants.length} participants
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Competition</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Phone</th>
                        <th className="text-left p-3">City</th>
                         <th className="text-left p-3">Status</th>
                         <th className="text-left p-3">Artwork</th>
                         <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((participant, index) => (
                        <tr key={participant.participantId} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-mono text-sm">{participant.participantId}</td>
                          <td className="p-3 font-medium">{participant.fullName}</td>
                          <td className="p-3">
                            <Badge variant="outline">
                              {eventNames[participant.eventType as keyof typeof eventNames]}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-gray-600">{participant.email}</td>
                          <td className="p-3 text-sm text-gray-600">{participant.phone}</td>
                          <td className="p-3 text-sm text-gray-600">{participant.city}</td>
                           <td className="p-3">
                             <Badge variant={participant.status === 'registered' ? 'default' : 'secondary'}>
                               {participant.status}
                             </Badge>
                           </td>
                           <td className="p-3">
                             {participant.submissionFileName ? (
                               <div className="flex items-center gap-2">
                                 {participant.submissionFileName.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                   <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                     <Eye className="h-4 w-4 text-purple-600" />
                                   </div>
                                 ) : participant.submissionFileName.match(/\.(mp4|avi|mov|wmv|webm)$/i) ? (
                                   <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                                     <FileText className="h-4 w-4 text-green-600" />
                                   </div>
                                 ) : (
                                   <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                                     <FileText className="h-4 w-4 text-orange-600" />
                                   </div>
                                 )}
                                 <div>
                                   <p className="text-xs font-medium text-gray-700 truncate w-24" title={participant.submissionFileName}>
                                     {participant.submissionFileName}
                                   </p>
                                   <p className="text-xs text-gray-500">
                                     {participant.submissionFileName.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'Image' : 
                                      participant.submissionFileName.match(/\.(mp4|avi|mov|wmv|webm)$/i) ? 'Video' : 'File'}
                                   </p>
                                 </div>
                               </div>
                             ) : (
                               <span className="text-gray-400 text-sm">No submission</span>
                             )}
                           </td>
                           <td className="p-3">
                             <Button 
                               size="sm" 
                               variant="outline"
                               onClick={() => {
                                 if (participant.submissionFileName) {
                                   // Here you would implement viewing the actual file
                                   toast.info(`Viewing: ${participant.submissionFileName}`);
                                 } else {
                                   toast.error('No artwork submitted');
                                 }
                               }}
                             >
                               <Eye className="h-4 w-4" />
                             </Button>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <ResultUpload 
              eventTypes={eventTypes}
              eventNames={eventNames}
              participants={participants}
            />
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            <QueriesManagement />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;