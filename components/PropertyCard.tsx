"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    price: number;
    location: {
      address: string;
      city: string;
    };
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    featured: boolean;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
        <div className="relative">
          {/* Property Image */}
          <div className="relative h-48 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
            <Image
              src={property.images[0] || "/placeholder-property.jpg"}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              style={{ height: "100%", width: "100%" }}
            />

            {/* Featured Badge */}
            {property.featured && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </div>
            )}

            {/* Save Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isSaved ? "fill-current text-red-500" : ""
                }`}
              />
            </Button>
          </div>

          {/* Property Details */}
          <CardContent className="p-4">
            <div className="space-y-2">
              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(property.price)}
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {property.propertyType}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-blue-600 transition-colors">
                <Link href={`/properties/${property._id}`}>
                  {property.title}
                </Link>
              </h3>

              {/* Location */}
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {property.location.address}, {property.location.city}
                </span>
              </div>

              {/* Property Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{property.area}m²</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
