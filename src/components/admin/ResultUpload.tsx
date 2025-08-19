import React, { useState, useRef } from 'react';
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
}

interface ResultUploadProps {
  eventTypes: string[];
  eventNames: Record<string, string>;
  participants: any[];
}

const ResultUpload: React.FC<ResultUploadProps> = ({ eventTypes, eventNames, participants }) => {
  const [results, setResults] = useState<EventResult[]>([]);
  const [previewResult, setPreviewResult] = useState<EventResult | null>(null);
  const [selectedSeason, setSelectedSeason] = useState('2024');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const seasons = ['2024', '2023', '2022', '2021'];
  const ageCategoryNames = {
    adult: 'Adult (16yr-80yr)',
    children: 'Children (7yr-15yr)',
    preschool: 'Pre-school (2yr-6yr)'
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Process each worksheet (assuming one per age category + top 100)
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

        // Process worksheets
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (sheetName.toLowerCase().includes('adult')) {
            eventResult.topPositions.adult = processSheetData(jsonData, 'adult');
          } else if (sheetName.toLowerCase().includes('children')) {
            eventResult.topPositions.children = processSheetData(jsonData, 'children');
          } else if (sheetName.toLowerCase().includes('preschool')) {
            eventResult.topPositions.preschool = processSheetData(jsonData, 'preschool');
          } else if (sheetName.toLowerCase().includes('top100')) {
            eventResult.top100 = processTop100Data(jsonData);
          }
        });

        setPreviewResult(eventResult);
        toast.success('Excel file uploaded successfully! Please review the results.');
      } catch (error) {
        toast.error('Error processing Excel file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processSheetData = (data: any[], category: 'adult' | 'children' | 'preschool'): ResultEntry[] => {
    return data.slice(0, 5).map((row: any, index: number) => ({
      participantId: row.participantId || row['Participant ID'] || `${selectedEvent}-${Date.now()}-${index}`,
      name: row.name || row.Name || 'Unknown',
      ageCategory: category,
      position: index + 1,
      score: row.score || row.Score || 0,
      remarks: row.remarks || row.Remarks || ''
    }));
  };

  const processTop100Data = (data: any[]): ResultEntry[] => {
    return data.slice(0, 100).map((row: any, index: number) => ({
      participantId: row.participantId || row['Participant ID'] || `${selectedEvent}-${Date.now()}-${index}`,
      name: row.name || row.Name || 'Unknown',
      ageCategory: 'adult', // Default for top 100
      position: index + 1,
      score: row.score || row.Score || 0,
      remarks: row.remarks || row.Remarks || ''
    }));
  };

  const downloadTemplate = () => {
    const adultData = [
      { Name: 'Abhishek Kadu', 'Participant ID': 'ART24-1001', Score: 95.5, Remarks: 'Excellent creativity' },
      { Name: 'Kartik Shambharkar', 'Participant ID': 'ART24-1002', Score: 94.2, Remarks: 'Great technique' },
      { Name: 'Pratik Pandey', 'Participant ID': 'ART24-1003', Score: 92.8, Remarks: 'Good composition' },
      { Name: 'Punam Wagh', 'Participant ID': 'ART24-1004', Score: 91.5, Remarks: 'Nice colors' },
      { Name: 'Shraddha Ramteke', 'Participant ID': 'ART24-1005', Score: 90.2, Remarks: 'Creative approach' }
    ];

    const childrenData = [
      { Name: 'Gauri Dahake', 'Participant ID': 'ART24-2001', Score: 93.5, Remarks: 'Amazing for age' },
      { Name: 'Shital Parise', 'Participant ID': 'ART24-2002', Score: 92.1, Remarks: 'Very creative' },
      { Name: 'Chetan Urje', 'Participant ID': 'ART24-2003', Score: 90.8, Remarks: 'Good details' },
      { Name: 'Zoya Khan', 'Participant ID': 'ART24-2004', Score: 89.5, Remarks: 'Nice style' },
      { Name: 'Arju Shah', 'Participant ID': 'ART24-2005', Score: 88.2, Remarks: 'Good effort' }
    ];

    const preschoolData = [
      { Name: 'Rohit Bhise', 'Participant ID': 'ART24-3001', Score: 91.5, Remarks: 'Exceptional talent' },
      { Name: 'Pranita Singh', 'Participant ID': 'ART24-3002', Score: 90.1, Remarks: 'Great colors' },
      { Name: 'Yash Kadu', 'Participant ID': 'ART24-3003', Score: 88.8, Remarks: 'Nice work' },
      { Name: 'Rina Bhasme', 'Participant ID': 'ART24-3004', Score: 87.5, Remarks: 'Creative ideas' },
      { Name: 'Dolly Panbase', 'Participant ID': 'ART24-3005', Score: 86.2, Remarks: 'Good attempt' }
    ];

    const top100Data = Array.from({ length: 100 }, (_, i) => ({
      Name: i < 20 ? `Highlighted Artist ${i + 1}` : `Artist ${i + 1}`,
      'Participant ID': `ART24-T${String(i + 1).padStart(3, '0')}`,
      Score: 95 - (i * 0.5),
      Remarks: i < 20 ? 'Top 20 Highlighted' : 'Top 100 Artist'
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(adultData), 'Adult');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(childrenData), 'Children');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(preschoolData), 'Preschool');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(top100Data), 'Top100');

    XLSX.writeFile(wb, `${selectedEvent}-results-template.xlsx`);
    toast.success('Template downloaded successfully!');
  };

  const publishResults = () => {
    if (!previewResult) return;

    const publishedResult = {
      ...previewResult,
      isPublished: true,
      publishedDate: new Date().toISOString()
    };

    const existingResults = JSON.parse(localStorage.getItem('kalakriti-event-results') || '[]');
    const updatedResults = [...existingResults, publishedResult];
    
    setResults(updatedResults);
    localStorage.setItem('kalakriti-event-results', JSON.stringify(updatedResults));
    
    setPreviewResult(null);
    setIsEditing(false);
    
    toast.success('Results published successfully!');
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
            Excel Results Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Season</label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map(season => (
                    <SelectItem key={season} value={season}>{season}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="flex gap-3">
            <Button
              onClick={downloadTemplate}
              variant="outline"
              disabled={!selectedEvent}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedEvent}
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
                <Button
                  onClick={publishResults}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Publish Results
                </Button>
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
                  <Badge className="bg-green-100 text-green-800">Published</Badge>
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