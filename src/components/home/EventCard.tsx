
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EventCardProps {
  title: string;
  description: string;
  imageSrc: string;
  eventType: string;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ 
  title, 
  description, 
  imageSrc, 
  eventType,
  index
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.1 * index,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      className="group event-card overflow-hidden rounded-xl bg-white shadow-smooth hover:shadow-smooth-lg transition-all duration-500"
    >
      <div className="relative overflow-hidden h-52">
        <div 
          className={cn(
            "absolute inset-0 bg-gray-200 animate-pulse",
            imageLoaded ? "hidden" : "block"
          )}
        />
        <img
          src={imageSrc}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-in-out",
            "group-hover:scale-110",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-kalakriti-accent text-kalakriti-primary rounded-md">
            Kalakriti
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-heading text-xl font-semibold text-kalakriti-primary mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>
        <div className="pt-2">
          <Link 
            to={`/events/${eventType}`}
            className="inline-flex items-center font-medium text-kalakriti-secondary hover:text-blue-700 transition-colors group/link"
          >
            <span>View More</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
