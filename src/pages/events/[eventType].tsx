
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Trophy, Star, ArrowRight, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const eventDetails = {
  art: {
    title: 'Kalakriti Art Competition',
    subtitle: 'Express Your Creativity Through Visual Arts',
    description: 'Showcase your artistic talent in our premier art competition featuring painting, sketching, and digital art categories.',
    longDescription: 'Join India\'s most prestigious art competition where creativity meets recognition. Whether you\'re a traditional painter, skilled sketcher, or digital artist, this platform celebrates all forms of visual expression. Our expert judges from renowned art institutions will evaluate submissions based on creativity, technique, and artistic vision.',
    categories: ['Traditional Painting', 'Digital Art', 'Sketching & Drawing', 'Mixed Media'],
    prizes: ['₹50,000 Cash Prize + Certificate', '₹30,000 Cash Prize + Certificate', '₹20,000 Cash Prize + Certificate'],
    entryFee: 500,
    deadline: 'March 31, 2025',
    participants: '2,500+',
    image: '/images/art-hero.jpg',
    theme: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-50',
    accentColor: 'text-red-600'
  },
  photography: {
    title: 'Kalakriti Photography Contest',
    subtitle: 'Capture Life Through Your Lens',
    description: 'Document the world around you in our comprehensive photography competition across multiple categories.',
    longDescription: 'Photography is the art of frozen time, and we invite you to share your unique perspective with the world. From stunning portraits to breathtaking landscapes, from candid street photography to creative conceptual work - every frame tells a story.',
    categories: ['Portrait Photography', 'Landscape & Nature', 'Street Photography', 'Conceptual Art'],
    prizes: ['₹40,000 Cash Prize + Equipment', '₹25,000 Cash Prize + Equipment', '₹15,000 Cash Prize + Equipment'],
    entryFee: 600,
    deadline: 'April 15, 2025',
    participants: '1,800+',
    image: '/images/photography-hero.jpg',
    theme: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    accentColor: 'text-blue-600'
  },
  mehndi: {
    title: 'Kalakriti Mehndi Championship',
    subtitle: 'Traditional Art on Canvas of Skin',
    description: 'Celebrate the ancient art of mehndi with intricate designs and creative patterns.',
    longDescription: 'Mehndi is more than just body art - it\'s a cultural celebration that has adorned hands and hearts for centuries. From traditional bridal patterns to contemporary fusion designs, showcase your expertise in this timeless art form.',
    categories: ['Traditional Bridal', 'Arabic Patterns', 'Contemporary Fusion', 'Festival Special'],
    prizes: ['₹35,000 Cash Prize + Kit', '₹20,000 Cash Prize + Kit', '₹12,000 Cash Prize + Kit'],
    entryFee: 450,
    deadline: 'March 20, 2025',
    participants: '1,200+',
    image: '/images/mehndi-hero.jpg',
    theme: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    accentColor: 'text-orange-600'
  },
  rangoli: {
    title: 'Kalakriti Rangoli Festival',
    subtitle: 'Colors of Tradition and Innovation',
    description: 'Create vibrant rangoli patterns that blend traditional techniques with modern creativity.',
    longDescription: 'Rangoli represents the beautiful confluence of devotion, art, and cultural heritage. Create stunning floor art using colors, flowers, and innovative materials while honoring this sacred tradition.',
    categories: ['Traditional Patterns', 'Floral Rangoli', 'Contemporary Designs', 'Eco-friendly Materials'],
    prizes: ['₹30,000 Cash Prize + Supplies', '₹18,000 Cash Prize + Supplies', '₹10,000 Cash Prize + Supplies'],
    entryFee: 400,
    deadline: 'April 5, 2025',
    participants: '900+',
    image: '/images/rangoli-hero.jpg',
    theme: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    accentColor: 'text-purple-600'
  },
  dance: {
    title: 'Kalakriti Dance Competition',
    subtitle: 'Rhythm, Grace, and Cultural Expression',
    description: 'Showcase your dancing prowess across classical, folk, and contemporary dance forms.',
    longDescription: 'Dance is the poetry of movement, expressing emotions that words cannot capture. Whether you excel in classical Indian dance forms, energetic folk traditions, or contemporary choreography, this platform celebrates all forms of dance artistry.',
    categories: ['Classical Indian Dance', 'Folk Dance Forms', 'Contemporary & Modern', 'Fusion Choreography'],
    prizes: ['₹45,000 Cash Prize + Trophy', '₹28,000 Cash Prize + Trophy', '₹18,000 Cash Prize + Trophy'],
    entryFee: 700,
    deadline: 'April 10, 2025',
    participants: '1,500+',
    image: '/images/dance-hero.jpg',
    theme: 'from-green-500 to-teal-600',
    bgColor: 'bg-green-50',
    accentColor: 'text-green-600'
  },
  singing: {
    title: 'Kalakriti Singing Contest',
    subtitle: 'Melodies That Touch the Soul',
    description: 'Let your voice be heard in our prestigious singing competition featuring diverse musical genres.',
    longDescription: 'Music transcends boundaries and touches souls. From classical ragas that stir emotions to contemporary melodies that energize spirits, showcase your vocal talent in this comprehensive singing competition.',
    categories: ['Classical Vocal', 'Bollywood Playback', 'Folk Songs', 'Contemporary Music'],
    prizes: ['₹40,000 Cash Prize + Recording', '₹25,000 Cash Prize + Recording', '₹15,000 Cash Prize + Recording'],
    entryFee: 650,
    deadline: 'March 25, 2025',
    participants: '2,000+',
    image: '/images/singing-hero.jpg',
    theme: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    accentColor: 'text-indigo-600'
  }
};

