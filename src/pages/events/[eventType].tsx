
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Calendar, Clock, Award, CheckCircle, ChevronDown, Info, HelpCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { getEventDetails, formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { api } from '@/lib/api';

const EventDetails = () => {
  const { eventType } = useParams<{ eventType: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showFaq, setShowFaq] = useState<{ [key: string]: boolean }>({});
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Validate event type
  if (!eventType || !getEventDetails(eventType)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="h1 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const eventDetails = getEventDetails(eventType);
  
  const toggleFaq = (id: string) => {
    setShowFaq(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleParticipate = () => {
    navigate(`/payment/${eventType}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${eventDetails.image})` }}
        />
        
        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 py-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge className="bg-kalakriti-accent text-kalakriti-primary hover:bg-amber-400 mb-4">
              Kalakriti Events
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {eventDetails.title}
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl">
              {eventDetails.description}
            </p>
            
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-kalakriti-accent" />
                <span>Open for Submissions</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-kalakriti-accent" />
                <span>Deadline: 30 Dec 2023</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-kalakriti-accent" />
                <span>Cash Prizes</span>
              </div>
            </div>
            
            <AnimatedButton 
              variant="accent"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={handleParticipate}
              className="px-8"
            >
              Participate Now
            </AnimatedButton>
          </motion.div>
        </div>
      </section>
      
      {/* Event Details Tabs */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 w-full max-w-md mx-auto justify-center bg-gray-100">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="guidelines" className="flex-1">Guidelines</TabsTrigger>
              <TabsTrigger value="prizes" className="flex-1">Prizes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-heading font-semibold mb-6 text-kalakriti-primary">About {eventDetails.title}</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 mb-6">
                    {eventDetails.fullDescription}
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-10 mb-4">What You Can Submit</h3>
                  <ul className="space-y-3">
                    {['Original artwork created within the past 12 months',
                      'Multiple entries across different categories',
                      'Digital, traditional, or mixed media works',
                      'Photography, paintings, sketches, or creative compositions',
                      'High-resolution images of your work'].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-10 mb-4">Why Participate</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Recognition',
                        description: 'Gain visibility among art enthusiasts, judges, and other artists',
                        icon: '🏆'
                      },
                      {
                        title: 'Feedback',
                        description: 'Receive valuable critique from experts in the field',
                        icon: '💬'
                      },
                      {
                        title: 'Prizes',
                        description: 'Win cash prizes, opportunities, and recognition',
                        icon: '🎁'
                      }
                    ].map((benefit, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-3xl mb-2">{benefit.icon}</div>
                        <h4 className="font-medium text-kalakriti-primary mb-2">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="guidelines" className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-heading font-semibold mb-6 text-kalakriti-primary">Submission Guidelines</h2>
                
                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 text-kalakriti-primary">Eligibility</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-700">Open to participants of all ages and skill levels</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-700">Both individual and group submissions are accepted</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-700">No geographical limitations - participants from any location can join</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 text-kalakriti-primary">Technical Requirements</h3>
                    <ul className="space-y-3">
                      {eventDetails.guidelines.map((guideline, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-gray-700">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 text-kalakriti-primary">Submission Process</h3>
                    <ol className="space-y-6">
                      {[
                        {
                          title: 'Register and Pay',
                          description: 'Choose the number of artworks you wish to submit and complete the payment process'
                        },
                        {
                          title: 'Fill the Submission Form',
                          description: 'Provide your details and information about your work'
                        },
                        {
                          title: 'Upload Your Files',
                          description: 'Upload high-quality images or videos of your work'
                        },
                        {
                          title: 'Receive Confirmation',
                          description: 'Get your contestant ID and confirmation by email'
                        }
                      ].map((step, index) => (
                        <li key={index} className="flex">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-kalakriti-secondary text-white flex items-center justify-center mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-kalakriti-primary">{step.title}</h4>
                            <p className="text-gray-600 mt-1">{step.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 text-kalakriti-primary">Judging Criteria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { criteria: 'Creativity & Originality', weight: '25%' },
                        { criteria: 'Technical Excellence', weight: '25%' },
                        { criteria: 'Composition & Design', weight: '20%' },
                        { criteria: 'Interpretation of Theme', weight: '15%' },
                        { criteria: 'Overall Impact', weight: '15%' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                          <span className="text-gray-700">{item.criteria}</span>
                          <Badge variant="secondary">{item.weight}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="prizes" className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-heading font-semibold mb-6 text-kalakriti-primary">Prizes & Recognition</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    {
                      place: '1st Place',
                      prize: '₹15,000',
                      color: 'bg-gradient-to-br from-yellow-300 to-yellow-500'
                    },
                    {
                      place: '2nd Place',
                      prize: '₹10,000',
                      color: 'bg-gradient-to-br from-gray-300 to-gray-400'
                    },
                    {
                      place: '3rd Place',
                      prize: '₹5,000',
                      color: 'bg-gradient-to-br from-amber-700 to-amber-800'
                    }
                  ].map((prize, index) => (
                    <div key={index} className="text-center">
                      <div className={`h-24 w-24 rounded-full ${prize.color} mx-auto flex items-center justify-center mb-4`}>
                        <div className="text-white">
                          <Award className="h-10 w-10 mx-auto mb-1" />
                          <span className="text-sm font-medium">{prize.place}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-kalakriti-primary">{prize.prize}</h3>
                      <p className="text-gray-600 mt-2">Cash Prize</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-10">
                  <h3 className="text-lg font-medium mb-4 text-kalakriti-primary">Additional Benefits</h3>
                  <ul className="space-y-3">
                    {[
                      'Featured showcase on Kalakriti Hub website and social media',
                      'Digital certificate of participation for all contestants',
                      'Opportunity to be featured in Kalakriti\'s annual art compilation',
                      'Exclusive invitation to Kalakriti networking events',
                      'Feedback from panel of expert judges'
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-kalakriti-blue-light rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4 text-kalakriti-primary">Special Categories</h3>
                  <p className="text-gray-700 mb-4">
                    In addition to the main prizes, special recognition will be awarded in these categories:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Most Innovative Technique',
                      'Best New Talent',
                      'People\'s Choice Award',
                      'Excellence in Traditional Art'
                    ].map((category, index) => (
                      <div key={index} className="bg-white p-3 rounded-md flex items-center">
                        <Badge className="mr-2 bg-kalakriti-secondary">Award</Badge>
                        <span className="text-gray-700">{category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-kalakriti-primary">Participation Fee</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the package that suits your artistic vision. Submit multiple artworks for a better chance to win.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventDetails.pricing.map((price, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-smooth p-6 text-center ${
                  index === 1 ? 'md:border-2 md:border-kalakriti-secondary md:-mt-4 md:mb-4 md:pt-8 md:pb-8' : ''
                }`}
              >
                <div className="mb-4">
                  <span className="inline-block bg-kalakriti-blue-light text-kalakriti-secondary px-3 py-1 rounded-full text-sm">
                    {price.artworks} {price.artworks > 1 ? 'Artworks' : 'Artwork'}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold text-kalakriti-primary mb-2">
                  {formatCurrency(price.price)}
                </h3>
                <p className="text-gray-600 mb-6">One-time payment</p>
                
                <ul className="text-left space-y-3 mb-8">
                  {[
                    `Submit ${price.artworks} ${price.artworks > 1 ? 'artworks' : 'artwork'}`,
                    'Digital certificate',
                    'Contestant dashboard',
                    'Detailed feedback'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    index === 1 
                      ? 'bg-kalakriti-secondary hover:bg-blue-600' 
                      : 'bg-kalakriti-primary hover:bg-kalakriti-dark'
                  }`}
                  onClick={() => navigate(`/payment/${eventType}?artworks=${price.artworks}`)}
                >
                  {index === 1 ? 'Recommended' : 'Select Package'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-kalakriti-primary">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about the {eventDetails.title}.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How many artworks can I submit?",
                answer: "You can submit 1, 2, or 3 artworks based on the package you select. Each artwork will be judged individually."
              },
              {
                question: "What is the deadline for submissions?",
                answer: "The current deadline is December 30, 2023. All submissions must be completed by 11:59 PM IST on this date."
              },
              {
                question: "How will I know if I've won?",
                answer: "Results will be announced on our website and winners will be notified via email. You can also check your contestant dashboard for updates."
              },
              {
                question: "Can I participate from outside India?",
                answer: "Yes, the competition is open to participants from all countries. International contestants are welcome to participate."
              },
              {
                question: "What file formats are accepted for submissions?",
                answer: "For images, we accept JPG, PNG, and TIFF formats with a minimum resolution of 300 DPI. For videos, we accept MP4, MOV, and AVI formats."
              },
              {
                question: "How are the entries judged?",
                answer: "Entries are evaluated by a panel of expert judges based on creativity, technical skill, composition, interpretation, and overall impact."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="mb-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <button
                  className="w-full text-left flex justify-between items-center py-2"
                  onClick={() => toggleFaq(`faq-${index}`)}
                >
                  <h3 className="text-lg font-medium text-kalakriti-primary">{faq.question}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      showFaq[`faq-${index}`] ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {showFaq[`faq-${index}`] && (
                  <div className="mt-2 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-kalakriti-secondary to-blue-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">Ready to Showcase Your Talent?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join the {eventDetails.title} today and take a step toward recognition and artistic growth.
          </p>
          <AnimatedButton 
            variant="accent"
            size="lg"
            icon={<ArrowRight size={18} />}
            onClick={handleParticipate}
            className="px-8"
          >
            Participate Now
          </AnimatedButton>
          
          <div className="mt-6 flex items-center justify-center text-sm text-white/80">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span>Need help?</span>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-gray-900 p-2">
                  <p>Contact us at support@kalakritihub.com</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default EventDetails;
