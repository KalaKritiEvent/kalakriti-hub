
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold font-heading text-center mb-8 text-kalakriti-primary">About Kalakriti Hub</h1>
            
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-smooth p-6 md:p-8 mb-10">
              <div className="prose prose-lg max-w-none">
                <p className="mb-6">
                  Kalakriti Events Organizes Competitions is a premier platform for celebrating Indian art and cultural expressions. Our mission is to discover, showcase and nurture artistic talent across various traditional and contemporary art forms through well-structured competitions.
                </p>
                
                <h2 className="text-2xl font-semibold font-heading text-kalakriti-primary mb-4">Our Vision</h2>
                <p className="mb-6">
                  We envision a world where every artist finds their rightful platform and recognition. Kalakriti Hub aims to bridge the gap between talented artists and art enthusiasts by creating opportunities that showcase India's rich artistic heritage while embracing modern artistic expressions.
                </p>
                
                <h2 className="text-2xl font-semibold font-heading text-kalakriti-primary mb-4">Our Story</h2>
                <p className="mb-6">
                  Founded in 2018, Kalakriti Events Organizes Competitions began as a small community initiative to bring together local artists. What started as a modest competition has now blossomed into a nationwide platform that hosts multiple competitions throughout the year, covering various art forms from painting and photography to dance and music.
                </p>
                
                <h2 className="text-2xl font-semibold font-heading text-kalakriti-primary mb-4">What We Offer</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Nationwide competitions across multiple art forms</li>
                  <li>Professional judging by industry experts</li>
                  <li>Recognition and rewards for exceptional talent</li>
                  <li>A nurturing community of fellow artists</li>
                  <li>Opportunities for showcasing work to a wider audience</li>
                  <li>Workshops and masterclasses to enhance skills</li>
                </ul>
                
                <h2 className="text-2xl font-semibold font-heading text-kalakriti-primary mb-4">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-kalakriti-secondary mb-2">Authenticity</h3>
                    <p>We celebrate the genuine expression of art in all its forms.</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-kalakriti-secondary mb-2">Inclusivity</h3>
                    <p>We welcome artists of all backgrounds, ages, and experience levels.</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-kalakriti-secondary mb-2">Excellence</h3>
                    <p>We strive for the highest standards in all our competitions and events.</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-kalakriti-secondary mb-2">Community</h3>
                    <p>We foster a supportive environment where artists can connect and grow together.</p>
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold font-heading text-kalakriti-primary mb-4">Join Our Journey</h2>
                <p>
                  Whether you're an artist looking to showcase your talent, an art enthusiast wanting to discover new works, or an organization interested in partnering with us, we invite you to be part of the Kalakriti family. Together, let's create a vibrant ecosystem that celebrates the rich tapestry of Indian art and culture.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
