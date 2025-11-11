"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Eye, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Property {
  _id: string;
  title: string;
  price: number;
  location: {
    address: string;
    city: string;
    county: string;
  };
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  available: boolean;
  images: string[];
  createdAt: string;
}

export default function SavedPropertiesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchSavedProperties();
  }, [user, isLoaded, router]);

  const fetchSavedProperties = async () => {
    try {
      // This would typically fetch from your database
      // For now, we'll show a placeholder
      setSavedProperties([]);
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      toast({
        title: "Error",
        description: "Failed to load saved properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromSaved = async (propertyId: string) => {
    try {
      // This would typically remove from your database
      setSavedProperties((prev) => prev.filter((p) => p._id !== propertyId));
      toast({
        title: "Success",
        description: "Property removed from saved list",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove property",
        variant: "destructive",
      });
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Saved Properties
          </h1>
          <p className="text-gray-600">
            Properties you've saved for later. Never miss out on your dream
            home.
          </p>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No saved properties yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing properties and save your favorites to keep track of
              them here.
            </p>
            <Link href="/properties">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Browse Properties
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <Card
                key={property._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={property.images[0] || "/placeholder-property.jpg"}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
                      onClick={() => removeFromSaved(property._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.featured && (
                      <Badge className="bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    )}
                    {!property.available && (
                      <Badge
                        variant="secondary"
                        className="bg-red-500 text-white"
                      >
                        Unavailable
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location.city}, {property.location.county}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xl font-bold text-blue-600">
                      KSh {property.price.toLocaleString()}
                    </div>
                    <Badge variant="outline">{property.propertyType}</Badge>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{property.bedrooms} bed</span>
                    <span>{property.bathrooms} bath</span>
                    <span>{property.area} sqm</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/properties/${property._id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {savedProperties.length > 0 && (
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💡 Pro Tips for Saved Properties
            </h3>
            <ul className="text-gray-700 space-y-2">
              <li>
                • Properties are saved locally and will be available when you
                return
              </li>
              <li>
                • Get notified when prices change or similar properties become
                available
              </li>
              <li>
                • Share your saved list with friends or family for
                recommendations
              </li>
              <li>
                • Contact our agents directly for priority viewings of saved
                properties
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
