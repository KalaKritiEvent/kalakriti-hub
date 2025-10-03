import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReviewSubmissionForm from '@/components/reviews/ReviewSubmissionForm';
import { motion } from 'framer-motion';

const SubmitReview = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20 bg-gradient-to-br from-kalakriti-purple-light via-white to-kalakriti-blue-light">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-kalakriti-primary mb-4">
              Share Your Experience
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We value your feedback! Share your experience with Kalakriti Events and help us improve.
              Your review will be displayed on our website after admin approval.
            </p>
          </motion.div>

          <ReviewSubmissionForm />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SubmitReview;
