"use client";

import Link from "next/link";

interface FooterNewProps {
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
}

export default function FooterNew({
  content = {
    companyName: "Victor Springs",
    description: "Your trusted partner for premium property rentals in Kenya.",
    socialLinks: {
      facebook: "https://facebook.com/victorsprings",
      twitter: "https://twitter.com/victorsprings",
      instagram: "https://instagram.com/victorsprings",
      linkedin: "https://linkedin.com/company/victorsprings",
    },
    quickLinks: ["Properties", "About", "Contact"],
  },
}: FooterNewProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>{content.companyName}</h4>
          <ul className="footer-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/properties">Properties</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li>
              <Link href="/help">Help Center</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="footer-social">
            <a href={content.socialLinks.facebook} aria-label="Facebook">
              📘
            </a>
            <a href={content.socialLinks.twitter} aria-label="Twitter">
              🐦
            </a>
            <a href={content.socialLinks.instagram} aria-label="Instagram">
              📷
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} {content.companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
