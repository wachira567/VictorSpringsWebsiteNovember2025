"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalProperties: number;
  totalInquiries: number;
  pendingInquiries: number;
  featuredProperties: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as any)?.role !== "admin") {
      router.push("/admin/login");
      return;
    }

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const [propertiesRes, inquiriesRes] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/inquiries"),
      ]);

      const propertiesData = await propertiesRes.json();
      const inquiriesData = await inquiriesRes.json();

      setStats({
        totalProperties: propertiesData.pagination?.total || 0,
        totalInquiries: inquiriesData.pagination?.total || 0,
        pendingInquiries:
          inquiriesData.inquiries?.filter((i: any) => i.status === "pending")
            .length || 0,
        featuredProperties:
          propertiesData.properties?.filter((p: any) => p.featured).length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session.user?.email}
            {(session.user as any)?.isSuperAdmin && (
              <Badge variant="secondary" className="ml-2">
                Super Admin
              </Badge>
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalProperties || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalInquiries || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats?.pendingInquiries || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Featured Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.featuredProperties || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() => router.push("/admin/properties")}
              >
                Manage Properties ({stats?.totalProperties || 0})
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/properties/new")}
              >
                Add New Property
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inquiry Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() => router.push("/admin/inquiries")}
              >
                Manage Inquiries ({stats?.totalInquiries || 0})
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/inquiries?status=pending")}
              >
                Pending Inquiries ({stats?.pendingInquiries || 0})
              </Button>
            </CardContent>
          </Card>

          {(session.user as any)?.isSuperAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => router.push("/admin/admins")}
                >
                  Manage Admins
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/admin/admins/new")}
                >
                  Add New Admin
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
