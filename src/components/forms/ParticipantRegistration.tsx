import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Upload, CreditCard, CheckCircle, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ParticipantRegistrationProps {
  eventType: string;
  eventName: string;
  eventColor: string;
  onClose: () => void;
}

const eventDetails = {
  art: { name: 'Art Competition', fee: 150, acceptedFiles: 'image/*' },
  photography: { name: 'Photography Competition', fee: 150, acceptedFiles: 'image/*' },
  mehndi: { name: 'Mehndi Competition', fee: 150, acceptedFiles: 'image/*' },
  rangoli: { name: 'Rangoli Competition', fee: 150, acceptedFiles: 'image/*' },
  dance: { name: 'Dance Competition', fee: 150, acceptedFiles: 'video/*' },
  singing: { name: 'Singing Competition', fee: 150, acceptedFiles: 'audio/*,video/*' }
};

const ParticipantRegistration: React.FC<ParticipantRegistrationProps> = ({
  eventType,
  eventName,
  eventColor,
  onClose
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    city: '',
    state: '',
    participantCategory: 'individual',
    previousExperience: '',
    submission: null as File | null
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [participantId, setParticipantId] = useState('');

  const event = eventDetails[eventType as keyof typeof eventDetails];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (file.size > maxSize) {
        toast.error('File size must be less than 50MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, submission: file }));
      toast.success('File uploaded successfully!');
    }
  };

  const validateStep1 = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'age', 'city', 'state'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast.error('Please fill all required fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.submission) {
      toast.error('Please upload your submission file');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate participant ID
    const id = generateParticipantId(eventType);
    setParticipantId(id);
    
    // Save participant data to localStorage
    const participantData = {
      ...formData,
      participantId: id,
      eventType,
      eventName,
      registrationDate: new Date().toISOString(),
      status: 'registered',
      paymentStatus: 'completed',
      submissionFileName: formData.submission?.name || ''
    };
    
    const existingParticipants = JSON.parse(localStorage.getItem('kalakriti-participants') || '[]');
    existingParticipants.push(participantData);
    localStorage.setItem('kalakriti-participants', JSON.stringify(existingParticipants));
    
    setPaymentProcessing(false);
    setRegistrationComplete(true);
    toast.success('Registration completed successfully!');
  };

  const generateParticipantId = (eventType: string) => {
    const eventCodes = {
      art: 'A',
      photography: 'P',
      mehndi: 'M',
      rangoli: 'R',
      dance: 'D',
      singing: 'S'
    };
    
    const season = 'S1';
    const eventCode = eventCodes[eventType as keyof typeof eventCodes];
    const year = '25';
    const participantNumber = String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0');
    
    return `${season}${eventCode}${year}${participantNumber}`;
  };

  if (registrationComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl p-8 max-w-md w-full text-center"
          onClick={e => e.stopPropagation()}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-kalakriti-primary mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your participant ID is: <span className="font-bold text-kalakriti-secondary">{participantId}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please save this ID for future reference. You will receive an email confirmation shortly.
          </p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-2">Step {step} of 3</Badge>
              <h2 className="text-xl font-bold text-kalakriti-primary">Register for {eventName}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit phone number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Your age"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Your city"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Your state"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="previousExperience">Previous Experience (Optional)</Label>
                  <Textarea
                    id="previousExperience"
                    name="previousExperience"
                    value={formData.previousExperience}
                    onChange={handleInputChange}
                    placeholder="Tell us about your previous experience in this field"
                    className="min-h-[80px]"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Submission
                </h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-4">
                    <Label htmlFor="submission" className="cursor-pointer">
                      <span className="text-lg font-medium text-kalakriti-primary hover:text-kalakriti-secondary">
                        Click to upload your submission
                      </span>
                    </Label>
                    <p className="text-sm text-gray-500 mt-2">
                      {eventType === 'dance' || eventType === 'singing' ? 
                        'Upload video file (max 50MB)' : 
                        'Upload image file (max 50MB)'}
                    </p>
                  </div>
                  <Input
                    id="submission"
                    name="submission"
                    type="file"
                    accept={event?.acceptedFiles}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {formData.submission && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Selected:</strong> {formData.submission.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Size: {(formData.submission.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment & Review
                </h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Registration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Competition:</span>
                      <span className="font-medium">{eventName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participant:</span>
                      <span className="font-medium">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registration Fee:</span>
                      <span className="font-medium">₹{event?.fee}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span>₹{event?.fee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-4 border-t">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button onClick={handleNextStep}>
                  Next Step
                </Button>
              ) : (
                <Button 
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                  className={`bg-gradient-to-r ${eventColor} text-white`}
                >
                  {paymentProcessing ? 'Processing...' : `Pay ₹${event?.fee}`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ParticipantRegistration;