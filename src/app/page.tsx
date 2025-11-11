"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Home,
  Star,
  ArrowRight,
  Loader2,
  Sparkles,
  Zap,
  Shield,
  Heart,
} from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  city: string;
  county: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  featured: boolean;
  available: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch random featured properties
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch(
          "/api/properties?limit=3&featured=true&random=true",
          {
            signal: AbortSignal.timeout(5000), // 5 second timeout
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFeaturedProperties(data.properties || []);
        }
      } catch (error) {
        console.error("Error fetching featured properties:", error);
        // Set empty array on error to prevent infinite loading
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Background and Search */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Multi-layer Background */}
        <div className="absolute inset-0 z-0">
          {/* Primary Background Image */}
          <Image
            src="https://images.pexels.com/photos/2387674/pexels-photo-2387674.jpeg"
            alt="Beautiful property landscape"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            style={{ height: "100%", width: "100%" }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-blue-900/60" />

          {/* Animated Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern
                  id="hero-pattern"
                  x="0"
                  y="0"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 py-20">
          {/* Main Heading with Animation */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-pulse">
                Find Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
              Discover premium rental properties across Kenya with Victor
              Springs. Your perfect home awaits.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-2 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {/* Location Input */}
                <div className="relative md:col-span-2">
                  <div className="flex items-center px-6 py-4">
                    <MapPin className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Where do you want to live? (e.g., Nairobi, Kilimani)"
                      className="bg-transparent text-gray-900 placeholder-gray-500 outline-none flex-1 text-lg font-medium"
                    />
                  </div>
                </div>

                {/* Property Type Select */}
                <div className="relative">
                  <div className="flex items-center px-6 py-4">
                    <Home className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
                    <select className="bg-transparent text-gray-900 outline-none flex-1 text-lg font-medium appearance-none">
                      <option value="">Property type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="px-2">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white rounded-2xl px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
                    onClick={() => router.push("/properties")}
                  >
                    <Search className="h-6 w-6 mr-3" />
                    Search Now
                    <Sparkles className="h-5 w-5 ml-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats with Enhanced Design */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl font-black text-white mb-2">500+</div>
              <div className="text-sm text-gray-300 font-medium uppercase tracking-wide">
                Properties
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl font-black text-white mb-2">50+</div>
              <div className="text-sm text-gray-300 font-medium uppercase tracking-wide">
                Locations
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl font-black text-white mb-2">1000+</div>
              <div className="text-sm text-gray-300 font-medium uppercase tracking-wide">
                Happy Tenants
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl font-black text-white mb-2">98%</div>
              <div className="text-sm text-gray-300 font-medium uppercase tracking-wide">
                Satisfaction
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 border-2 border-white/70 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
            <div className="w-1 h-4 bg-white rounded-full mt-3 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Featured Properties - Full Width Cards */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star className="h-4 w-4" />
              Featured Properties
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Premium
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Homes
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Handpicked premium properties for discerning tenants. Each
              property is personally verified and ready for you.
            </p>
          </div>

          <div className="space-y-8">
            {loading
              ? // Loading placeholders
                Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden animate-pulse bg-white/50 backdrop-blur-sm border-0 shadow-2xl"
                  >
                    <div className="relative h-96 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              : // Render up to 3 properties or placeholders
                Array.from({ length: 3 }).map((_, index) => {
                  const property = featuredProperties[index];
                  if (property) {
                    return (
                      <Card
                        key={property.id}
                        className="group cursor-pointer hover:shadow-3xl transition-all duration-500 overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
                      >
                        <div className="relative h-96 overflow-hidden">
                          <Image
                            src={
                              property.images[0] ||
                              "https://via.placeholder.com/800x400?text=No+Image"
                            }
                            alt={property.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <Badge className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 shadow-lg">
                            <Star className="h-4 w-4 mr-1 fill-current" />
                            Featured
                          </Badge>
                          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                            <Heart className="h-6 w-6 text-red-500" />
                          </div>
                        </div>
                        <CardContent className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                              {property.title}
                            </h3>
                            <span className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text whitespace-nowrap">
                              KSh {property.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 mb-6 text-lg">
                            <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
                            <span className="truncate">
                              {property.address}, {property.city}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-gray-700">
                            <div className="flex items-center gap-6">
                              <span className="flex items-center gap-2">
                                <Home className="h-5 w-5 text-blue-500" />
                                {property.bedrooms} Beds
                              </span>
                              <span className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-500" />
                                {property.bathrooms} Baths
                              </span>
                              <span className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-purple-500" />
                                {property.area} sqft
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 font-semibold px-4 py-2"
                            >
                              Available Now
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  } else {
                    // Placeholder card for when there are fewer than 3 properties
                    return (
                      <Card
                        key={`placeholder-${index}`}
                        className="overflow-hidden bg-white/50 backdrop-blur-sm border-0 shadow-xl opacity-60 blur-[0.5px]"
                      >
                        <div className="relative h-96 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <Home className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-xl font-semibold">Coming Soon</p>
                            <p className="text-sm opacity-75">
                              New premium properties added regularly
                            </p>
                          </div>
                        </div>
                        <CardContent className="p-8">
                          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    );
                  }
                })}
          </div>

          <div className="text-center mt-16">
            <Link href="/properties">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white rounded-3xl px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0"
              >
                <Home className="mr-4 h-7 w-7" />
                Explore All Properties
                <ArrowRight className="ml-4 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Victor Springs - Award Winning Design */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern
                id="why-choose-pattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="50" cy="50" r="1" fill="white" />
                <circle cx="150" cy="150" r="1" fill="white" />
                <circle cx="250" cy="50" r="1" fill="white" />
                <circle cx="50" cy="250" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#why-choose-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Sparkles className="h-4 w-4" />
              Why Choose Us
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Experience the
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Victor Springs
              </span>
              <span className="text-white">Difference</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover what makes us Kenya's premier property rental platform.
              From cutting-edge technology to personalized service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 rotate-3 group-hover:rotate-0">
                  <Home className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-blue-300 transition-colors duration-300">
                Premium Properties
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                Carefully curated selection of high-quality rental properties
                across Kenya with verified listings and premium locations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 -rotate-3 group-hover:rotate-0">
                  <Search className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-purple-300 transition-colors duration-300">
                Smart Search
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                Advanced AI-powered filtering and search tools to find your
                perfect property in seconds, not hours.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-pink-500/25 transition-all duration-500 rotate-3 group-hover:rotate-0">
                  <Heart className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-pink-300 transition-colors duration-300">
                Expert Support
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                Dedicated property management team ensuring smooth rental
                experience with 24/7 support and personalized service.
              </p>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">
                Verified Listings
              </h4>
              <p className="text-gray-400 text-sm">
                Every property personally inspected
              </p>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">
                Fast Processing
              </h4>
              <p className="text-gray-400 text-sm">
                Applications processed in 24 hours
              </p>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">
                Premium Service
              </h4>
              <p className="text-gray-400 text-sm">
                White-glove property management
              </p>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Sparkles className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">
                Modern Platform
              </h4>
              <p className="text-gray-400 text-sm">
                Built with latest technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern
                id="cta-pattern"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="40" cy="40" r="2" fill="white" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Ready to Find Your
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                Dream Home?
              </span>
            </h2>
            <p className="text-2xl md:text-3xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Join thousands of satisfied tenants who found their perfect rental
              with Victor Springs. Start your journey today!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link href="/properties">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-3xl px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0"
              >
                <Search className="mr-4 h-7 w-7" />
                Browse Properties
                <ArrowRight className="ml-4 h-6 w-6" />
              </Button>
            </Link>
            <SignInButton>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-3xl px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              >
                <Home className="mr-4 h-7 w-7" />
                List Your Property
                <Sparkles className="ml-4 h-6 w-6" />
              </Button>
            </SignInButton>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Shield className="h-6 w-6 text-green-400" />
              <span className="text-lg font-medium">Secure & Verified</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span className="text-lg font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Heart className="h-6 w-6 text-red-400" />
              <span className="text-lg font-medium">Trusted by Thousands</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
