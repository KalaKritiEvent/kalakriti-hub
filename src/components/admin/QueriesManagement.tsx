import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Phone, Calendar, Search, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Query {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'pending' | 'resolved';
}

const QueriesManagement = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = () => {
    const storedQueries = JSON.parse(localStorage.getItem('kalakriti-queries') || '[]');
    setQueries(storedQueries.sort((a: Query, b: Query) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    ));
  };

  const markAsResolved = (queryId: string) => {
    const updatedQueries = queries.map(q => 
      q.id === queryId ? { ...q, status: 'resolved' as const } : q
    );
    setQueries(updatedQueries);
    localStorage.setItem('kalakriti-queries', JSON.stringify(updatedQueries));
    toast.success('Query marked as resolved');
  };

  const filteredQueries = queries.filter(query => 
    query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = queries.filter(q => q.status === 'pending').length;
  const resolvedCount = queries.filter(q => q.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-kalakriti-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Queries</p>
                <p className="text-2xl font-bold text-kalakriti-primary">{queries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Queries</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, subject or query ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredQueries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Queries Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria' : 'Contact form submissions will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQueries.map((query) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{query.name}</h3>
                        <Badge variant={query.status === 'pending' ? 'default' : 'secondary'}>
                          {query.status === 'pending' ? 'Pending' : 'Resolved'}
                        </Badge>
                        <span className="text-xs text-gray-500 font-mono">{query.id}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {query.email}
                        </div>
                        {query.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            {query.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(query.submittedAt).toLocaleString()}
                        </div>
                      </div>

                      {query.subject && (
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          <strong>Subject:</strong> {query.subject}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-600 line-clamp-2">{query.message}</p>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedQuery(query)}
                          >
                            View Full
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Query Details</DialogTitle>
                          </DialogHeader>
                          {selectedQuery && (
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500">Query ID</p>
                                <p className="font-mono text-sm">{selectedQuery.id}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Name</p>
                                <p>{selectedQuery.name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p>{selectedQuery.email}</p>
                              </div>
                              {selectedQuery.phone && (
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Phone</p>
                                  <p>{selectedQuery.phone}</p>
                                </div>
                              )}
                              {selectedQuery.subject && (
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Subject</p>
                                  <p>{selectedQuery.subject}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-500">Message</p>
                                <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{selectedQuery.message}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Submitted At</p>
                                <p>{new Date(selectedQuery.submittedAt).toLocaleString()}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {query.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => markAsResolved(query.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QueriesManagement;
