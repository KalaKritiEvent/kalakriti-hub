
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Trophy, Medal, Award, Star, Calendar, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Sample contest results data
const pastEvents = [
  {
    id: 'art-2023',
    name: 'Kalakriti Art Competition 2023',
    date: 'September 15 - October 30, 2023',
    categories: ['Painting', 'Sketching', 'Digital Art'],
    participantCount: 1245,
    status: 'completed'
  },
  {
    id: 'photography-2023',
    name: 'Kalakriti Photography Contest 2023',
    date: 'July 10 - August 25, 2023',
    categories: ['Portrait', 'Landscape', 'Street Photography'],
    participantCount: 987,
    status: 'completed'
  },
  {
    id: 'dance-2023',
    name: 'Kalakriti Dance Competition 2023',
    date: 'May 5 - June 20, 2023',
    categories: ['Classical', 'Folk', 'Contemporary'],
    participantCount: 756,
    status: 'completed'
  },
  {
    id: 'singing-2023',
    name: 'Kalakriti Singing Contest 2023',
    date: 'March 15 - April 30, 2023',
    categories: ['Classical', 'Bollywood', 'Folk Songs'],
    participantCount: 890,
    status: 'completed'
  }
];

// Sample winners data
const winners = {
  'art-2023': [
    { category: 'Painting', winners: [
      { rank: 1, name: 'Aarav Sharma', location: 'Mumbai', contestantId: 'ART23-1001' },
      { rank: 2, name: 'Priya Patel', location: 'Ahmedabad', contestantId: 'ART23-1042' },
      { rank: 3, name: 'Vikram Singh', location: 'Jaipur', contestantId: 'ART23-1078' }
    ]},
    { category: 'Sketching', winners: [
      { rank: 1, name: 'Meera Desai', location: 'Bangalore', contestantId: 'ART23-2034' },
      { rank: 2, name: 'Rahul Verma', location: 'Delhi', contestantId: 'ART23-2089' },
      { rank: 3, name: 'Ananya Joshi', location: 'Pune', contestantId: 'ART23-2113' }
    ]},
    { category: 'Digital Art', winners: [
      { rank: 1, name: 'Karan Malhotra', location: 'Hyderabad', contestantId: 'ART23-3021' },
      { rank: 2, name: 'Nisha Reddy', location: 'Chennai', contestantId: 'ART23-3056' },
      { rank: 3, name: 'Ravi Kumar', location: 'Kolkata', contestantId: 'ART23-3077' }
    ]}
  ],
  'photography-2023': [
    { category: 'Portrait', winners: [
      { rank: 1, name: 'Aditya Kapoor', location: 'Delhi', contestantId: 'PHO23-1014' },
      { rank: 2, name: 'Sneha Gupta', location: 'Kolkata', contestantId: 'PHO23-1033' },
      { rank: 3, name: 'Rohan Mehta', location: 'Mumbai', contestantId: 'PHO23-1067' }
    ]},
    { category: 'Landscape', winners: [
      { rank: 1, name: 'Neha Singh', location: 'Shimla', contestantId: 'PHO23-2009' },
      { rank: 2, name: 'Arjun Nair', location: 'Kochi', contestantId: 'PHO23-2045' },
      { rank: 3, name: 'Pooja Sharma', location: 'Dehradun', contestantId: 'PHO23-2078' }
    ]},
    { category: 'Street Photography', winners: [
      { rank: 1, name: 'Farhan Ahmed', location: 'Mumbai', contestantId: 'PHO23-3028' },
      { rank: 2, name: 'Divya Krishnan', location: 'Chennai', contestantId: 'PHO23-3052' },
      { rank: 3, name: 'Rajiv Sen', location: 'Kolkata', contestantId: 'PHO23-3091' }
    ]}
  ],
  'dance-2023': [
    { category: 'Classical', winners: [
      { rank: 1, name: 'Kavita Rao', location: 'Chennai', contestantId: 'DAN23-1017' },
      { rank: 2, name: 'Aryan Gupta', location: 'Lucknow', contestantId: 'DAN23-1029' },
      { rank: 3, name: 'Meenakshi Iyer', location: 'Bangalore', contestantId: 'DAN23-1045' }
    ]},
    { category: 'Folk', winners: [
      { rank: 1, name: 'Surya Prakash', location: 'Jaipur', contestantId: 'DAN23-2032' },
      { rank: 2, name: 'Anjali Singh', location: 'Bhopal', contestantId: 'DAN23-2056' },
      { rank: 3, name: 'Ranjit Patel', location: 'Ahmedabad', contestantId: 'DAN23-2084' }
    ]},
    { category: 'Contemporary', winners: [
      { rank: 1, name: 'Maya Kapoor', location: 'Mumbai', contestantId: 'DAN23-3019' },
      { rank: 2, name: 'Rohit Menon', location: 'Pune', contestantId: 'DAN23-3047' },
      { rank: 3, name: 'Aisha Khan', location: 'Delhi', contestantId: 'DAN23-3075' }
    ]}
  ],
  'singing-2023': [
    { category: 'Classical', winners: [
      { rank: 1, name: 'Shweta Pandit', location: 'Varanasi', contestantId: 'SIN23-1021' },
      { rank: 2, name: 'Anand Kumar', location: 'Delhi', contestantId: 'SIN23-1043' },
      { rank: 3, name: 'Priyanka Reddy', location: 'Hyderabad', contestantId: 'SIN23-1069' }
    ]},
    { category: 'Bollywood', winners: [
      { rank: 1, name: 'Vishal Shah', location: 'Mumbai', contestantId: 'SIN23-2015' },
      { rank: 2, name: 'Sanya Khanna', location: 'Delhi', contestantId: 'SIN23-2037' },
      { rank: 3, name: 'Arun Mehta', location: 'Pune', contestantId: 'SIN23-2064' }
    ]},
    { category: 'Folk Songs', winners: [
      { rank: 1, name: 'Gita Kumari', location: 'Jodhpur', contestantId: 'SIN23-3010' },
      { rank: 2, name: 'Manish Tiwari', location: 'Lucknow', contestantId: 'SIN23-3028' },
      { rank: 3, name: 'Lakshmi Nair', location: 'Kochi', contestantId: 'SIN23-3049' }
    ]}
  ]
};

