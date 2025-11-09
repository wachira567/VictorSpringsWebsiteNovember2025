"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, MapPin, Home, Bed, Bath, Square } from "lucide-react";

interface FilterPanelProps {
  onFiltersChange: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({
  onFiltersChange,
  isOpen,
  onClose,
}: FilterPanelProps) {
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: [0, 500000],
    bedrooms: "",
    bathrooms: "",
    areaRange: [0, 1000],
    amenities: [] as string[],
    available: true,
  });

  const propertyTypes = ["apartment", "house", "villa", "studio", "penthouse"];
  const amenitiesList = [
    "WiFi",
    "Parking",
    "Gym",
    "Pool",
    "Security",
    "Balcony",
    "Garden",
    "Elevator",
    "Air Conditioning",
    "Furnished",
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      location: "",
      propertyType: "",
      priceRange: [0, 500000],
      bedrooms: "",
      bathrooms: "",
      areaRange: [0, 1000],
      amenities: [],
      available: true,
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter city or neighborhood"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Property Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Property Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={filters.propertyType}
                onValueChange={(value) =>
                  handleFilterChange("propertyType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Price Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  handleFilterChange("priceRange", value)
                }
                max={500000}
                min={0}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </CardContent>
          </Card>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Bed className="h-4 w-4 mr-2" />
                  Bedrooms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={filters.bedrooms}
                  onValueChange={(value) =>
                    handleFilterChange("bedrooms", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Bath className="h-4 w-4 mr-2" />
                  Bathrooms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={filters.bathrooms}
                  onValueChange={(value) =>
                    handleFilterChange("bathrooms", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Area Range */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Square className="h-4 w-4 mr-2" />
                Area (m²)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider
                value={filters.areaRange}
                onValueChange={(value) =>
                  handleFilterChange("areaRange", value)
                }
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{filters.areaRange[0]} m²</span>
                <span>{filters.areaRange[1]} m²</span>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        const newAmenities = checked
                          ? [...filters.amenities, amenity]
                          : filters.amenities.filter((a) => a !== amenity);
                        handleFilterChange("amenities", newAmenities);
                      }}
                    />
                    <label
                      htmlFor={amenity}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={filters.available}
                  onCheckedChange={(checked) =>
                    handleFilterChange("available", checked)
                  }
                />
                <label
                  htmlFor="available"
                  className="text-sm font-medium leading-none"
                >
                  Show only available properties
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Active Filters */}
          {(filters.location ||
            filters.propertyType ||
            filters.amenities.length > 0) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {filters.location && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {filters.location}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("location", "")}
                      />
                    </Badge>
                  )}
                  {filters.propertyType && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 capitalize"
                    >
                      {filters.propertyType}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("propertyType", "")}
                      />
                    </Badge>
                  )}
                  {filters.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {amenity}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleFilterChange(
                            "amenities",
                            filters.amenities.filter((a) => a !== amenity)
                          )
                        }
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              Clear All
            </Button>
            <Button onClick={onClose} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