const EventDetails = () => {
  const { eventType } = useParams();
  const navigate = useNavigate();
  const [selectedArtworks, setSelectedArtworks] = useState(1);
  
  const event = eventDetails[eventType as keyof typeof eventDetails];
  
  if (!event) {
    return <div>Event not found</div>;
  }

  const handleParticipateNow = () => {
    const totalAmount = event.entryFee * selectedArtworks;
    // Redirect to payment page with selected artworks
    navigate(`/payment/${eventType}?artworks=${selectedArtworks}&amount=${totalAmount}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className={`relative pt-20 pb-20 bg-gradient-to-br ${event.theme} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                Season 1 • 2025
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
                {event.title}
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-white/90">
                {event.subtitle}
              </p>
              <p className="text-lg mb-8 text-white/80">
                {event.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Deadline: {event.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{event.participants} Participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  <span>₹{event.entryFee} Entry Fee</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={() => document.getElementById('participate')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Participate Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Heart className="mr-2 h-4 w-4" /> Save Event
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className={`py-20 ${event.bgColor}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-8 mb-8"
              >
                <h2 className="text-3xl font-bold mb-6">About The Competition</h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {event.longDescription}
                </p>
                
                <h3 className="text-2xl font-semibold mb-4">Competition Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {event.categories.map((category, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Star className={`h-5 w-5 ${event.accentColor}`} />
                      <span className="font-medium">{category}</span>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-2xl font-semibold mb-4">Prizes & Recognition</h3>
                <div className="space-y-3">
                  {event.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{prize}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Participation Card */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                id="participate"
                className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
              >
                <h3 className="text-2xl font-bold mb-4">Participate Now</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Entry Fee per Artwork:</span>
                    <span className="font-bold">₹{event.entryFee}</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Artworks</label>
                    <select 
                      value={selectedArtworks}
                      onChange={(e) => setSelectedArtworks(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Artwork{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold border-t pt-4">
                    <span>Total Amount:</span>
                    <span>₹{event.entryFee * selectedArtworks}</span>
                  </div>
                </div>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${event.theme} hover:opacity-90 text-white`}
                  size="lg"
                  onClick={handleParticipateNow}
                >
                  Proceed to Payment
                </Button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Secure payment via Razorpay</p>
                  <p>You'll receive submission form after payment</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default EventDetails;
