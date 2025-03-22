
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <footer className="bg-kalakriti-primary text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Logo and About */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <h3 className="font-heading text-2xl font-bold">
                Kalakriti<span className="text-kalakriti-accent">Hub</span>
              </h3>
            </Link>
            <p className="text-gray-300 mb-6">
              Kalakriti Hub is a platform dedicated to promoting art and culture through various competitive events, providing opportunities for artists to showcase their talent.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About Us', 'Events', 'Results', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item === 'Home' ? '' : item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-lg font-semibold mb-4">Our Events</h4>
            <ul className="space-y-2">
              {['Art', 'Photography', 'Mehndi', 'Rangoli', 'Dance', 'Singing'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/events/${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Kalakriti {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4">
            <h4 className="font-heading text-lg font-semibold mb-4">Stay Connected</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 text-gray-300" />
                <span>info@kalakritihub.com</span>
              </div>
              <div className="flex items-start">
                <Phone size={18} className="mr-2 mt-1 text-gray-300" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-gray-300" />
                <span>123 Art Street, Creativity Lane, Mumbai - 400001</span>
              </div>
              
              {/* Newsletter */}
              <div className="pt-4">
                <h5 className="font-medium text-sm mb-2">Subscribe to our newsletter</h5>
                <form onSubmit={handleSubscribe} className="flex">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-kalakriti-accent rounded-r-none"
                  />
                  <Button 
                    type="submit" 
                    className="bg-kalakriti-accent hover:bg-amber-500 text-kalakriti-primary rounded-l-none"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <h3 className="font-heading text-xl font-semibold mb-6">Frequently Asked Questions</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-white/10">
              <AccordionTrigger className="text-left hover:text-kalakriti-accent">
                How can I participate in Kalakriti events?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                To participate in any Kalakriti event, browse through our events, select the one you're interested in, and click on the "Participate Now" button. Follow the registration process, complete the payment, and submit your work as per the guidelines.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-white/10">
              <AccordionTrigger className="text-left hover:text-kalakriti-accent">
                What payment methods are accepted?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                We accept various payment methods including credit/debit cards, UPI, net banking, and digital wallets through our secure payment gateway powered by Razorpay.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-white/10">
              <AccordionTrigger className="text-left hover:text-kalakriti-accent">
                How will I know if I've won a competition?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Results are announced on our website's Results page and winners are also notified via email. You can check your dashboard for updates on competitions you've participated in.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-white/10">
              <AccordionTrigger className="text-left hover:text-kalakriti-accent">
                Can I participate in multiple events?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Yes, you can participate in as many events as you wish. Each event requires a separate registration and submission process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-white/10">
              <AccordionTrigger className="text-left hover:text-kalakriti-accent">
                How do I access my contestant dashboard?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                After registration and submission, you'll receive a contestant ID. Use this ID to sign up on our platform, and then you can log in anytime to access your dashboard.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Kalakriti Hub. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
