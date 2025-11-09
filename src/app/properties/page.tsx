"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyCard from "@/components/PropertyCard";
import FilterPanel from "@/components/FilterPanel";
import { Filter, Grid, List, Map, Search } from "lucide-react";

// Sample properties data - in real app, fetch from API
const sampleProperties = [
  {
    _id: "1",
    title: "Modern 2BR Apartment in Westlands",
    price: 85000,
    location: { address: "Westlands Road", city: "Nairobi" },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    images: [
      "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg",
    ],
    featured: true,
  },
  {
    _id: "2",
    title: "Luxury Villa in Karen",
    price: 250000,
    location: { address: "Karen Road", city: "Nairobi" },
    propertyType: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    images: [
      "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687079/pexels-fotoaibe-1743227_ml4efp.jpg",
    ],
    featured: true,
  },
  {
    _id: "3",
    title: "Cozy Studio in Kilimani",
    price: 35000,
    location: { address: "Kilimani Road", city: "Nairobi" },
    propertyType: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    images: [
      "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687017/pexels-expect-best-79873-323705_jel5c4.jpg",
    ],
    featured: false,
  },
  {
    _id: "4",
    title: "Spacious 3BR House in Kileleshwa",
    price: 120000,
    location: { address: "Kileleshwa Road", city: "Nairobi" },
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    images: [
      "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg",
    ],
    featured: false,
  },
  {
    _id: "5",
    title: "Penthouse with City Views",
    price: 300000,
    location: { address: "Parklands Avenue", city: "Nairobi" },
    propertyType: "penthouse",
    bedrooms: 3,
    bathrooms: 3,
    area: 280,
    images: [
      "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687079/pexels-fotoaibe-1743227_ml4efp.jpg",
    ],
    featured: true,
  },
  {
    _id: "6",
    title: "Affordable 1BR in Eastlands",
    price: 25000,
    location: { address: "Eastlands Road", city: "Nairobi" },
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 60,
    images: [
      "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687017/pexels-expect-best-79873-323705_jel5c4.jpg",
    ],
    featured: false,
  },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState(sampleProperties);
  const [filteredProperties, setFilteredProperties] =
    useState(sampleProperties);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Filter and search logic
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          property.location.address
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // In real app, sort by createdAt
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, sortBy]);

  const handleFiltersChange = (filters: any) => {
    let filtered = [...properties];

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(
        (property) =>
          property.location.city
            .toLowerCase()
            .includes(filters.location.toLowerCase()) ||
          property.location.address
            .toLowerCase()
            .includes(filters.location.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(
        (property) => property.propertyType === filters.propertyType
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(
        (property) =>
          property.price >= filters.priceRange[0] &&
          property.price <= filters.priceRange[1]
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(
        (property) => property.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(
        (property) => property.bathrooms >= parseInt(filters.bathrooms)
      );
    }

    if (filters.areaRange) {
      filtered = filtered.filter(
        (property) =>
          property.area >= filters.areaRange[0] &&
          property.area <= filters.areaRange[1]
      );
    }

    if (filters.available !== undefined) {
      // In real app, check availability status
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Map Toggle */}
              <Button
                variant={showMap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMap(!showMap)}
              >
                <Map className="h-4 w-4 mr-2" />
                Map
              </Button>

              {/* Filter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Properties for Rent
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredProperties.length} properties found
            </p>
          </div>
        </div>

        {/* Properties Grid/List */}
        {showMap ? (
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Map view coming soon
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProperties.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Properties
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}
