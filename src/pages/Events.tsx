
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/home/EventCard';

// Sample event data
const events = [
  {
    id: 1,
    title: 'Kalakriti Art Competition',
    description: 'Showcase your painting, sketching or digital art skills in India\'s premier art competition.',
    imageSrc: '/images/art-event.jpg',
    imageAlt: 'Art Competition',
    eventType: 'art',
    date: 'August 15 - September 30, 2023',
    entryFee: '₹500 per entry',
    categories: ['Painting', 'Sketching', 'Digital Art']
  },
  {
    id: 2,
    title: 'Kalakriti Photography Contest',
    description: 'Capture moments that tell stories through your lens in this national photography competition.',
    imageSrc: '/images/photography-event.jpg',
    imageAlt: 'Photography Contest',
    eventType: 'photography',
    date: 'September 1 - October 15, 2023',
    entryFee: '₹600 per entry',
    categories: ['Portrait', 'Landscape', 'Street Photography']
  },
  {
    id: 3,
    title: 'Kalakriti Mehndi Championship',
    description: 'Express your creativity through the traditional art of mehndi design.',
    imageSrc: '/images/mehndi-event.jpg',
    imageAlt: 'Mehndi Championship',
    eventType: 'mehndi',
    date: 'July 20 - August 25, 2023',
    entryFee: '₹450 per entry',
    categories: ['Traditional', 'Indo-Arabic', 'Modern Fusion']
  },
  {
    id: 4,
    title: 'Kalakriti Rangoli Festival',
    description: 'Celebrate the vibrant art form of rangoli with your unique patterns and designs.',
    imageSrc: '/images/rangoli-event.jpg',
    imageAlt: 'Rangoli Festival',
    eventType: 'rangoli',
    date: 'October 15 - November 20, 2023',
    entryFee: '₹400 per entry',
    categories: ['Traditional', 'Contemporary', 'Eco-friendly']
  },
  {
    id: 5,
    title: 'Kalakriti Dance Competition',
    description: 'Showcase your dancing talent across various Indian classical and contemporary styles.',
    imageSrc: '/images/dance-event.jpg',
    imageAlt: 'Dance Competition',
    eventType: 'dance',
    date: 'August 10 - September 25, 2023',
    entryFee: '₹700 per entry',
    categories: ['Classical', 'Folk', 'Contemporary']
  },
  {
    id: 6,
    title: 'Kalakriti Singing Contest',
    description: 'Let your voice shine in India\'s biggest vocal talent hunt across multiple genres.',
    imageSrc: '/images/singing-event.jpg',
    imageAlt: 'Singing Contest',
    eventType: 'singing',
    date: 'September 5 - October 20, 2023',
    entryFee: '₹650 per entry',
    categories: ['Classical', 'Bollywood', 'Folk Songs']
  }
];

const Events = () => {
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
              Our Events
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our range of competitive events celebrating various art forms across India. 
              Select an event to learn more and participate!
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * event.id }}
              >
                <EventCard
                  title={event.title}
                  description={event.description}
                  imageSrc={event.imageSrc}
                  eventType={event.eventType}
                  index={index}
                />
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Event Date: </span>
                    <span>{event.date}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Entry Fee: </span>
                    <span>{event.entryFee}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Categories: </span>
                    <span>{event.categories.join(', ')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-kalakriti-secondary rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Have Questions? Contact Us
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Events;
