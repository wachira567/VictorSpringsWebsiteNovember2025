import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Wifi,
  Car,
  Shield,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
} from "lucide-react";

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProperty(id: string) {
  try {
    const res = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/api/properties/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

async function getSimilarProperties(propertyId: string, propertyType: string) {
  try {
    const res = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/api/properties?propertyType=${propertyType}&limit=3&exclude=${propertyId}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.properties || [];
  } catch (error) {
    console.error("Error fetching similar properties:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: `${property.title} - Kenya Property Rentals`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images?.[0] ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const similarProperties = await getSimilarProperties(
    property._id,
    property.propertyType
  );

  // Mock property data for demo purposes when database is not available
  const mockProperty = {
    _id: "1",
    title: "Modern 2BR Apartment",
    description:
      "Beautiful modern apartment in the heart of Nairobi with stunning city views. Fully furnished with all amenities included.",
    price: 45000,
    location: {
      address: "Kilimani Road",
      city: "Nairobi",
      county: "Nairobi",
    },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ["WiFi", "Parking", "Security", "Gym"],
    images: [
      "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg",
      "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687079/pexels-fotoaibe-1743227_ml4efp.jpg",
    ],
    featured: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Use mock data if property fetch failed
  const displayProperty = property || mockProperty;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    Parking: Car,
    Security: Shield,
    Gym: () => <span className="text-lg">🏋️</span>,
    "Swimming Pool": () => <span className="text-lg">🏊</span>,
    Garden: () => <span className="text-lg">🌳</span>,
    "Maid Service": () => <span className="text-lg">🧹</span>,
    "Backup Generator": () => <span className="text-lg">⚡</span>,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gray-900">
        <Image
          src={displayProperty.images?.[0] || "/placeholder-property.jpg"}
          alt={displayProperty.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                {displayProperty.propertyType}
              </Badge>
              {displayProperty.featured && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                >
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {displayProperty.title}
            </h1>
            <div className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              <span>
                {displayProperty.location.address},{" "}
                {displayProperty.location.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price and Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatPrice(displayProperty.price)}
                  </div>
                  <div className="text-gray-600">per month</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="flex gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  <span>
                    {displayProperty.bedrooms} bed
                    {displayProperty.bedrooms !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5" />
                  <span>
                    {displayProperty.bathrooms} bath
                    {displayProperty.bathrooms !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5" />
                  <span>{displayProperty.area} m²</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {displayProperty.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {displayProperty.amenities &&
              displayProperty.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {displayProperty.amenities.map((amenity: string) => {
                        const IconComponent =
                          amenityIcons[amenity] || CheckCircle;
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-3"
                          >
                            <IconComponent className="h-5 w-5 text-green-600" />
                            <span className="text-gray-700">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{displayProperty.location.address}</span>
                  </div>
                  <div className="text-gray-600">
                    {displayProperty.location.city},{" "}
                    {displayProperty.location.county}
                  </div>
                </div>
                {/* Placeholder for Google Maps */}
                <div className="mt-4 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive map coming soon</p>
                    <p className="text-sm">Google Maps integration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact/Inquiry Form */}
            <Card>
              <CardHeader>
                <CardTitle>Interested in this property?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Send Inquiry
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Viewing
                </Button>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="capitalize">
                    {displayProperty.propertyType}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms</span>
                  <span>{displayProperty.bedrooms}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms</span>
                  <span>{displayProperty.bathrooms}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Area</span>
                  <span>{displayProperty.area} m²</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Available</span>
                  <Badge
                    variant={
                      displayProperty.available ? "default" : "secondary"
                    }
                  >
                    {displayProperty.available ? "Available" : "Occupied"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((similarProperty: any) => (
                <PropertyCard
                  key={similarProperty._id}
                  property={similarProperty}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mock Similar Properties for Demo */}
        {similarProperties.length === 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <PropertyCard
                  key={i}
                  property={
                    {
                      _id: i.toString(),
                      title: `Similar Property ${i}`,
                      price: 35000 + i * 5000,
                      location: {
                        address: `Location ${i}`,
                        city: "Nairobi",
                        county: "Nairobi",
                      } as any,
                      propertyType: "apartment",
                      bedrooms: 2,
                      bathrooms: 2,
                      area: 1000 + i * 100,
                      images: [
                        "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg",
                      ],
                      featured: false,
                    } as any
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
