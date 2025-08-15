import { Link } from "react-router-dom";
import { HardHat, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="gradient-service text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/f79fa9ee-03b6-4aee-9caa-8ec0cbc158f6.png" 
                alt="HireHand Construction Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">HireHand</span>
            </div>
            <p className="text-white/80 mb-4 max-w-md">
              Connecting homeowners with trusted construction professionals. 
              Get quality work done with transparent pricing and reliable service.
            </p>
            <div className="flex space-x-4 text-white/60">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@hirehand.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link to="/quotes" className="hover:text-white transition-smooth">
                  Find Professionals
                </Link>
              </li>
              <li>
                <Link to="/register-professional" className="hover:text-white transition-smooth">
                  Join as Professional
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-white transition-smooth">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-smooth">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-white/80">
              <li>Painting</li>
              <li>Carpentry</li>
              <li>Electrical</li>
              <li>Plumbing</li>
              <li>Masonry</li>
              <li>Interior Design</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2024 HireHand. All rights reserved. Built with care for construction professionals.</p>
        </div>
      </div>
    </footer>
  );
};