import React from 'react';
// import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  // Mail, 
  // Phone, 
  // MapPin, 
  Globe, 
  Shield, 
  Heart 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">AI Translation</h3>
            <p className="text-sm text-gray-400">
              Making document translation simple, fast, and accurate with the power of AI.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a> */}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { text: 'Home', path: '/' },
                {/* text: 'About Us', path: '/about' */},
                {/* text: 'Services', path: '/services' */},
                { text: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.text}>
                  {/* <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.text}
                  </Link> */}
                  <span className="text-gray-400">{link.text}</span>
                </li>
              ))}
            </ul>
          </div>

         {/* <div>
            <h4 className="text-lg font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2">
              {[
                { icon: Globe, text: 'Document Translation' },
                { icon: Shield, text: 'Secure Processing' },
                { icon: Heart, text: 'Quality Assurance' },
              ].map((service) => (
                <li key={service.text} className="flex items-center space-x-2 text-gray-400">
                  <service.icon size={16} />
                  <span>{service.text}</span>
                </li>
              ))}
            </ul>
          </div>  
          */}

          {/* <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {[
                { icon: Mail, text: 'support@aitranslation.com' },
                { icon: Phone, text: '+1 (555) 123-4567' },
                { icon: MapPin, text: '123 AI Street, Tech City, TC 12345' },
              ].map((contact) => (
                <li key={contact.text} className="flex items-center space-x-2 text-gray-400">
                  <contact.icon size={16} />
                  <span className="text-sm">{contact.text}</span>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} AI Translation. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {[
                { text: 'Privacy Policy', path: '/privacy' },
                { text: 'Terms of Service', path: '/terms' },
                { text: 'Cookie Policy', path: '/cookies' },
              ].map((link) => (
                <span
                  key={link.text}
                  className="text-sm text-gray-400"
                >
                  {link.text}
                </span>
                // <Link
                //   key={link.text}
                //   to={link.path}
                //   className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                // >
                //   {link.text}
                // </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;