const Results = () => {
  const [selectedEvent, setSelectedEvent] = useState(pastEvents[0].id);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const handleEventChange = (value: string) => {
    setSelectedEvent(value);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a Contestant ID or Name');
      return;
    }
    
    setLoading(true);
    
    // Simulate search API call
    setTimeout(() => {
      // Search through all winners across all events
      const results: any[] = [];
      
      Object.entries(winners).forEach(([eventId, categories]) => {
        const eventName = pastEvents.find(e => e.id === eventId)?.name || '';
        
        categories.forEach(category => {
          category.winners.forEach(winner => {
            if (
              winner.contestantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
              winner.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              results.push({
                ...winner,
                event: eventName,
                category: category.category,
                eventId
              });
            }
          });
        });
      });
      
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.error('No results found. Please check your search query.');
      }
      
      setLoading(false);
    }, 1500);
  };
  
  const handleDownloadCertificate = (contestantId: string) => {
    toast.success(`Certificate download initiated for ${contestantId}`);
    // In a real app, this would trigger the certificate download
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold font-heading text-kalakriti-primary mb-4">
              Results & Winners
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Celebrate the talented winners of our previous competitions and events.
              You can also search for participants by name or contestant ID.
            </p>
          </motion.div>
          
          <Tabs defaultValue="browse" className="max-w-5xl mx-auto">
            <TabsList className="mb-8 grid grid-cols-2 w-full">
              <TabsTrigger value="browse">Browse Results</TabsTrigger>
              <TabsTrigger value="search">Search Contestants</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-smooth p-6 md:p-8 mb-8"
              >
                <div className="mb-6">
                  <Label htmlFor="event-select" className="text-lg font-medium mb-2 block">
                    Select an Event
                  </Label>
                  <Select value={selectedEvent} onValueChange={handleEventChange}>
                    <SelectTrigger id="event-select">
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {pastEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6 flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Event Date: {pastEvents.find(e => e.id === selectedEvent)?.date}
                  </span>
                  <span className="mx-4">|</span>
                  <Trophy className="h-4 w-4 mr-2" />
                  <span>
                    {pastEvents.find(e => e.id === selectedEvent)?.participantCount} Participants
                  </span>
                </div>
                
                <div className="space-y-6">
                  {winners[selectedEvent as keyof typeof winners]?.map((category, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-xl font-medium text-kalakriti-primary mb-4">
                        {category.category} Category
                      </h3>
                      
                      <div className="space-y-3">
                        {category.winners.map((winner, wIndex) => {
                          const Icon = wIndex === 0 ? Trophy : wIndex === 1 ? Medal : Award;
                          const bgColor = wIndex === 0 ? 'bg-yellow-100' : wIndex === 1 ? 'bg-gray-100' : 'bg-amber-100';
                          const textColor = wIndex === 0 ? 'text-yellow-800' : wIndex === 1 ? 'text-gray-800' : 'text-amber-800';
                          
                          return (
                            <div 
                              key={wIndex} 
                              className={`flex items-center justify-between ${bgColor} ${textColor} p-4 rounded-lg`}
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium">{winner.name}</p>
                                  <p className="text-sm">{winner.location} | ID: {winner.contestantId}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                {Array(3 - wIndex).fill(0).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                                {Array(wIndex).fill(0).map((_, i) => (
                                  <Star key={i + 3 - wIndex} className="h-4 w-4" />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="search">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-smooth p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold mb-4">Search for Contestants</h2>
                
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-grow">
                      <Input
                        placeholder="Enter Contestant ID or Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-kalakriti-secondary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </form>
                
                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Search Results ({searchResults.length})</h3>
                    
                    {searchResults.map((result, index) => (
                      <div 
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{result.name}</p>
                          <p className="text-sm text-gray-600">
                            {result.event} | {result.category} Category
                          </p>
                          <div className="flex items-center mt-1">
                            <Trophy className="h-4 w-4 text-orange-500 mr-1" />
                            <span className="text-sm font-medium">
                              {result.rank === 1 ? '1st Place' : result.rank === 2 ? '2nd Place' : '3rd Place'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">ID: {result.contestantId}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleDownloadCertificate(result.contestantId)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Certificate
                        </Button>
                      </div>
                    ))}
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

export default Results;
