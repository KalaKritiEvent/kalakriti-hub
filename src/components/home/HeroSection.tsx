
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Array of hero images
  const heroImages = [
    '/images/hero-art.jpg',
    '/images/hero-dance.jpg',
    '/images/hero-photography.jpg',
  ];
  
  // Auto-scroll slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      {heroImages.map((img, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            zIndex: currentSlide === index ? 0 : -1,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 z-10" />
          
          {/* Image */}
          <img
            src={img}
            alt="Kalakriti Event"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-white mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-kalakriti-accent/90 text-kalakriti-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-6"
          >
            Discover Your Artistic Journey
          </motion.span>
          
          <motion.h1 
            className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Unleash Your Creativity with 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-kalakriti-accent to-yellow-300 block md:inline">
              {" "}Kalakriti Hub
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Explore diverse artistic competitions, showcase your talent, and connect with a vibrant community of creators from across the country.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-kalakriti-secondary hover:bg-blue-600 text-white font-medium px-8"
              onClick={scrollToEvents}
            >
              Explore Events
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
      >
        <button onClick={scrollToEvents} className="text-white flex flex-col items-center">
          <span className="text-sm mb-2 text-gray-300">Scroll Down</span>
          <ChevronDown size={24} />
        </button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
