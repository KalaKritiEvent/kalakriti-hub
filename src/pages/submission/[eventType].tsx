
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const eventDetails = {
  art: { name: 'Art Competition', color: 'from-red-500 to-pink-600', fileTypes: 'Images (JPG, PNG, PDF)' },
  photography: { name: 'Photography Contest', color: 'from-blue-500 to-cyan-600', fileTypes: 'Images (JPG, PNG, RAW)' },
  mehndi: { name: 'Mehndi Championship', color: 'from-orange-500 to-red-500', fileTypes: 'Images (JPG, PNG)' },
  rangoli: { name: 'Rangoli Festival', color: 'from-purple-500 to-pink-500', fileTypes: 'Images (JPG, PNG)' },
  dance: { name: 'Dance Competition', color: 'from-green-500 to-teal-600', fileTypes: 'Videos (MP4, MOV)' },
  singing: { name: 'Singing Contest', color: 'from-indigo-500 to-purple-600', fileTypes: 'Audio/Video (MP3, MP4, MOV)' }
};

const SubmissionForm = () => {
  const { eventType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const queryParams = new URLSearchParams(location.search);
  const contestantId = queryParams.get('contestantId') || '';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    artworkTitle: '',
    artworkDescription: '',
    numberOfArtworks: 1
  });
  
  const [files, setFiles] = useState<File[]>([]);
  
  const event = eventDetails[eventType as keyof typeof eventDetails];

  useEffect(() => {
    // Check if payment was successful
    const paymentSuccess = localStorage.getItem('kalakriti-payment-success');
    if (!paymentSuccess) {
      navigate('/');
      return;
    }

    const paymentData = JSON.parse(paymentSuccess);
    setFormData(prev => ({
      ...prev,
      numberOfArtworks: paymentData.numberOfArtworks
    }));
  }, [navigate]);

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > formData.numberOfArtworks) {
        toast.error(`You can only upload ${formData.numberOfArtworks} file(s)`);
        return;
      }
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (files.length === 0) {
      toast.error('Please upload at least one artwork file');
      return;
    }

    if (files.length !== formData.numberOfArtworks) {
      toast.error(`Please upload exactly ${formData.numberOfArtworks} artwork file(s)`);
      return;
    }

    setLoading(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store submission data
      const submissionData = {
        contestantId,
        eventType,
        ...formData,
        files: files.map(f => f.name),
        submittedAt: new Date().toISOString()
      };
      
      localStorage.setItem('kalakriti-submission', JSON.stringify(submissionData));
      localStorage.removeItem('kalakriti-payment-success');
      
      setSubmitted(true);
      toast.success('Submission successful! Check your email for confirmation.');
      
    } catch (error) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Submission Successful!</h1>
            <p className="text-gray-600 mb-4">
              Your contestant ID is: <span className="font-mono font-bold text-blue-600">{contestantId}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              A confirmation email has been sent to your registered email address with your contestant ID and further instructions.
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => navigate('/auth/signup')}
              >
                Create Account with Contestant ID
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <Badge className="mb-4">Submission Form</Badge>
              <h1 className="text-3xl font-bold mb-2">Submit Your Artwork</h1>
              <p className="text-gray-600">Kalakriti {event.name}</p>
              <p className="text-sm text-gray-500 mt-2">
                Contestant ID: <span className="font-mono font-bold">{contestantId}</span>
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Participant Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="artworkTitle">Artwork Title</Label>
                    <Input
                      id="artworkTitle"
                      name="artworkTitle"
                      value={formData.artworkTitle}
                      onChange={handleInputChange}
                      placeholder="Give your artwork a title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="artworkDescription">Artwork Description</Label>
                    <Textarea
                      id="artworkDescription"
                      name="artworkDescription"
                      value={formData.artworkDescription}
                      onChange={handleInputChange}
                      placeholder="Describe your artwork, inspiration, or technique used"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="files">Upload Artwork Files *</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload {formData.numberOfArtworks} artwork file(s)
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Accepted formats: {event.fileTypes}
                      </p>
                      <input
                        type="file"
                        id="files"
                        onChange={handleFileChange}
                        multiple={formData.numberOfArtworks > 1}
                        accept="image/*,video/*,audio/*,.pdf"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('files')?.click()}
                      >
                        Choose Files
                      </Button>
                      {files.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium">Selected files:</p>
                          <ul className="text-xs text-gray-600">
                            {files.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full bg-gradient-to-r ${event.color} hover:opacity-90 text-white`}
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Submit Artwork
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SubmissionForm;
