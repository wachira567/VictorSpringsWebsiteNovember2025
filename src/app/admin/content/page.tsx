"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, Home, Phone, Mail, MapPin, Globe } from "lucide-react";

interface ContentData {
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    stats: {
      properties: number;
      clients: number;
      experience: number;
    };
  };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
    values: string[];
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    businessHours: string;
    mapUrl: string;
  };
  footer: {
    companyName: string;
    description: string;
    socialLinks: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    };
    quickLinks: string[];
  };
}

export default function AdminContentPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [content, setContent] = useState<ContentData>({
    homepage: {
      heroTitle: "Find Your Dream Home in Kenya",
      heroSubtitle:
        "Premium rental properties in Nairobi and beyond. Quality homes for discerning tenants.",
      heroImage: "/hero-image.jpg",
      stats: {
        properties: 500,
        clients: 1000,
        experience: 10,
      },
    },
    about: {
      title: "About Victor Springs",
      description:
        "Leading property rental company in Kenya specializing in premium residential and commercial properties.",
      mission:
        "To provide exceptional rental experiences through quality properties and outstanding service.",
      vision: "To be the most trusted property rental company in East Africa.",
      values: ["Quality", "Integrity", "Customer Satisfaction", "Innovation"],
    },
    contact: {
      address: "123 Main Street, Nairobi, Kenya",
      phone: "+254 700 000 000",
      email: "info@victorsprings.co.ke",
      businessHours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: Closed",
      mapUrl: "https://maps.google.com/?q=Nairobi,Kenya",
    },
    footer: {
      companyName: "Victor Springs",
      description:
        "Your trusted partner for premium property rentals in Kenya.",
      socialLinks: {
        facebook: "https://facebook.com/victorsprings",
        twitter: "https://twitter.com/victorsprings",
        instagram: "https://instagram.com/victorsprings",
        linkedin: "https://linkedin.com/company/victorsprings",
      },
      quickLinks: ["Properties", "About", "Contact", "Terms", "Privacy"],
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/login");
      return;
    }
    // Load existing content from API/database
    loadContent();
  }, [user, isLoaded, router]);

  const loadContent = async () => {
    try {
      // This would load from your database
      // For now, we'll use the default content
      console.log("Loading content...");
    } catch (error) {
      console.error("Error loading content:", error);
    }
  };

  const saveContent = async (section: keyof ContentData) => {
    setLoading(true);
    try {
      // This would save to your database
      console.log("Saving content for section:", section, content[section]);

      toast({
        title: "Success",
        description: `${
          section.charAt(0).toUpperCase() + section.slice(1)
        } content saved successfully`,
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (
    section: keyof ContentData,
    field: string,
    value: any
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateNestedContent = (
    section: keyof ContentData,
    parentField: string,
    field: string,
    value: any
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...(prev[section] as any)[parentField],
          [field]: value,
        },
      },
    }));
  };

  if (!isLoaded) {
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
          <h1>Content Management</h1>
          <p>Edit website content, pages, and footer information</p>
        </div>

        <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Footer
            </TabsTrigger>
          </TabsList>

          {/* Homepage Tab */}
          <TabsContent value="homepage">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="heroTitle">Hero Title</Label>
                      <Input
                        id="heroTitle"
                        value={content.homepage.heroTitle}
                        onChange={(e) =>
                          updateContent("homepage", "heroTitle", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                      <Textarea
                        id="heroSubtitle"
                        value={content.homepage.heroSubtitle}
                        onChange={(e) =>
                          updateContent(
                            "homepage",
                            "heroSubtitle",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroImage">Hero Image URL</Label>
                      <Input
                        id="heroImage"
                        value={content.homepage.heroImage}
                        onChange={(e) =>
                          updateContent("homepage", "heroImage", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Statistics</h3>
                    <div>
                      <Label htmlFor="properties">Total Properties</Label>
                      <Input
                        id="properties"
                        type="number"
                        value={content.homepage.stats.properties}
                        onChange={(e) =>
                          updateNestedContent(
                            "homepage",
                            "stats",
                            "properties",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="clients">Happy Clients</Label>
                      <Input
                        id="clients"
                        type="number"
                        value={content.homepage.stats.clients}
                        onChange={(e) =>
                          updateNestedContent(
                            "homepage",
                            "stats",
                            "clients",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Years Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={content.homepage.stats.experience}
                        onChange={(e) =>
                          updateNestedContent(
                            "homepage",
                            "stats",
                            "experience",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => saveContent("homepage")}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Homepage Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="aboutTitle">Page Title</Label>
                      <Input
                        id="aboutTitle"
                        value={content.about.title}
                        onChange={(e) =>
                          updateContent("about", "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="aboutDescription">Description</Label>
                      <Textarea
                        id="aboutDescription"
                        value={content.about.description}
                        onChange={(e) =>
                          updateContent("about", "description", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mission">Mission Statement</Label>
                      <Textarea
                        id="mission"
                        value={content.about.mission}
                        onChange={(e) =>
                          updateContent("about", "mission", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="vision">Vision Statement</Label>
                      <Textarea
                        id="vision"
                        value={content.about.vision}
                        onChange={(e) =>
                          updateContent("about", "vision", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Core Values (comma-separated)</Label>
                  <Input
                    value={content.about.values.join(", ")}
                    onChange={(e) =>
                      updateContent(
                        "about",
                        "values",
                        e.target.value.split(", ")
                      )
                    }
                  />
                </div>

                <Button onClick={() => saveContent("about")} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save About Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={content.contact.address}
                        onChange={(e) =>
                          updateContent("contact", "address", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={content.contact.phone}
                        onChange={(e) =>
                          updateContent("contact", "phone", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={content.contact.email}
                        onChange={(e) =>
                          updateContent("contact", "email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessHours">Business Hours</Label>
                      <Input
                        id="businessHours"
                        value={content.contact.businessHours}
                        onChange={(e) =>
                          updateContent(
                            "contact",
                            "businessHours",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="mapUrl">Map URL</Label>
                      <Input
                        id="mapUrl"
                        value={content.contact.mapUrl}
                        onChange={(e) =>
                          updateContent("contact", "mapUrl", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => saveContent("contact")}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Contact Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Footer Tab */}
          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle>Footer Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={content.footer.companyName}
                        onChange={(e) =>
                          updateContent("footer", "companyName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="footerDescription">Description</Label>
                      <Textarea
                        id="footerDescription"
                        value={content.footer.description}
                        onChange={(e) =>
                          updateContent("footer", "description", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Links</h3>
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={content.footer.socialLinks.facebook}
                        onChange={(e) =>
                          updateNestedContent(
                            "footer",
                            "socialLinks",
                            "facebook",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={content.footer.socialLinks.twitter}
                        onChange={(e) =>
                          updateNestedContent(
                            "footer",
                            "socialLinks",
                            "twitter",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={content.footer.socialLinks.instagram}
                        onChange={(e) =>
                          updateNestedContent(
                            "footer",
                            "socialLinks",
                            "instagram",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={content.footer.socialLinks.linkedin}
                        onChange={(e) =>
                          updateNestedContent(
                            "footer",
                            "socialLinks",
                            "linkedin",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Quick Links (comma-separated)</Label>
                  <Input
                    value={content.footer.quickLinks.join(", ")}
                    onChange={(e) =>
                      updateContent(
                        "footer",
                        "quickLinks",
                        e.target.value.split(", ")
                      )
                    }
                  />
                </div>

                <Button
                  onClick={() => saveContent("footer")}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Footer Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
