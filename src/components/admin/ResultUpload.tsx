import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Eye, Edit, Trash2, Save, Trophy, Medal, Award, Star } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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
  publishedDate?: string;
  isPublished: boolean;
  isLatest?: boolean;
}

interface ResultUploadProps {
  eventTypes: string[];
  eventNames: Record<string, string>;
  participants: any[];
}

const ResultUpload: React.FC<ResultUploadProps> = ({ eventTypes, eventNames, participants }) => {
  const [results, setResults] = useState<EventResult[]>([]);
  const [previewResult, setPreviewResult] = useState<EventResult | null>(null);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isLatest, setIsLatest] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingResultIndex, setEditingResultIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Seasons are now text input, not dropdown
  const ageCategoryNames = {
    adult: 'Adult (16yr-80yr)',
    children: 'Children (7yr-15yr)',
    preschool: 'Pre-school (2yr-6yr)'
  };

  useEffect(() => {
    // Load published results on component mount
    const publishedResults = JSON.parse(localStorage.getItem('kalakriti-event-results') || '[]');
    setResults(publishedResults);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // NEW FORMAT: Single sheet with Category and Rank columns
        const eventResult: EventResult = {
          eventType: selectedEvent,
          season: selectedSeason,
          topPositions: {
            adult: [],
            children: [],
            preschool: []
          },
          top100: [],
          isPublished: false
        };

        // Get first sheet (should be the only sheet now)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Process data based on Category and Rank columns
        jsonData.forEach((row: any) => {
          const category = (row.Category || row.category || '').toLowerCase();
          const rank = parseInt(row.Rank || row.rank || '0');
          
          const entry: ResultEntry = {
            participantId: row['Participant ID'] || row.participantId || `${selectedEvent}-${Date.now()}-${Math.random()}`,
            name: row.Name || row.name || 'Unknown',
            ageCategory: category === 'adult' ? 'adult' : 
                        category === 'children' ? 'children' : 
                        category === 'preschool' ? 'preschool' : 'adult',
            position: rank,
            score: parseFloat(row.Score || row.score || '0'),
            remarks: row.Remarks || row.remarks || ''
          };

          // Categorize based on Category column
          if (category === 'adult' && rank <= 5) {
            eventResult.topPositions.adult.push(entry);
          } else if (category === 'children' && rank <= 5) {
            eventResult.topPositions.children.push(entry);
          } else if (category === 'preschool' && rank <= 5) {
            eventResult.topPositions.preschool.push(entry);
          } else if (category === 'top100' && rank <= 100) {
            eventResult.top100.push(entry);
          }
        });

        // Sort each category by position
        eventResult.topPositions.adult.sort((a, b) => a.position - b.position);
        eventResult.topPositions.children.sort((a, b) => a.position - b.position);
        eventResult.topPositions.preschool.sort((a, b) => a.position - b.position);
        eventResult.top100.sort((a, b) => a.position - b.position);

        setPreviewResult(eventResult);
        toast.success('Excel file uploaded successfully! Please review the results.');
      } catch (error) {
        console.error('Excel processing error:', error);
        toast.error('Error processing Excel file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    // NEW FORMAT: Single sheet with Category and Rank columns
    const seasonNum = selectedSeason.split(' ')[1] || '1';
    const eventPrefix = selectedEvent.toUpperCase().substring(0, 3);
    
    const templateData = [
      // Adult category (Top 5)
      { 'Participant ID': `${eventPrefix}S${seasonNum}-1001`, Name: 'Abhishek Kadu', Category: 'Adult', Rank: 1, Score: 95.5, Remarks: 'Excellent creativity' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-1002`, Name: 'Kartik Shambharkar', Category: 'Adult', Rank: 2, Score: 94.2, Remarks: 'Great technique' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-1003`, Name: 'Pratik Pandey', Category: 'Adult', Rank: 3, Score: 92.8, Remarks: 'Good composition' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-1004`, Name: 'Punam Wagh', Category: 'Adult', Rank: 4, Score: 91.5, Remarks: 'Nice colors' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-1005`, Name: 'Shraddha Ramteke', Category: 'Adult', Rank: 5, Score: 90.2, Remarks: 'Creative approach' },
      
      // Children category (Top 5)
      { 'Participant ID': `${eventPrefix}S${seasonNum}-2001`, Name: 'Gauri Dahake', Category: 'Children', Rank: 1, Score: 93.5, Remarks: 'Amazing for age' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-2002`, Name: 'Shital Parise', Category: 'Children', Rank: 2, Score: 92.1, Remarks: 'Very creative' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-2003`, Name: 'Chetan Urje', Category: 'Children', Rank: 3, Score: 90.8, Remarks: 'Good details' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-2004`, Name: 'Zoya Khan', Category: 'Children', Rank: 4, Score: 89.5, Remarks: 'Nice style' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-2005`, Name: 'Arju Shah', Category: 'Children', Rank: 5, Score: 88.2, Remarks: 'Good effort' },
      
      // Preschool category (Top 5)
      { 'Participant ID': `${eventPrefix}S${seasonNum}-3001`, Name: 'Rohit Bhise', Category: 'Preschool', Rank: 1, Score: 91.5, Remarks: 'Exceptional talent' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-3002`, Name: 'Pranita Singh', Category: 'Preschool', Rank: 2, Score: 90.1, Remarks: 'Great colors' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-3003`, Name: 'Yash Kadu', Category: 'Preschool', Rank: 3, Score: 88.8, Remarks: 'Nice work' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-3004`, Name: 'Rina Bhasme', Category: 'Preschool', Rank: 4, Score: 87.5, Remarks: 'Creative ideas' },
      { 'Participant ID': `${eventPrefix}S${seasonNum}-3005`, Name: 'Dolly Panbase', Category: 'Preschool', Rank: 5, Score: 86.2, Remarks: 'Good attempt' },
      
      // Top 100 (showing first 10 as example)
      ...Array.from({ length: 10 }, (_, i) => ({
        'Participant ID': `${eventPrefix}S${seasonNum}-T${String(i + 1).padStart(3, '0')}`,
        Name: i < 5 ? `Highlighted Artist ${i + 1}` : `Artist ${i + 1}`,
        Category: 'Top100',
        Rank: i + 1,
        Score: 95 - (i * 0.5),
        Remarks: i < 5 ? 'Top 20 Highlighted' : 'Top 100 Artist'
      }))
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 18 }, // Participant ID
      { wch: 20 }, // Name
      { wch: 12 }, // Category
      { wch: 8 },  // Rank
      { wch: 10 }, // Score
      { wch: 25 }  // Remarks
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Results');

    XLSX.writeFile(wb, `${selectedEvent}-${selectedSeason.replace(' ', '-')}-results-template.xlsx`);
    toast.success('NEW FORMAT: Single sheet template with Category & Rank columns downloaded!');
  };

  const publishResults = () => {
    if (!previewResult) return;

    // If marked as latest, unmark all other results for this event type
    const existingResults = JSON.parse(localStorage.getItem('kalakriti-event-results') || '[]');
    if (isLatest) {
      existingResults.forEach((result: any) => {
        if (result.eventType === selectedEvent) {
          result.isLatest = false;
        }
      });
    }

    const publishedResult = {
      ...previewResult,
      isPublished: true,
      publishedDate: new Date().toISOString(),
      isLatest: isLatest
    };

    const updatedResults = [...existingResults, publishedResult];
    
    setResults(updatedResults);
    localStorage.setItem('kalakriti-event-results', JSON.stringify(updatedResults));
    
    setPreviewResult(null);
    setIsEditing(false);
    setIsLatest(false);
    
    toast.success('Results published successfully!');
  };

  const deleteResult = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
    localStorage.setItem('kalakriti-event-results', JSON.stringify(updatedResults));
    toast.success('Result deleted successfully!');
  };

  const startEditingResult = (index: number) => {
    setEditingResultIndex(index);
    setPreviewResult({ ...results[index] });
    setIsEditing(true);
  };

  const saveEditedResult = () => {
    if (!previewResult || editingResultIndex === null) return;

    const updatedResults = [...results];
    updatedResults[editingResultIndex] = previewResult;
    
    setResults(updatedResults);
    localStorage.setItem('kalakriti-event-results', JSON.stringify(updatedResults));
    
    setEditingResultIndex(null);
    setPreviewResult(null);
    setIsEditing(false);
    
    toast.success('Result updated successfully!');
  };

  const cancelEditing = () => {
    setEditingResultIndex(null);
    setPreviewResult(null);
    setIsEditing(false);
  };

  const editResultEntry = (category: keyof EventResult['topPositions'] | 'top100', index: number, field: string, value: any) => {
    if (!previewResult) return;

    const updatedResult = { ...previewResult };
    
    if (category === 'top100') {
      updatedResult.top100[index] = { ...updatedResult.top100[index], [field]: value };
    } else {
      updatedResult.topPositions[category][index] = { 
        ...updatedResult.topPositions[category][index], 
        [field]: value 
      };
    }
    
    setPreviewResult(updatedResult);
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Excel Results Upload (New Format: Single Sheet)
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Upload results using the new single-sheet format with Category and Rank columns
            </p>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Season (Custom Name)</label>
              <input
                type="text"
                placeholder="e.g., Season 1, Spring 2025, etc."
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">Enter a custom season name</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Event</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Event" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {eventNames[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="isLatest"
              checked={isLatest}
              onChange={(e) => setIsLatest(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="isLatest" className="text-sm font-medium cursor-pointer">
              Mark as Latest/New Season (will be highlighted on results page)
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={downloadTemplate}
              variant="outline"
              disabled={!selectedEvent || !selectedSeason}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedEvent || !selectedSeason}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Upload className="h-4 w-4" />
              Upload Excel
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Preview Section */}
      {previewResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview Results - {eventNames[previewResult.eventType]} ({previewResult.season})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Stop Editing' : 'Edit'}
                </Button>
                {editingResultIndex !== null ? (
                  <>
                    <Button
                      onClick={saveEditedResult}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={cancelEditing}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={publishResults}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Publish Results
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="categories">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="categories">Age Categories</TabsTrigger>
                <TabsTrigger value="top100">Top 100 List</TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="space-y-6">
                {Object.entries(previewResult.topPositions).map(([category, entries]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-purple-800">
                      {ageCategoryNames[category as keyof typeof ageCategoryNames]}
                    </h3>
                    <div className="space-y-3">
                      {entries.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            {getPositionIcon(entry.position)}
                            <div>
                              <p className="font-medium">{entry.name}</p>
                              <p className="text-sm text-gray-600">ID: {entry.participantId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-purple-600">{entry.score}/100</p>
                            <p className="text-sm text-gray-500">{entry.remarks}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="top100" className="space-y-4">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-amber-800">Top 100 Artists</h3>
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {previewResult.top100.map((entry, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          index < 20 
                            ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300' 
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index < 20 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{entry.name}</p>
                            <p className="text-sm text-gray-600">ID: {entry.participantId}</p>
                          </div>
                        </div>
                        {index < 20 && (
                          <Badge className="bg-yellow-500 text-white">Top 20</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Published Results */}
      <Card>
        <CardHeader>
          <CardTitle>Published Results</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No results published yet</p>
          ) : (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{eventNames[result.eventType]} - {result.season}</h4>
                    <p className="text-sm text-gray-600">
                      Published on {new Date(result.publishedDate!).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Published</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditingResult(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteResult(index)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultUpload;