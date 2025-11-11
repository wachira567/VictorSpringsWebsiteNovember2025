"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  MapPin,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Property {
  id: number;
  _id?: string;
  title: string;
  price: number;
  address: string;
  city: string;
  county: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  available: boolean;
  images: string[];
  createdAt: string;
}

export default function AdminPropertiesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    county: "",
    propertyType: "apartment",
    bedrooms: "",
    bathrooms: "",
    area: "",
    amenities: [] as string[],
    featured: false,
    available: true,
  });

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Google Maps state
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    placeId: string;
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchProperties();
  }, [user, isLoaded, router]);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string | number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Property deleted successfully",
        });
        fetchProperties();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || property.propertyType === filterType;
    return matchesSearch && matchesType;
  });

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
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Property Management</h1>
          <p>Manage your property listings with style and precision</p>
        </div>
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => router.push("/admin/properties/add")}
            className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Property
          </Button>
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="filters-grid">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input pl-12"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <div key={property.id || property._id} className="property-card">
              <div className="property-image">
                {property.images[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="property-badges">
                  {property.featured && (
                    <div className="property-badge featured">Featured</div>
                  )}
                  {!property.available && (
                    <div className="property-badge unavailable">
                      Unavailable
                    </div>
                  )}
                </div>
              </div>
              <div className="property-content">
                <div className="property-title">{property.title}</div>
                <div className="property-location">
                  <MapPin className="h-4 w-4" />
                  {property.city}, {property.county}
                </div>
                <div className="property-details">
                  <div className="property-price">
                    KSh {property.price.toLocaleString()}
                  </div>
                  <div className="property-type">{property.propertyType}</div>
                </div>
                <div className="property-specs">
                  <span>{property.bedrooms} bed</span>
                  <span>•</span>
                  <span>{property.bathrooms} bath</span>
                  <span>•</span>
                  <span>{property.area} sqm</span>
                </div>
                <div className="property-actions">
                  <button
                    className="property-action-button primary"
                    onClick={() =>
                      router.push(
                        `/properties/${property.id || property._id || ""}`
                      )
                    }
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="property-action-button secondary">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    className="property-action-button danger"
                    onClick={() =>
                      handleDeleteProperty(property.id || property._id || "")
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties found</p>
          </div>
        )}
      </div>
    </div>
  );
}
