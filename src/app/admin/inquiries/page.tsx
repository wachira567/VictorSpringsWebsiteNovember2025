"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import {
  Search,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Inquiry {
  _id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: string;
  status: string;
  createdAt: string;
  isVerified: boolean;
  property?: {
    title: string;
    location: {
      city: string;
    };
  };
}

export default function AdminInquiriesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchInquiries();
  }, [user, isLoaded, router]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Inquiry marked as ${newStatus}`,
        });
        fetchInquiries();
      } else {
        throw new Error("Failed to update inquiry status");
      }
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      });
    }
  };

  const sendResponse = async () => {
    if (!selectedInquiry || !responseMessage.trim()) return;

    try {
      // In a real app, you'd send an email or SMS here
      // For now, we'll just update the status
      await updateInquiryStatus(selectedInquiry._id, "contacted");
      setIsResponseDialogOpen(false);
      setResponseMessage("");
      setSelectedInquiry(null);
      toast({
        title: "Response Sent",
        description: "Your response has been sent to the customer",
      });
    } catch (error) {
      console.error("Error sending response:", error);
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      });
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.property?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || inquiry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContactIcon = (preferredContact: string) => {
    switch (preferredContact) {
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inquiry Management
          </h1>
          <p className="text-gray-600">
            Manage customer inquiries and responses
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Inquiries
              </CardTitle>
              <div className="text-2xl">📧</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {inquiries.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending
              </CardTitle>
              <div className="text-2xl">⏳</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {inquiries.filter((i) => i.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Contacted
              </CardTitle>
              <div className="text-2xl">📞</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {inquiries.filter((i) => i.status === "contacted").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Resolved
              </CardTitle>
              <div className="text-2xl">✅</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {inquiries.filter((i) => i.status === "resolved").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 mb-8 border border-gray-200 rounded-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border border-gray-300 focus:border-blue-500 rounded"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-56 h-12 border border-gray-300 focus:border-blue-500 rounded">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <Card
              key={inquiry._id}
              className="bg-white border border-gray-200 rounded-lg"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status}
                      </Badge>
                      {inquiry.isVerified && (
                        <Badge variant="outline" className="text-green-600">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">
                      {inquiry.email} • {inquiry.phone}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      Property: {inquiry.property?.title || "Unknown"} •{" "}
                      {inquiry.property?.location.city || ""}
                    </p>
                    <p className="text-gray-700 mb-3">{inquiry.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        {getContactIcon(inquiry.preferredContact)}
                        Prefers {inquiry.preferredContact}
                      </span>
                      <span>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 border border-gray-300 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">
                            Inquiry Details
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded">
                            <Label className="font-semibold mb-2 block">
                              Customer
                            </Label>
                            <p className="font-medium">{inquiry.name}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {inquiry.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              {inquiry.phone}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded">
                            <Label className="font-semibold mb-2 block">
                              Property
                            </Label>
                            <p className="font-medium">
                              {inquiry.property?.title || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {inquiry.property?.location.city || ""}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded">
                            <Label className="font-semibold mb-2 block">
                              Message
                            </Label>
                            <p className="mt-1 leading-relaxed">
                              {inquiry.message}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded">
                            <Label className="font-semibold mb-2 block">
                              Preferred Contact
                            </Label>
                            <p className="flex items-center gap-2 mt-1">
                              {getContactIcon(inquiry.preferredContact)}
                              <span className="capitalize">
                                {inquiry.preferredContact}
                              </span>
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 border border-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setIsResponseDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Respond
                    </Button>

                    {inquiry.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 border border-gray-300 hover:bg-gray-50"
                        onClick={() =>
                          updateInquiryStatus(inquiry._id, "contacted")
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Contacted
                      </Button>
                    )}

                    {inquiry.status !== "resolved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 border border-gray-300 hover:bg-gray-50"
                        onClick={() =>
                          updateInquiryStatus(inquiry._id, "resolved")
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No inquiries found</p>
          </div>
        )}

        {/* Response Dialog */}
        <Dialog
          open={isResponseDialogOpen}
          onOpenChange={setIsResponseDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Respond to Inquiry
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <Label className="font-semibold mb-2 block">
                  Customer Details
                </Label>
                <p className="font-medium">{selectedInquiry?.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedInquiry?.email}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedInquiry?.phone}
                </p>
              </div>
              <div>
                <Label htmlFor="response" className="font-semibold mb-3 block">
                  Response Message
                </Label>
                <Textarea
                  id="response"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Type your response here..."
                  rows={6}
                  className="border border-gray-300 focus:border-blue-500 rounded resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="h-10 px-6 border border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setIsResponseDialogOpen(false);
                    setResponseMessage("");
                    setSelectedInquiry(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="h-10 px-6 bg-blue-600 hover:bg-blue-700"
                  onClick={sendResponse}
                  disabled={!responseMessage.trim()}
                >
                  Send Response
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
