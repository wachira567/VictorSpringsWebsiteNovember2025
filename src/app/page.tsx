"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, Star, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dtbe44muv/image/upload/v1762687017/pexels-expect-best-79873-323705_jel5c4.jpg"
            alt="Beautiful property landscape"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover"
            priority
            style={{ height: "100%", width: "100%" }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Find Your Dream Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Discover premium rental properties across Kenya with Victor Springs
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-2 flex items-center">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-gray-300 mr-3" />
                <input
                  type="text"
                  placeholder="Search by location, property type..."
                  className="bg-transparent text-white placeholder-gray-300 outline-none flex-1"
                />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 rounded-full px-8"
                onClick={() => router.push("/properties")}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-gray-300">Properties</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-gray-300">Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-sm text-gray-300">Happy Tenants</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Handpicked premium properties for discerning tenants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Property Card 1 */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg"
                  alt="Modern Apartment"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-blue-600">
                  Featured
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">
                    Modern 2BR Apartment
                  </h3>
                  <span className="text-2xl font-bold text-blue-600">
                    KSh 45,000
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Kilimani, Nairobi</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>2 Beds • 2 Baths • 1200 sqft</span>
                  <span className="text-green-600 font-medium">
                    Available Now
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Property Card 2 */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dtbe44muv/image/upload/v1762687079/pexels-fotoaibe-1743227_ml4efp.jpg"
                  alt="Luxury Villa"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-green-600">
                  Premium
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">Luxury 4BR Villa</h3>
                  <span className="text-2xl font-bold text-blue-600">
                    KSh 120,000
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Karen, Nairobi</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>4 Beds • 3 Baths • 2500 sqft</span>
                  <span className="text-green-600 font-medium">
                    Available Now
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Property Card 3 */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dtbe44muv/image/upload/v1762687017/pexels-expect-best-79873-323705_jel5c4.jpg"
                  alt="Cozy Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-purple-600">
                  Popular
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">
                    Cozy Studio Apartment
                  </h3>
                  <span className="text-2xl font-bold text-blue-600">
                    KSh 25,000
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Westlands, Nairobi</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>1 Bed • 1 Bath • 600 sqft</span>
                  <span className="text-green-600 font-medium">
                    Available Now
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/properties">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Victor Springs?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience the difference with our premium property management
              services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Properties</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Carefully curated selection of high-quality rental properties
                across Kenya
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced filtering and search tools to find your perfect
                property quickly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dedicated property management team ensuring smooth rental
                experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied tenants who found their perfect rental
            with Victor Springs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Browse Properties
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => signIn()}
            >
              List Your Property
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
