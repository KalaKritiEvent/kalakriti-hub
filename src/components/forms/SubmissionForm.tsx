
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { UploadCloud, Loader2, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { getEventDetails } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fileType: 'image' | 'video';
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileType }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Validate file type
    if (fileType === 'image' && !selectedFile.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (fileType === 'video' && !selectedFile.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }
    
    setFile(selectedFile);
    onFileSelect(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="mb-6">
      <Label className="mb-2 block">Upload your {fileType === 'image' ? 'Artwork' : 'Performance'}</Label>
      
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragging ? 'border-kalakriti-secondary bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Drag & drop your file here, or{' '}
              <label className="text-kalakriti-secondary cursor-pointer hover:text-blue-600">
                browse
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileInput}
                  accept={fileType === 'image' ? 'image/*' : 'video/*'}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">
              {fileType === 'image' 
                ? 'PNG, JPG or JPEG (max. 10MB)' 
                : 'MP4, MOV or AVI (max. 10MB)'}
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {preview && fileType === 'image' && (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-16 w-16 object-cover rounded mr-3" 
                />
              )}
              {preview && fileType === 'video' && (
                <video 
                  src={preview}
                  className="h-16 w-16 object-cover rounded mr-3"
                />
              )}
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface SubmissionFormProps {
  eventType: string;
  numberOfArtworks: number;
  paymentId: string;
  orderId: string;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ 
  eventType, 
  numberOfArtworks,
  paymentId,
  orderId
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    title: '',
    description: ''
  });

  // Auto-fetch user data if logged in
  React.useEffect(() => {
    const user = localStorage.getItem('kalakriti-user');
    const submission = localStorage.getItem('kalakriti-submission');
    
    if (user) {
      const userData = JSON.parse(user);
      setFormData(prev => ({
        ...prev,
        firstName: userData.fullName?.split(' ')[0] || '',
        lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        pincode: userData.pincode || ''
      }));
    } else if (submission) {
      const submissionData = JSON.parse(submission);
      setFormData({
        firstName: submissionData.firstName || '',
        lastName: submissionData.lastName || '',
        age: submissionData.age || '',
        email: submissionData.email || '',
        phoneNumber: submissionData.phoneNumber || '',
        password: '',
        confirmPassword: '',
        address: submissionData.address || '',
        city: submissionData.city || '',
        state: submissionData.state || '',
        pincode: submissionData.pincode || '',
        title: '',
        description: ''
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (index: number, file: File) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const validateForm = () => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('kalakriti-token');
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
      toast.error('Please fill in all required fields');
      return false;
    }
    
    // Password validation only for new users (not logged in)
    if (!isLoggedIn) {
      if (!formData.password || !formData.confirmPassword) {
        toast.error('Please create a password for your account');
        return false;
      }
      
      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    // File validation
    if (files.length < numberOfArtworks) {
      toast.error(`Please upload ${numberOfArtworks} artwork${numberOfArtworks > 1 ? 's' : ''}`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const isLoggedIn = !!localStorage.getItem('kalakriti-token');
      
      // If not logged in, create account first
      if (!isLoggedIn) {
        const existingUsers = JSON.parse(localStorage.getItem('kalakriti-users') || '[]');
        
        // Check if email already exists
        if (existingUsers.some((u: any) => u.email === formData.email)) {
          toast.error('An account with this email already exists. Please log in.');
          setIsSubmitting(false);
          return;
        }
        
        // Create new user account
        const newUser = {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          age: formData.age,
          signedUpAt: new Date().toISOString(),
          hasParticipated: true
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('kalakriti-users', JSON.stringify(existingUsers));
        localStorage.setItem('kalakriti-token', 'auth-token-' + Date.now());
        localStorage.setItem('kalakriti-user', JSON.stringify(newUser));
      }
      
      // Generate contestant ID
      const eventCode = eventType.charAt(0).toUpperCase();
      const year = new Date().getFullYear().toString().slice(-2);
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const contestantId = `S1${eventCode}${year}${randomNum}`;
      
      // Create submission data
      const submissionData = {
        ...formData,
        contestantId,
        eventType,
        numberOfArtworks,
        paymentId,
        orderId,
        submittedAt: new Date().toISOString(),
        files: files.map(f => f.name)
      };
      
      // Store submission
      const submissions = JSON.parse(localStorage.getItem('kalakriti-submissions') || '[]');
      submissions.push(submissionData);
      localStorage.setItem('kalakriti-submissions', JSON.stringify(submissions));
      
      // Update user data with contestant ID
      const currentUser = JSON.parse(localStorage.getItem('kalakriti-user') || '{}');
      currentUser.contestantId = contestantId;
      currentUser.hasParticipated = true;
      localStorage.setItem('kalakriti-user', JSON.stringify(currentUser));
      
      toast.success('Your submission has been received successfully!');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get event details
  const eventDetails = getEventDetails(eventType);
  const fileType = ['dance', 'singing'].includes(eventType) ? 'video' : 'image';

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-smooth p-6 md:p-8"
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-heading font-bold text-kalakriti-primary mb-2">
            {eventDetails?.title} Submission
          </h2>
          <p className="text-gray-600">
            Please complete the form below to submit your {numberOfArtworks > 1 ? 'artworks' : 'artwork'} for the competition
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Your first name"
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
                placeholder="Your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Your age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Your 10-digit phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {!localStorage.getItem('kalakriti-token') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div>
                <Label htmlFor="password">Create Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-span-full text-sm text-blue-800">
                <p className="font-medium">Create your account automatically!</p>
                <p className="text-xs mt-1">By submitting, you'll get a dashboard to track your submissions and download certificates.</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              placeholder="Your street address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                placeholder="Your city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                name="state"
                placeholder="Your state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                name="pincode"
                placeholder="Your pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="title">Title of your {fileType === 'image' ? 'Artwork' : 'Performance'} *</Label>
            <Input
              id="title"
              name="title"
              placeholder={`Enter a title for your ${fileType === 'image' ? 'artwork' : 'performance'}`}
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={`Provide a brief description of your ${fileType === 'image' ? 'artwork' : 'performance'}`}
              value={formData.description}
              onChange={handleInputChange}
              className="h-24"
              required
            />
          </div>

          {/* File uploads */}
          {Array.from({ length: numberOfArtworks }).map((_, index) => (
            <FileUpload 
              key={index} 
              onFileSelect={(file) => handleFileSelect(index, file)} 
              fileType={fileType as 'image' | 'video'} 
            />
          ))}

          <div className="mt-8">
            <Button 
              type="submit" 
              className="w-full bg-kalakriti-secondary hover:bg-blue-600 text-white py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Complete Submission'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SubmissionForm;
