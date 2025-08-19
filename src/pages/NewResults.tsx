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
import { Search, Trophy, Medal, Award, Star, Calendar, Download, Loader2, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { eventTypes } from '@/lib/utils';

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
}

const NewResults = () => {
  const [results, setResults] = useState<EventResult[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('art');
  const [selectedSeason, setSelectedSeason] = useState('2024');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const seasons = ['2024', '2023', '2022', '2021'];
  const ageCategoryNames = {
    adult: 'Adult (16yr-80yr)',
    children: 'Children (7yr-15yr)',
    preschool: 'Pre-school (2yr-6yr)'
  };

  useEffect(() => {
    // Load published results from localStorage
    const publishedResults = JSON.parse(localStorage.getItem('kalakriti-event-results') || '[]');
    setResults(publishedResults);
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

  const downloadCertificate = (participantId: string) => {
    toast.success(`Certificate download initiated for ${participantId}`);
  };

  const currentResult = getCurrentResult();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Competition Results
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the talented winners across different age categories and celebrate artistic excellence in our competitions.
            </p>
          </motion.div>
          
          <Tabs defaultValue="browse" className="max-w-7xl mx-auto">
            <TabsList className="mb-8 grid grid-cols-2 w-full bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="browse" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Browse Results
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
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
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-lg font-medium mb-3 block text-gray-700">Select Competition</label>
                        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                          <SelectTrigger className="h-12 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {eventTypes.map((event) => (
                              <SelectItem key={event.type} value={event.type}>
                                {event.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-lg font-medium mb-3 block text-gray-700">Select Season</label>
                        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                          <SelectTrigger className="h-12 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {seasons.map((season) => (
                              <SelectItem key={season} value={season}>
                                Season {season}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {currentResult && (
                      <div className="flex items-center gap-4 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <span>Published: {new Date(currentResult.publishedDate).toLocaleDateString()}</span>
                        <Badge className="bg-green-100 text-green-800">Live Results</Badge>
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
                          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
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
                                  index === 0 ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300' :
                                  index === 1 ? 'bg-gradient-to-r from-gray-100 to-slate-100 border-2 border-gray-300' :
                                  index === 2 ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300' :
                                  'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                                    {getPositionIcon(entry.position)}
                                  </div>
                                  <div>
                                    <h4 className="text-xl font-bold text-gray-900">{entry.name}</h4>
                                    <p className="text-gray-600">ID: {entry.participantId}</p>
                                    <p className="text-sm text-gray-500">{entry.remarks}</p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-purple-600">{entry.score}</p>
                                  <p className="text-sm text-gray-500">Score</p>
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
                      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                          <Crown className="h-6 w-6" />
                          Top 100 Artists
                        </h3>
                        <p className="text-amber-100 mt-2">Top 20 participants are highlighted</p>
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
                                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300 shadow-md' 
                                  : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                  index < 20 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white' : 'bg-gray-200 text-gray-700'
                                }`}>
                                  {index + 1}
                                </span>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{entry.name}</h4>
                                  <p className="text-sm text-gray-600">ID: {entry.participantId}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {index < 20 && (
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                                    Top 20
                                  </Badge>
                                )}
                                <span className="font-semibold text-purple-600">{entry.score}</span>
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
                    <h3 className="text-2xl font-semibold text-gray-500 mb-2">No Results Published</h3>
                    <p className="text-gray-400">Results for this event and season haven't been published yet.</p>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="search">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Search for Contestants</h2>
                
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                      <Input
                        placeholder="Enter Contestant ID or Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 bg-white"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 px-8"
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
                              variant="outline" 
                              className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100"
                              onClick={() => downloadCertificate(result.participantId)}
                            >
                              <Download className="h-4 w-4 mr-2" />
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