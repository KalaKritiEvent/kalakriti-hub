
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
          <h2 className="h2 mb-4">Explore Our Art Events</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover a variety of artistic competitions designed to showcase your talent and creativity. 
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
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <span className="bg-kalakriti-gold-light text-kalakriti-accent px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                About Us
              </span>
              <h2 className="h2 mb-6">Celebrating Art & Creativity Since 2018</h2>
              <p className="text-gray-600 mb-6">
                Kalakriti Hub was founded with a vision to create a platform where artists of all backgrounds and skill levels can showcase their talent, receive recognition, and connect with a community of like-minded creators.
              </p>
              <p className="text-gray-600 mb-6">
                Our events span multiple artistic disciplines, from visual arts to performance, providing opportunities for creative expression in various forms. We believe in the power of art to inspire, transform, and unite.
              </p>
              <div className="flex flex-wrap gap-6 mt-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-kalakriti-primary">10+</p>
                  <p className="text-gray-600">Events Yearly</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-kalakriti-primary">5000+</p>
                  <p className="text-gray-600">Artists</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-kalakriti-primary">20+</p>
                  <p className="text-gray-600">States Reached</p>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/about">
                  <Button variant="outline" className="group">
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
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="rounded-lg overflow-hidden shadow-smooth">
                  <img 
                    src="/images/about-kalakriti.jpg" 
                    alt="Kalakriti Event" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-smooth hidden md:block">
                  <img 
                    src="/images/about-kalakriti-small.jpg" 
                    alt="Art Exhibition" 
                    className="w-24 h-24 object-cover rounded"
                  />
                </div>
                <div className="absolute -top-6 -right-6 bg-kalakriti-accent text-kalakriti-primary p-4 rounded-lg shadow-smooth hidden md:flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-bold">6<sup>th</sup></p>
                    <p className="text-sm font-medium">Year</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="bg-kalakriti-blue-light text-kalakriti-secondary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Testimonials
          </span>
          <h2 className="h2 mb-4">What Our Artists Say</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Hear from participants who have showcased their talent and grown their artistic journey with Kalakriti Hub.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Priya Sharma",
              role: "Visual Artist",
              avatar: "/images/testimonial-1.jpg",
              quote: "Participating in Kalakriti's art event gave me the platform I needed to showcase my work. The feedback from judges was invaluable for my growth as an artist."
            },
            {
              name: "Rahul Verma",
              role: "Photographer",
              avatar: "/images/testimonial-2.jpg",
              quote: "The photography competition at Kalakriti Hub was exceptionally well-organized. The exposure I received helped me connect with other creators and even led to professional opportunities."
            },
            {
              name: "Neha Patel",
              role: "Dancer",
              avatar: "/images/testimonial-3.jpg",
              quote: "As a classical dancer, finding the right platform to perform is crucial. Kalakriti Dance Event provided not just a stage, but also recognition and appreciation for traditional art forms."
            }
          ].map((testimonial, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              key={testimonial.name}
              className="bg-white p-6 rounded-xl shadow-smooth"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-kalakriti-primary">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
            </motion.div>
          ))}
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
