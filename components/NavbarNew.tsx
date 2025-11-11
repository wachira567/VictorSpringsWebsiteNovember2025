"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function NavbarNew() {
  const { user, isLoaded } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress === "wachiramboche2@gmail.com";

  return (
    <header className="navbar">
      <div className="navbar__logo">Victor Springs</div>
      <nav className="navbar__nav">
        <Link href="/" className="navbar__link">
          Home
        </Link>
        <Link href="/properties" className="navbar__link">
          Properties
        </Link>
        <Link href="/about" className="navbar__link">
          About
        </Link>
        <Link href="/contact" className="navbar__link">
          Contact
        </Link>
        {user && (
          <>
            <Link href="/profile" className="navbar__link">
              Profile
            </Link>
            <Link href="/saved" className="navbar__link">
              Saved
            </Link>
          </>
        )}
        {isAdmin && (
          <>
            <Link href="/admin/dashboard" className="navbar__link">
              <span className="admin-icon">⚡</span> Dashboard
            </Link>
            <Link href="/admin/properties" className="navbar__link">
              <span className="admin-icon">🏠</span> Manage Properties
            </Link>
            <Link href="/admin/inquiries" className="navbar__link">
              <span className="admin-icon">💬</span> Inquiries
            </Link>
            <Link href="/admin/content" className="navbar__link">
              <span className="admin-icon">📝</span> Content
            </Link>
            <Link href="/admin/admins" className="navbar__link">
              <span className="admin-icon">👥</span> Manage Admins
            </Link>
          </>
        )}
      </nav>
      <div className="navbar-auth">
        {isLoaded && user ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <div className="flex gap-3">
            <Link href="/sign-in" className="secondary-button">
              Sign In
            </Link>
            <Link href="/sign-up" className="primary-button">
              Sign Up
            </Link>
          </div>
        )}
      </div>
      <button
        className="navbar-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isMenuOpen && (
        <div className="navbar-menu active">
          <Link
            href="/"
            className="navbar-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/properties"
            className="navbar-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Properties
          </Link>
          <Link
            href="/about"
            className="navbar-link"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="navbar-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          {user && (
            <>
              <Link
                href="/profile"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/saved"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Saved
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link
                href="/admin/dashboard"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="admin-icon">⚡</span> Dashboard
              </Link>
              <Link
                href="/admin/properties"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="admin-icon">🏠</span> Manage Properties
              </Link>
              <Link
                href="/admin/inquiries"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="admin-icon">💬</span> Inquiries
              </Link>
              <Link
                href="/admin/content"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="admin-icon">📝</span> Content
              </Link>
              <Link
                href="/admin/admins"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="admin-icon">👥</span> Manage Admins
              </Link>
            </>
          )}
          {!user && (
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-gray-200">
              <Link
                href="/sign-in"
                className="secondary-button w-full text-center py-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="primary-button w-full text-center py-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
