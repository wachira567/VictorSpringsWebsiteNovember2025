"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface FooterProps {
  content?: {
    companyName: string;
    description: string;
    socialLinks: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    };
    quickLinks: string[];
  };
  contact?: {
    address: string;
    phone: string;
    email: string;
  };
}

export default function Footer({
  content = {
    companyName: "Victor Springs",
    description:
      "Your trusted partner for premium property rentals in Kenya. Find your dream home with our extensive collection of apartments, houses, and villas across Nairobi and beyond.",
    socialLinks: {
      facebook: "https://facebook.com/victorsprings",
      twitter: "https://twitter.com/victorsprings",
      instagram: "https://instagram.com/victorsprings",
      linkedin: "https://linkedin.com/company/victorsprings",
    },
    quickLinks: ["Properties", "About", "Contact", "Profile", "Saved"],
  },
  contact = {
    address: "123 Main Street, Nairobi, Kenya",
    phone: "+254 700 000 000",
    email: "info@victorsprings.co.ke",
  },
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Company Info */}
          <div className="text-center md:text-left flex-1">
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
              {content.companyName}
            </h3>
            <p className="text-white text-sm leading-relaxed max-w-md">
              {content.description}
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center gap-3 text-sm">
            <h4 className="font-semibold text-purple-200 mb-1">Contact Us</h4>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-purple-300 mr-2 flex-shrink-0" />
              <span className="text-white">{contact.address}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-green-300 mr-2 flex-shrink-0" />
              <span className="text-white">{contact.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-indigo-300 mr-2 flex-shrink-0" />
              <span className="text-white">{contact.email}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center gap-3">
            <h4 className="font-semibold text-purple-200 mb-1">Quick Links</h4>
            <div className="flex flex-wrap gap-3 justify-center">
              {content.quickLinks.slice(0, 3).map((link, index) => (
                <Link
                  key={index}
                  href={
                    link === "Properties"
                      ? "/properties"
                      : link === "About"
                      ? "/about"
                      : link === "Contact"
                      ? "/contact"
                      : link === "Profile"
                      ? "/profile"
                      : link === "Saved"
                      ? "/saved"
                      : `/${link.toLowerCase()}`
                  }
                  className="text-white hover:text-purple-200 transition-all duration-200 text-sm font-medium hover:scale-105 transform"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center gap-3">
            <h4 className="font-semibold text-purple-200 mb-1">Follow Us</h4>
            <div className="flex space-x-3">
              <a
                href={content.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a
                href={content.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 text-white" />
              </a>
              <a
                href={content.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-white" />
              </a>
              <a
                href={content.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-purple-700 mt-4 pt-3 text-center">
          <p className="text-white text-sm">
            © {currentYear} {content.companyName}. All rights reserved. Made
            with ❤️ for Kenya's property market.
          </p>
        </div>
      </div>
    </footer>
  );
}
