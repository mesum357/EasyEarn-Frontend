import { Gift, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-foreground to-foreground/90 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-primary p-2 rounded-xl">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">EasyEarn</span>
            </Link>
            <p className="text-white/80 leading-relaxed mb-6">
              Your trusted platform for daily lucky draws. Win amazing prizes with transparent, fair, and exciting draws.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/prizes" className="text-white/80 hover:text-white transition-colors">Current Prizes</Link></li>
              <li><Link to="/winners" className="text-white/80 hover:text-white transition-colors">Recent Winners</Link></li>
              <li><Link to="/how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-white/80 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-white/80 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/responsible-gaming" className="text-white/80 hover:text-white transition-colors">Responsible Gaming</Link></li>
              <li><Link to="/complaints" className="text-white/80 hover:text-white transition-colors">Complaints</Link></li>
              <li><Link to="/licensing" className="text-white/80 hover:text-white transition-colors">Licensing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-white/80">easyearnses@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-white/80">1-800-EASY-WIN</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-white/80">Available 24/7</span>
              </div>
            </div>
            
            <div className="mt-6 bg-white/10 rounded-xl p-4">
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <p className="text-sm text-white/80 mb-3">Get notified about new prizes and special offers.</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-primary"
                />
                <button className="btn-primary px-4 py-2 text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2024 EasyEarn.All rights reserved. 
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-white/60 text-sm">
                Licensed & Regulated
              </span>
              <div className="flex space-x-2">
                <div className="bg-success/20 text-success px-2 py-1 rounded text-xs font-medium">
                  SSL Secured
                </div>
                <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                  18+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
