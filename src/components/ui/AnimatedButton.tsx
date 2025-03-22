import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  isLoading?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  to,
  onClick,
  variant = 'default',
  className = '',
  size = 'default',
  disabled = false,
  isLoading = false,
  external = false,
  icon,
  iconPosition = 'right'
}) => {
  // Map custom variants to shadcn Button variants
  const variantMap = {
    default: 'default',
    primary: 'default',
    secondary: 'default',
    accent: 'default',
    outline: 'outline',
    ghost: 'ghost'
  };

  // Map custom colors based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-kalakriti-primary hover:bg-kalakriti-dark text-white';
      case 'secondary':
        return 'bg-kalakriti-secondary hover:bg-blue-600 text-white';
      case 'accent':
        return 'bg-kalakriti-accent hover:bg-amber-500 text-kalakriti-primary';
      default:
        return '';
    }
  };

  const buttonContent = (
    <motion.div
      className="flex items-center justify-center w-full"
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </motion.div>
  );

  // If a URL is provided, render as a Link
  if (to) {
    if (external) {
      return (
        <a 
          href={to} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={cn(
            "inline-block w-full",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <Button
            variant={variantMap[variant] as any}
            size={size}
            className={cn(getVariantClasses(), "w-full", className)}
            disabled={disabled || isLoading}
          >
            {buttonContent}
          </Button>
        </a>
      );
    }
    
    return (
      <Link 
        to={to} 
        className={cn(
          "inline-block w-full",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <Button
          variant={variantMap[variant] as any}
          size={size}
          className={cn(getVariantClasses(), "w-full", className)}
          disabled={disabled || isLoading}
        >
          {buttonContent}
        </Button>
      </Link>
    );
  }

  // Otherwise, render as a button
  return (
    <Button
      variant={variantMap[variant] as any}
      size={size}
      onClick={onClick}
      className={cn(getVariantClasses(), className)}
      disabled={disabled || isLoading}
    >
      {buttonContent}
    </Button>
  );
};

export default AnimatedButton;
