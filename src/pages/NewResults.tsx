import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Trophy, Medal, Award, Star, Calendar, Download, Loader2, Crown, Sparkles, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { eventTypes } from '@/lib/utils';
import jsPDF from 'jspdf';

interface ResultEntry {
  participantId: string;
  name: string;
  ageCategory: 'adult' | 'children' | 'preschool';
  position: number;
  score: number;
  remarks: string;
}

interface EventResult {
  eventType: string;
  season: string;
  topPositions: {
    adult: ResultEntry[];
    children: ResultEntry[];
    preschool: ResultEntry[];
  };
  top100: ResultEntry[];
  publishedDate: string;
  isPublished: boolean;
  isLatest?: boolean;
}

const NewResults = () => {
  const [results, setResults] = useState<EventResult[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('art');
  const [selectedSeason, setSelectedSeason] = useState('2024');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get available seasons from published results only
  const getAvailableSeasons = () => {
    const publishedSeasons = Array.from(new Set(results.map(r => r.season))).sort((a, b) => b.localeCompare(a));
    return publishedSeasons;
  };

  const ageCategoryNames = {
    adult: 'Adult (16yr-80yr)',
    children: 'Children (7yr-15yr)',
    preschool: 'Pre-school (2yr-6yr)'
  };

  useEffect(() => {
    // Load published results from localStorage
    const publishedResults: EventResult[] = JSON.parse(localStorage.getItem('kalakriti-event-results') || '[]');
    setResults(publishedResults);
    
    // Set the most recent available season as default
    if (publishedResults.length > 0) {
      const availableSeasons = Array.from(new Set(publishedResults.map(r => r.season))).sort((a, b) => b.localeCompare(a));
      if (availableSeasons.length > 0) {
        setSelectedSeason(availableSeasons[0]);
      }
    }
  }, []);

  const getCurrentResult = () => {
    return results.find(r => r.eventType === selectedEvent && r.season === selectedSeason);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a Contestant ID or Name');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const searchResults: any[] = [];
      
      results.forEach(result => {
        // Search in top positions
        Object.values(result.topPositions).forEach(categoryResults => {
          categoryResults.forEach(entry => {
            if (
              entry.participantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
              entry.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              searchResults.push({
                ...entry,
                eventType: result.eventType,
                season: result.season,
                eventName: eventTypes.find(e => e.type === result.eventType)?.title || '',
                categoryName: ageCategoryNames[entry.ageCategory]
              });
            }
          });
        });

        // Search in top 100
        result.top100.forEach(entry => {
          if (
            entry.participantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            searchResults.push({
              ...entry,
              eventType: result.eventType,
              season: result.season,
              eventName: eventTypes.find(e => e.type === result.eventType)?.title || '',
              categoryName: 'Top 100',
              isTop100: true
            });
          }
        });
      });
      
      setSearchResults(searchResults);
      
      if (searchResults.length === 0) {
        toast.error('No results found. Please check your search query.');
      }
      
      setLoading(false);
    }, 1000);
  };

  const getPositionIcon = (position: number, isTop100 = false) => {
    if (isTop100) {
      return position <= 20 ? 
        <Crown className="h-5 w-5 text-yellow-500" /> : 
        <Star className="h-4 w-4 text-gray-400" />;
    }
    
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPositionText = (position: number, isTop100 = false) => {
    if (isTop100) return `#${position}`;
    
    switch (position) {
      case 1: return '1st Place';
      case 2: return '2nd Place';  
      case 3: return '3rd Place';
      default: return `${position}th Place`;
    }
  };

  const generateCertificate = (participant: any) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Certificate background
    doc.setFillColor(268, 83, 57); // Kalakriti primary color (HSL converted to RGB)
    doc.rect(0, 0, 297, 210, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 20, 257, 170, 5, 5, 'F');
    
    // Header
    doc.setFontSize(28);
    doc.setTextColor(268, 83, 57);
    doc.text('KALAKRITI EVENTS', 148.5, 50, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Certificate of Achievement', 148.5, 65, { align: 'center' });
    
    // Divider line
    doc.setDrawColor(268, 83, 57);
    doc.setLineWidth(0.5);
    doc.line(60, 75, 237, 75);
    
    // Main content
    doc.setFontSize(14);
    doc.text('This is to certify that', 148.5, 95, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(participant.name, 148.5, 110, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`has achieved ${participant.isTop100 ? `Rank ${participant.position} in Top 100` : getPositionText(participant.position)}`, 148.5, 125, { align: 'center' });
    doc.text(`in ${participant.eventName} (${participant.categoryName})`, 148.5, 135, { align: 'center' });
    doc.text(`Season ${participant.season}`, 148.5, 145, { align: 'center' });
    
    // Footer
    doc.setFontSize(10);
    doc.text(`Certificate ID: ${participant.participantId}`, 50, 175);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 200, 175);
    doc.text(`Score: ${participant.score}/100`, 148.5, 175, { align: 'center' });
    
    // Save the PDF
    doc.save(`${participant.name}_Certificate_${participant.eventType}_${participant.season}.pdf`);
    toast.success(`Certificate downloaded for ${participant.name}`);
  };

  const currentResult = getCurrentResult();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-kalakriti-purple-light via-kalakriti-blue-light to-kalakriti-light">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-kalakriti-primary to-kalakriti-secondary bg-clip-text text-transparent mb-4">
              Competition Results
            </h1>
            <p className="text-lg text-kalakriti-dark/80 max-w-3xl mx-auto mb-6">
              Discover the talented winners across different age categories and celebrate artistic excellence in our competitions.
            </p>
            <Button
              onClick={() => {
                const token = localStorage.getItem('kalakriti-token');
                if (!token) {
                  toast.error('Please login to download your certificate');
                  setTimeout(() => window.location.href = '/auth/login', 1500);
                } else {
                  window.location.href = '/dashboard';
                }
              }}
              className="bg-gradient-to-r from-kalakriti-accent to-kalakriti-warning hover:from-kalakriti-warning hover:to-kalakriti-accent text-kalakriti-dark font-semibold"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Your Certificate
            </Button>
          </motion.div>
          
          <Tabs defaultValue="browse" className="max-w-7xl mx-auto">
            <TabsList className="mb-8 grid grid-cols-2 w-full bg-white/90 backdrop-blur-sm border border-kalakriti-primary/10">
              <TabsTrigger value="browse" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-kalakriti-primary data-[state=active]:to-kalakriti-secondary data-[state=active]:text-white">
                Browse Results
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-kalakriti-primary data-[state=active]:to-kalakriti-secondary data-[state=active]:text-white">
                Search Contestants
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Event & Season Selection */}
                <Card className="bg-white/90 backdrop-blur-sm border border-kalakriti-primary/10 shadow-xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-lg font-medium mb-3 block text-kalakriti-dark/80">Select Competition</label>
                        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                          <SelectTrigger className="h-12 bg-white border-kalakriti-primary/20 focus:border-kalakriti-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-kalakriti-primary/20">
                            {eventTypes.map((event) => (
                              <SelectItem key={event.type} value={event.type} className="focus:bg-kalakriti-purple-light">
                                {event.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-lg font-medium mb-3 block text-kalakriti-dark/80">Select Season</label>
                        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                          <SelectTrigger className="h-12 bg-white border-kalakriti-primary/20 focus:border-kalakriti-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-kalakriti-primary/20">
                            {getAvailableSeasons().map((season) => {
                              const result = results.find(r => r.season === season && r.eventType === selectedEvent);
                              return (
                                <SelectItem key={season} value={season} className="focus:bg-kalakriti-purple-light">
                                  {season} {result?.isLatest ? '✨ (New)' : ''}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {currentResult && (
                      <div className="flex items-center gap-4 text-kalakriti-dark/70">
                        <Calendar className="h-5 w-5 text-kalakriti-primary" />
                        <span>Published: {new Date(currentResult.publishedDate).toLocaleDateString()}</span>
                        <Badge className="bg-kalakriti-success text-white">Live Results</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {currentResult ? (
                  <div className="space-y-8">
                    {/* Age Categories */}
                    <div className="space-y-6">
                      {Object.entries(currentResult.topPositions).map(([category, entries]) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-kalakriti-primary/10"
                        >
                          <div className="bg-gradient-to-r from-kalakriti-primary to-kalakriti-secondary text-white p-6">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                              <Sparkles className="h-6 w-6" />
                              {ageCategoryNames[category as keyof typeof ageCategoryNames]}
                            </h3>
                          </div>
                          
                          <div className="p-6 space-y-4">
                            {entries.map((entry, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center justify-between p-6 rounded-xl ${
                                  index === 0 ? 'bg-gradient-to-r from-kalakriti-gold-light to-amber-50 border-2 border-kalakriti-accent' :
                                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300' :
                                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-kalakriti-warning' :
                                  'bg-gradient-to-r from-kalakriti-blue-light to-kalakriti-purple-light border border-kalakriti-primary/20'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                                    {getPositionIcon(entry.position)}
                                  </div>
                                  <div>
                                    <h4 className="text-xl font-bold text-kalakriti-dark">{entry.name}</h4>
                                    <p className="text-kalakriti-dark/70">ID: {entry.participantId}</p>
                                    <p className="text-sm text-kalakriti-dark/60">{entry.remarks}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-kalakriti-primary">{entry.score}</p>
                                    <p className="text-sm text-kalakriti-dark/60">Score</p>
                                  </div>
                                  {/* Certificate download moved to dashboard */}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Top 100 List */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-kalakriti-primary/10"
                    >
                      <div className="bg-gradient-to-r from-kalakriti-accent to-kalakriti-warning text-white p-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                          <Crown className="h-6 w-6" />
                          Top 100 Artists
                        </h3>
                        <p className="text-white/90 mt-2">Top 20 participants are highlighted</p>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid gap-3 max-h-96 overflow-y-auto">
                          {currentResult.top100.map((entry, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
                                index < 20 
                                  ? 'bg-gradient-to-r from-kalakriti-gold-light to-amber-50 border-2 border-kalakriti-accent shadow-md' 
                                  : 'bg-kalakriti-light hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                  index < 20 ? 'bg-gradient-to-r from-kalakriti-accent to-kalakriti-warning text-white' : 'bg-gray-200 text-kalakriti-dark/70'
                                }`}>
                                  {index + 1}
                                </span>
                                <div>
                                  <h4 className="font-semibold text-kalakriti-dark">{entry.name}</h4>
                                  <p className="text-sm text-kalakriti-dark/70">ID: {entry.participantId}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {index < 20 && (
                                  <Badge className="bg-gradient-to-r from-kalakriti-accent to-kalakriti-warning text-white border-0">
                                    Top 20
                                  </Badge>
                                )}
                                <span className="font-semibold text-kalakriti-primary mr-3">{entry.score}</span>
                                <Button
                                  onClick={() => generateCertificate({
                                    ...entry,
                                    eventType: selectedEvent,
                                    season: selectedSeason,
                                    eventName: eventTypes.find(e => e.type === selectedEvent)?.title || '',
                                    categoryName: 'Top 100',
                                    isTop100: true
                                  })}
                                  size="sm"
                                  className="bg-kalakriti-accent hover:bg-kalakriti-warning text-kalakriti-dark"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Certificate
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <Trophy className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-kalakriti-dark/60 mb-2">No Results Published</h3>
                    <p className="text-kalakriti-dark/50">Results for this event and season haven't been published yet.</p>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="search">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-kalakriti-primary/10"
              >
                <h2 className="text-2xl font-bold mb-6 text-kalakriti-dark">Search for Contestants</h2>
                
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                      <Input
                        placeholder="Enter Contestant ID or Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 bg-white border-kalakriti-primary/20 focus:border-kalakriti-primary"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-kalakriti-primary to-kalakriti-secondary hover:from-kalakriti-primary/90 hover:to-kalakriti-secondary/90 h-12 px-8 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </form>
                
                {searchResults.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Search Results ({searchResults.length})
                    </h3>
                    
                    <div className="space-y-4">
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center">
                                {getPositionIcon(result.position, result.isTop100)}
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">{result.name}</h4>
                                <p className="text-gray-600">{result.eventName} - Season {result.season}</p>
                                <p className="text-sm text-gray-500">{result.categoryName}</p>
                                <div className="flex items-center mt-2 gap-2">
                                  <Badge className="bg-purple-100 text-purple-800">
                                    {getPositionText(result.position, result.isTop100)}
                                  </Badge>
                                  <span className="text-sm text-gray-500">Score: {result.score}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">ID: {result.participantId}</p>
                              </div>
                            </div>
                            
                            <Button 
                              className="bg-kalakriti-accent hover:bg-kalakriti-warning text-kalakriti-dark"
                              onClick={() => generateCertificate(result)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Certificate
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NewResults;