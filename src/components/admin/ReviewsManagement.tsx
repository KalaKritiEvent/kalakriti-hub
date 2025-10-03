import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    const storedReviews = JSON.parse(localStorage.getItem('kalakriti-reviews') || '[]');
    setReviews(storedReviews);
  };

  const handleApprove = (reviewId: string) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'approved' as const } : review
    );
    setReviews(updatedReviews);
    localStorage.setItem('kalakriti-reviews', JSON.stringify(updatedReviews));
    toast.success('Review approved successfully!');
  };

  const handleReject = (reviewId: string) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'rejected' as const } : review
    );
    setReviews(updatedReviews);
    localStorage.setItem('kalakriti-reviews', JSON.stringify(updatedReviews));
    toast.success('Review rejected.');
  };

  const handleDelete = (reviewId: string) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem('kalakriti-reviews', JSON.stringify(updatedReviews));
    toast.success('Review deleted successfully!');
  };

  const filteredReviews = reviews.filter(review => 
    filter === 'all' ? true : review.status === filter
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reviews Management</CardTitle>
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All ({reviews.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
            >
              Pending ({reviews.filter(r => r.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'approved' ? 'default' : 'outline'}
              onClick={() => setFilter('approved')}
              size="sm"
            >
              Approved ({reviews.filter(r => r.status === 'approved').length})
            </Button>
            <Button
              variant={filter === 'rejected' ? 'default' : 'outline'}
              onClick={() => setFilter('rejected')}
              size="sm"
            >
              Rejected ({reviews.filter(r => r.status === 'rejected').length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No reviews found</p>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{review.name}</h4>
                      {review.role && (
                        <p className="text-sm text-gray-600">{review.role}</p>
                      )}
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          review.status === 'approved'
                            ? 'default'
                            : review.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {review.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 italic">"{review.review}"</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Submitted: {new Date(review.submittedAt).toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(review.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {review.status === 'rejected' && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {review.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(review.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManagement;
