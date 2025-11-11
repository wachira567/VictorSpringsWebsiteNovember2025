"use client";

import { useUser } from "@clerk/nextjs";
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
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchStats();
  }, [user, isLoaded, router]);

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
          <h1>Admin Dashboard</h1>
          <p>
            Welcome back,{" "}
            {user.firstName || user.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-title">Total Properties</div>
                <div className="admin-stat-value">
                  {stats?.totalProperties || 0}
                </div>
              </div>
              <div className="text-2xl">🏠</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-title">Total Inquiries</div>
                <div className="admin-stat-value">
                  {stats?.totalInquiries || 0}
                </div>
              </div>
              <div className="text-2xl">💬</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-title">Pending Inquiries</div>
                <div className="admin-stat-value">
                  {stats?.pendingInquiries || 0}
                </div>
              </div>
              <div className="text-2xl">⏳</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-title">Featured Properties</div>
                <div className="admin-stat-value">
                  {stats?.featuredProperties || 0}
                </div>
              </div>
              <div className="text-2xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-actions-grid">
          <div className="admin-action-card">
            <div className="admin-action-title">Property Management</div>
            <div className="admin-action-buttons">
              <button
                className="admin-button"
                onClick={() => router.push("/admin/properties")}
              >
                Manage Properties ({stats?.totalProperties || 0})
              </button>
              <button
                className="admin-button secondary"
                onClick={() => router.push("/admin/properties")}
              >
                Add New Property
              </button>
            </div>
          </div>

          <div className="admin-action-card">
            <div className="admin-action-title">Inquiry Management</div>
            <div className="admin-action-buttons">
              <button
                className="admin-button"
                onClick={() => router.push("/admin/inquiries")}
              >
                Manage Inquiries ({stats?.totalInquiries || 0})
              </button>
              <button
                className="admin-button secondary"
                onClick={() => router.push("/admin/inquiries?status=pending")}
              >
                Pending Inquiries ({stats?.pendingInquiries || 0})
              </button>
            </div>
          </div>

          {user && (
            <div className="admin-action-card">
              <div className="admin-action-title">Admin Management</div>
              <div className="admin-action-buttons">
                <button
                  className="admin-button"
                  onClick={() => router.push("/admin/admins")}
                >
                  Manage Admins
                </button>
                <button
                  className="admin-button secondary"
                  onClick={() => router.push("/admin/admins/new")}
                >
                  Add New Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
