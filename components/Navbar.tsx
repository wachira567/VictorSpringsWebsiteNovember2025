"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress === "wachiramboche2@gmail.com";

  return (
    <nav
      className={`navbar ${isHidden ? "hidden" : ""} ${
        isScrolled
          ? "bg-gradient-to-r from-white/95 via-blue-50/90 to-purple-50/90 backdrop-blur-xl shadow-2xl border-b border-white/20"
          : "bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm"
      }`}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo group">
          <span className="relative">
            Victor Springs
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-500 ease-out"></div>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-menu">
          <li>
            <Link href="/" className="navbar-link group relative">
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 ease-out"></div>
            </Link>
          </li>
          <li>
            <Link href="/properties" className="navbar-link group relative">
              <span className="relative z-10">Properties</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-300 ease-out"></div>
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link
                  href="/admin/dashboard"
                  className="navbar-link group relative"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-xs">⚡</span>
                    Dashboard
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300 ease-out"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/properties"
                  className="navbar-link group relative"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-xs">🏠</span>
                    Manage Properties
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300 ease-out"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/inquiries"
                  className="navbar-link group relative"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-xs">💬</span>
                    Inquiries
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300 ease-out"></div>
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Auth Section */}
        <div className="navbar-auth">
          {isLoaded && user ? (
            <div className="relative group">
              <UserButton afterSignOutUrl="/" />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out -z-10"></div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/sign-in"
                className="secondary-button group relative overflow-hidden"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
              </Link>
              <Link
                href="/sign-up"
                className="primary-button group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggle group relative"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="relative">
            {isMenuOpen ? (
              <X
                size={24}
                className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
              />
            ) : (
              <Menu
                size={24}
                className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out -z-10"></div>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar-menu active bg-gradient-to-b from-white/95 via-blue-50/90 to-purple-50/90 backdrop-blur-xl border-t border-white/20 shadow-2xl">
          <li>
            <Link
              href="/"
              className="navbar-link group relative block py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">🏠</span>
                Home
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 ease-out"></div>
            </Link>
          </li>
          <li>
            <Link
              href="/properties"
              className="navbar-link group relative block py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">🏢</span>
                Properties
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-300 ease-out"></div>
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link
                  href="/admin/dashboard"
                  className="navbar-link group relative block py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">⚡</span>
                    Dashboard
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300 ease-out"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/properties"
                  className="navbar-link group relative block py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">🏠</span>
                    Manage Properties
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300 ease-out"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/inquiries"
                  className="navbar-link group relative block py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">💬</span>
                    Inquiries
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300 ease-out"></div>
                </Link>
              </li>
            </>
          )}
          {!user && (
            <li className="flex flex-col gap-3 mt-6 pt-4 border-t border-gray-200">
              <Link
                href="/sign-in"
                className="secondary-button w-full text-center py-3 group relative overflow-hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
              </Link>
              <Link
                href="/sign-up"
                className="primary-button w-full text-center py-3 group relative overflow-hidden shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
              </Link>
            </li>
          )}
        </div>
      )}
    </nav>
  );
}
