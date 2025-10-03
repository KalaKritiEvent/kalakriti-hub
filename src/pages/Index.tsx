
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import EventCard from '@/components/home/EventCard';
import { eventTypes } from '@/lib/utils';

// Import images
import aboutKalakriti from '@/assets/about-kalakriti.jpg';
import aboutKalakritiSmall from '@/assets/about-kalakriti-small.jpg';
import testimonial1 from '@/assets/testimonial-1.jpg';
import testimonial2 from '@/assets/testimonial-2.jpg';
import testimonial3 from '@/assets/testimonial-3.jpg';
import testimonial4 from '@/assets/testimonial-4.jpg';
import testimonial5 from '@/assets/testimonial-5.jpg';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Events Section */}
      <section id="events-section" className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="bg-kalakriti-blue-light text-kalakriti-secondary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Our Competitions
          </span>
          <h2 className="h2 mb-4">Explore Our Art Competitions</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Kalakriti Events Organizes Competitions designed to showcase your talent and creativity. 
            From traditional art forms to modern expressions, find your perfect platform.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventTypes.map((event, index) => (
            <EventCard
              key={event.type}
              title={event.title}
              description={event.description}
              imageSrc={event.image}
              eventType={event.type}
              index={index}
            />
          ))}
        </div>
      </section>
      
      {/* About Kalakriti Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full"
            >
              <span className="bg-kalakriti-gold-light text-kalakriti-accent px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                About Us
              </span>
              <h2 className="h2 mb-4 md:mb-6">Celebrating Art & Creativity Since 2024</h2>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Kalakriti Events Organizes Competitions with a vision to create a platform where artists of all backgrounds and skill levels can showcase their talent, receive recognition, and connect with a community of like-minded creators.
              </p>
              <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                Our competitions span multiple artistic disciplines, from visual arts to performance, providing opportunities for creative expression in various forms. We believe in the power of art to inspire, transform, and unite.
              </p>
              <div className="flex flex-wrap gap-4 md:gap-6 mt-6 md:mt-8 justify-center lg:justify-start">
                <div className="text-center min-w-[100px]">
                  <p className="text-2xl md:text-3xl font-bold text-kalakriti-primary">10+</p>
                  <p className="text-gray-600 text-xs md:text-sm">Events Yearly</p>
                </div>
                <div className="text-center min-w-[100px]">
                  <p className="text-2xl md:text-3xl font-bold text-kalakriti-primary">5000+</p>
                  <p className="text-gray-600 text-xs md:text-sm">Artists</p>
                </div>
                <div className="text-center min-w-[100px]">
                  <p className="text-2xl md:text-3xl font-bold text-kalakriti-primary">20+</p>
                  <p className="text-gray-600 text-xs md:text-sm">States Reached</p>
                </div>
              </div>
              <div className="mt-6 md:mt-8 flex justify-center lg:justify-start">
                <Link to="/about-us">
                  <Button variant="outline" className="group text-sm md:text-base">
                    Learn More About Us
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative px-6 md:px-0">
                <div className="rounded-lg overflow-hidden shadow-smooth">
                  <img 
                    src={aboutKalakriti} 
                    alt="Kalakriti Event" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-2 md:-bottom-6 md:-left-6 bg-white p-2 md:p-4 rounded-lg shadow-smooth">
                  <img 
                    src={aboutKalakritiSmall} 
                    alt="Art Exhibition" 
                    className="w-16 h-16 md:w-24 md:h-24 object-cover rounded"
                  />
                </div>
                <div className="absolute -top-4 -right-2 md:-top-6 md:-right-6 bg-kalakriti-accent text-kalakriti-primary p-3 md:p-4 rounded-lg shadow-smooth flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg md:text-xl font-bold">2<sup className="text-xs">nd</sup></p>
                    <p className="text-xs md:text-sm font-medium">Year</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Reviews Section (User Submitted & Approved) */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="bg-kalakriti-blue-light text-kalakriti-secondary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Reviews
          </span>
          <h2 className="h2 mb-4">What Our Artists Say</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-4">
            Hear from participants who have showcased their talent and grown their artistic journey with Kalakriti.
          </p>
          <Link to="/submit-review">
            <Button variant="outline" className="text-sm">
              Share Your Experience
            </Button>
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {(() => {
            // Get approved reviews from localStorage
            const approvedReviews = JSON.parse(localStorage.getItem('kalakriti-reviews') || '[]')
              .filter((review: any) => review.status === 'approved')
              .slice(0, window.innerWidth < 768 ? 3 : 6);

            // Fallback testimonials if no approved reviews
            const fallbackTestimonials = [
              {
                name: "Priya Sharma",
                role: "Visual Artist",
                avatar: testimonial1,
                review: "Participating in Kalakriti's art competition gave me the platform I needed to showcase my work. The feedback from judges was invaluable for my growth as an artist.",
                rating: 5
              },
              {
                name: "Rahul Verma",
                role: "Photographer",
                avatar: testimonial2,
                review: "The photography competition at Kalakriti was exceptionally well-organized. The exposure I received helped me connect with other creators and even led to professional opportunities.",
                rating: 5
              },
              {
                name: "Neha Patel",
                role: "Classical Dancer",
                avatar: testimonial3,
                review: "As a classical dancer, finding the right platform to perform is crucial. Kalakriti Dance Competition provided not just a stage, but also recognition and appreciation for traditional art forms.",
                rating: 5
              }
            ];

            const reviews = approvedReviews.length > 0 ? approvedReviews : fallbackTestimonials.slice(0, window.innerWidth < 768 ? 3 : 3);

            return reviews.map((review: any, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                key={review.id || review.name}
                className="bg-white p-4 md:p-6 rounded-xl shadow-smooth hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-3 md:mr-4">
                    {review.avatar ? (
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {review.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base text-kalakriti-primary">{review.name}</h3>
                    {review.role && <p className="text-xs md:text-sm text-gray-600">{review.role}</p>}
                  </div>
                </div>
                <p className="text-gray-600 italic text-sm md:text-base">"{review.review}"</p>
              </motion.div>
            ));
          })()}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-kalakriti-primary to-kalakriti-dark text-white py-20 mt-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="h2 mb-6">Ready to Showcase Your Talent?</h2>
            <p className="text-gray-300 mb-8">
              Join thousands of artists who have found their creative community with Kalakriti Hub. Participate in our events, get recognized, and take your artistic journey to the next level.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-kalakriti-accent hover:bg-amber-500 text-kalakriti-primary"
              >
                Explore Events
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 hover:bg-white/10 text-white"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
