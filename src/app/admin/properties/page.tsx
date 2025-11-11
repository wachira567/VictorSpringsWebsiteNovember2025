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
    initializeGoogleMaps();
  }, [user, isLoaded, router]);

  const initializeGoogleMaps = async () => {
    if (typeof window !== "undefined" && (window as any).google) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    try {
      const { Loader } = await import("@googlemaps/js-api-loader");
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
        libraries: ["places"],
      });

      await loader.load();
      setMapLoaded(true);
      initializeMap();
    } catch (error) {
      console.error("Error loading Google Maps:", error);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !autocompleteRef.current || !(window as any).google)
      return;

    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: { lat: -1.2864, lng: 36.8172 }, // Nairobi
      zoom: 12,
    });

    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      autocompleteRef.current
    );
    autocomplete.bindTo("bounds", map);

    const marker = new (window as any).google.maps.Marker({
      map,
      anchorPoint: new (window as any).google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      setSelectedLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id || `custom-${Date.now()}`,
      });
    });

    map.addListener("click", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      marker.setPosition({ lat, lng });
      marker.setVisible(true);

      setSelectedLocation({
        lat,
        lng,
        placeId: `custom-${Date.now()}`,
      });
    });
  };

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

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          newImages.push(data.url);
        } else {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      setUploadedImages((prev) => [...prev, ...newImages]);
      toast({
        title: "Success",
        description: `${newImages.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLocation) {
      toast({
        title: "Error",
        description: "Please select a location on the map",
        variant: "destructive",
      });
      return;
    }

    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        location: {
          address: formData.address,
          city: formData.city,
          county: formData.county,
          googlePin: selectedLocation,
        },
        images: uploadedImages,
      };

      console.log("Sending property data:", propertyData);

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Property created successfully",
        });
        setIsCreateDialogOpen(false);
        resetForm();
        fetchProperties();
      } else {
        throw new Error(responseData.error || "Failed to create property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create property",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
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
        throw new Error("Failed to delete property");
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

  const resetForm = () => {
    setFormData({
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
      amenities: [],
      featured: false,
      available: true,
    });
    setUploadedImages([]);
    setSelectedLocation(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchTerm.toLowerCase());
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
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <button className="btn btn-primary btn-lg">
                <Plus className="mr-3 h-5 w-5" />
                Add Property
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Add New Property
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProperty} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (KSh)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    Property Images
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && handleImageUpload(e.target.files)
                      }
                      className="hidden"
                    />
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        {uploadingImages ? (
                          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImages}
                          className="mr-2"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Images
                        </Button>
                        <span className="text-sm text-gray-500">
                          or drag and drop
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      value={formData.county}
                      onChange={(e) =>
                        setFormData({ ...formData, county: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Google Maps Location Selector */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Property Location
                  </Label>
                  {mapLoaded ? (
                    <div className="space-y-4">
                      <Input
                        ref={autocompleteRef}
                        placeholder="Search for a location..."
                        className="w-full"
                      />
                      <div
                        ref={mapRef}
                        className="w-full h-64 bg-gray-100 rounded-lg"
                      />
                      {selectedLocation && (
                        <div className="text-sm text-green-600 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location selected: {selectedLocation.lat.toFixed(
                            4
                          )}, {selectedLocation.lng.toFixed(4)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-gray-500">
                        Loading Google Maps...
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="propertyType">Type</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, propertyType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bedrooms: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bathrooms: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area (sqm)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          featured: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          available: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={uploadingImages}
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Property"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
            <div key={property._id} className="property-card">
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
                  {property.location.city}, {property.location.county}
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
                    onClick={() => router.push(`/properties/${property._id}`)}
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
                    onClick={() => handleDeleteProperty(property._id)}
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
