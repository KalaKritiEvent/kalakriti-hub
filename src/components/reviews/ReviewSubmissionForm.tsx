import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner';

const ReviewSubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    review: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.review) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get existing reviews
    const existingReviews = JSON.parse(localStorage.getItem('kalakriti-reviews') || '[]');

    // Create new review
    const newReview = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    // Save review
    existingReviews.push(newReview);
    localStorage.setItem('kalakriti-reviews', JSON.stringify(existingReviews));

    toast.success('Review submitted successfully! It will be visible after admin approval.');
    
    // Reset form
    setFormData({
      name: '',
      role: '',
      rating: 5,
      review: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Share Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Your Role/Category</Label>
              <Input
                id="role"
                placeholder="e.g., Visual Artist, Dancer, etc."
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>

            <div>
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= formData.rating
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="review">Your Review *</Label>
              <Textarea
                id="review"
                placeholder="Share your experience with Kalakriti..."
                value={formData.review}
                onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                className="h-32"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReviewSubmissionForm;
