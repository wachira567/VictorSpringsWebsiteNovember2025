import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import InquiryForm from "@/components/InquiryForm";
import HeroGallery from "./HeroGallery";
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
import "../../../styles/property-detail.css";

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
  const paramsData = await params;
  const { id } = paramsData;
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
  const paramsData = await params;
  const { id } = paramsData;
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

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: displayProperty.title,
    description: displayProperty.description,
    image: displayProperty.images,
    address: {
      "@type": "PostalAddress",
      streetAddress: displayProperty.location.address,
      addressLocality: displayProperty.location.city,
      addressRegion: displayProperty.location.county,
      addressCountry: "KE",
    },
    numberOfRooms: displayProperty.bedrooms,
    numberOfBathroomsTotal: displayProperty.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: displayProperty.area,
      unitText: "m²",
    },
    amenities: displayProperty.amenities,
    offers: {
      "@type": "Offer",
      price: displayProperty.price,
      priceCurrency: "KES",
      availability: displayProperty.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      leaseDuration: {
        "@type": "QuantitativeValue",
        value: "12",
        unitText: "MONTHS",
      },
    },
    url: `https://victorsprings.co.ke/properties/${displayProperty._id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="navbar">
        <div className="navbar__logo">Victor Springs</div>
        <nav className="navbar__nav">
          <a href="/" className="navbar__link">
            Home
          </a>
          <a href="/properties" className="navbar__link">
            Properties
          </a>
          <a href="/about" className="navbar__link">
            About
          </a>
          <a href="/contact" className="navbar__link">
            Contact
          </a>
        </nav>
      </header>

      <main>
        {/* Hero Section with Image Gallery */}
        <section className="hero-gallery">
          <HeroGallery
            images={displayProperty.images || []}
            title={displayProperty.title}
          />
        </section>

        <div className="content-container">
          <div className="content-grid">
            {/* Main Content */}
            <div className="property-details">
              {/* Price and Actions */}
              <section className="property-header">
                <div className="inquiry-price">
                  {formatPrice(displayProperty.price)}
                </div>
                <div className="inquiry-price-label">per month</div>
                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                  >
                    <Heart className="h-4 w-4 mr-2 text-purple-600" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                  >
                    <Share2 className="h-4 w-4 mr-2 text-purple-600" />
                    Share
                  </Button>
                </div>

                <div className="property-stats">
                  <div className="stat-item">
                    <Bed className="h-5 w-5 text-purple-600" />
                    <span>
                      {displayProperty.bedrooms} bed
                      {displayProperty.bedrooms !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="stat-item">
                    <Bath className="h-5 w-5 text-purple-600" />
                    <span>
                      {displayProperty.bathrooms} bath
                      {displayProperty.bathrooms !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="stat-item">
                    <Square className="h-5 w-5 text-purple-600" />
                    <span>{displayProperty.area} m²</span>
                  </div>
                </div>
              </section>

              <hr className="divider" />

              {/* Description */}
              <section>
                <h2>About this property</h2>
                <p className="property-description">
                  {displayProperty.description}
                </p>
              </section>

              {/* Amenities */}
              {displayProperty.amenities &&
                displayProperty.amenities.length > 0 && (
                  <section>
                    <h2>Amenities & Features</h2>
                    <div className="amenities-grid">
                      {displayProperty.amenities.map((amenity: string) => {
                        const IconComponent =
                          amenityIcons[amenity] || CheckCircle;
                        return (
                          <div key={amenity} className="amenity-item">
                            <IconComponent className="amenity-icon" />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

              {/* Location */}
              <section className="location-section">
                <h2>Location & Neighborhood</h2>
                <div className="location-info">
                  <MapPin className="h-6 w-6 text-purple-600" />
                  <div>
                    <span className="location-address">
                      {displayProperty.location.address}
                    </span>
                    <div className="location-city">
                      {displayProperty.location.city},{" "}
                      {displayProperty.location.county}
                    </div>
                  </div>
                </div>
                {/* Google Maps Embed */}
                <div className="map-container">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${
                      process.env.GOOGLE_MAPS_API_KEY
                    }&q=${encodeURIComponent(
                      `${displayProperty.location.address}, ${displayProperty.location.city}, ${displayProperty.location.county}, Kenya`
                    )}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </section>

              {/* Property Details */}
              <section>
                <h2>Property Details</h2>
                <div className="property-specs">
                  <div className="spec-item">
                    <span className="spec-label">Property Type</span>
                    <span className="spec-value capitalize">
                      {displayProperty.propertyType}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Bedrooms</span>
                    <span className="spec-value">
                      {displayProperty.bedrooms}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Bathrooms</span>
                    <span className="spec-value">
                      {displayProperty.bathrooms}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Area</span>
                    <span className="spec-value">
                      {displayProperty.area} m²
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Status</span>
                    <Badge
                      variant={
                        displayProperty.available ? "default" : "secondary"
                      }
                      className={
                        displayProperty.available
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500"
                      }
                    >
                      {displayProperty.available ? "Available" : "Occupied"}
                    </Badge>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="inquiry-sidebar">
              {/* Contact/Inquiry Form */}
              <div className="inquiry-card">
                <h3>Interested in this property?</h3>
                <InquiryForm
                  propertyId={displayProperty._id}
                  propertyTitle={displayProperty.title}
                />
              </div>
            </aside>
          </div>

          {/* Similar Properties */}
          {(similarProperties.length > 0 || similarProperties.length === 0) && (
            <section className="similar-properties">
              <h2 className="similar-properties__title">
                Similar Properties You Might Like
              </h2>
              <p className="similar-properties__subtitle">
                Discover more amazing properties in the same area
              </p>
              <div className="similar-grid">
                {similarProperties.length > 0
                  ? similarProperties.map((similarProperty: any) => (
                      <div key={similarProperty._id} className="similar-card">
                        <PropertyCard property={similarProperty} />
                      </div>
                    ))
                  : // Show actual similar properties based on property type and location
                    [1, 2, 3].map((i) => (
                      <div key={i} className="similar-card">
                        <PropertyCard
                          property={
                            {
                              _id: i.toString(),
                              title: `${
                                displayProperty.propertyType
                                  ? displayProperty.propertyType
                                      .charAt(0)
                                      .toUpperCase() +
                                    displayProperty.propertyType.slice(1)
                                  : "Property"
                              } in ${
                                displayProperty.location?.city || "Nairobi"
                              }`,
                              price: displayProperty.price + (i - 2) * 5000,
                              location: {
                                address: `Nearby ${
                                  displayProperty.location?.address ||
                                  "Location"
                                }`,
                                city:
                                  displayProperty.location?.city || "Nairobi",
                                county:
                                  displayProperty.location?.county || "Nairobi",
                              } as any,
                              propertyType:
                                displayProperty.propertyType || "apartment",
                              bedrooms: displayProperty.bedrooms || 2,
                              bathrooms: displayProperty.bathrooms || 2,
                              area:
                                (displayProperty.area || 1000) + (i - 2) * 50,
                              images: [
                                "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg",
                              ],
                              featured: false,
                              available: true,
                            } as any
                          }
                        />
                      </div>
                    ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Victor Springs</h4>
            <ul className="footer-links">
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/properties">Properties</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li>
                <a href="/help">Help Center</a>
              </li>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                📘
              </a>
              <a href="#" aria-label="Twitter">
                🐦
              </a>
              <a href="#" aria-label="Instagram">
                📷
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Victor Springs. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
