
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('kalakriti-token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Results', path: '/results' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('kalakriti-token');
    localStorage.removeItem('kalakriti-user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
          >
            <span className="font-heading text-xl md:text-2xl font-bold text-kalakriti-primary">
              Kalakriti<span className="text-kalakriti-secondary">Events</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors relative group',
                  location.pathname === link.path
                    ? 'text-kalakriti-secondary'
                    : 'text-kalakriti-primary hover:text-kalakriti-secondary'
                )}
              >
                {link.name}
                <span 
                  className={cn(
                    'absolute bottom-0 left-0 w-full h-0.5 bg-kalakriti-secondary transform origin-bottom-right transition-transform duration-300 ease-out',
                    location.pathname === link.path
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100 group-hover:origin-bottom-left'
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                    <User size={16} />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/auth/signup">
                  <Button className="bg-kalakriti-secondary hover:bg-blue-600 text-white" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden inline-flex p-2 rounded-md text-kalakriti-primary"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white animate-slide-down">
          <div className="px-4 pt-2 pb-4 space-y-1 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  location.pathname === link.path
                    ? 'text-kalakriti-secondary bg-kalakriti-blue-light'
                    : 'text-kalakriti-primary hover:text-kalakriti-secondary hover:bg-gray-50'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Buttons for Mobile */}
            <div className="pt-4 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full justify-center"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    className="w-full bg-kalakriti-primary hover:bg-kalakriti-dark" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/auth/login" 
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link 
                    to="/auth/signup" 
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button 
                      className="w-full bg-kalakriti-secondary hover:bg-blue-600 text-white"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
