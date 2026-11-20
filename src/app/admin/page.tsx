"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  ShoppingBag,
  ArrowRight,
  Eye,
  Plus,
  Settings,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    monthlyVisits: 0,
    uniqueVisitors: 0,
    monthKey: "Current Month",
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    recentOrders: [] as any[],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [visitsRes, prodsRes, catsRes, ordersRes] = await Promise.all([
          fetch("/api/analytics/visits"),
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/orders"),
        ]);

        const visitsData = await visitsRes.json();
        const prodsData = await prodsRes.json();
        const catsData = await catsRes.json();
        const ordersData = await ordersRes.json();

        setMetrics({
          monthlyVisits: visitsData.currentMonthHits || 0,
          uniqueVisitors: visitsData.currentMonthUniques || 0,
          monthKey: visitsData.currentMonthKey || "2026-11",
          totalProducts: prodsData.products?.length || 0,
          totalCategories: catsData.categories?.length || 0,
          totalOrders: ordersData.orders?.length || 0,
          recentOrders: ordersData.orders?.slice(0, 5) || [],
        });
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-ink">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Real time monthly traffic counter, commercial catalog status, and WhatsApp orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>

          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-button bg-card border border-border text-ink font-semibold text-xs hover:bg-canvas transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Studio Settings</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Monthly Site Visits (Hit Counter) */}
        <div className="p-6 rounded-card bg-card border border-border/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold">Monthly Site Visits</span>
            <div className="w-8 h-8 rounded-theme bg-primary-pale text-primary flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-3xl text-ink">
              {metrics.monthlyVisits.toLocaleString()}
            </div>
            <div className="text-[11px] text-ink-muted mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">Active</span>
              <span>
                {(() => {
                  const [year, month] = String(metrics.monthKey || "").split("-");
                  const date = new Date(Number(year), Number(month) - 1);
                  return isNaN(date.getTime())
                    ? metrics.monthKey
                    : `${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${year}`;
                })()}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-border/40 text-[11px] text-ink-muted">
            ~{metrics.uniqueVisitors.toLocaleString()} estimated unique studio visitors
          </div>
        </div>

        {/* Total Products */}
        <div className="p-6 rounded-card bg-card border border-border/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold">Catalog Products</span>
            <div className="w-8 h-8 rounded-theme bg-primary-pale text-primary flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-3xl text-ink">
              {metrics.totalProducts}
            </div>
            <div className="text-[11px] text-ink-muted mt-1">
              Active products
            </div>
          </div>
          <div className="pt-2 border-t border-border/40">
            <Link
              href="/admin/products"
              className="text-[11px] font-semibold text-primary hover:underline flex items-center justify-between"
            >
              <span>Manage Products</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Categories Count */}
        <div className="p-6 rounded-card bg-card border border-border/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold">Categories</span>
            <div className="w-8 h-8 rounded-theme bg-primary-pale text-primary flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-3xl text-ink">
              {metrics.totalCategories}
            </div>
            <div className="text-[11px] text-ink-muted mt-1">
              All Featured Categories
            </div>
          </div>
          <div className="pt-2 border-t border-border/40">
            <Link
              href="/admin/categories"
              className="text-[11px] font-semibold text-primary hover:underline flex items-center justify-between"
            >
              <span>Manage Categories</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* WhatsApp Orders */}
        <div className="p-6 rounded-card bg-card border border-border/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold">WhatsApp Orders</span>
            <div className="w-8 h-8 rounded-theme bg-primary-pale text-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-3xl text-ink">
              {metrics.totalOrders}
            </div>
            <div className="text-[11px] text-ink-muted mt-1">
              Recorded customer checkouts
            </div>
          </div>
          <div className="pt-2 border-t border-border/40">
            <Link
              href="/admin/orders"
              className="text-[11px] font-semibold text-primary hover:underline flex items-center justify-between"
            >
              <span>View Order Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Link to Customer Reviews CMS */}
      <div className="p-6 rounded-card bg-primary-pale/40 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-sm text-ink">
            Reviews
          </h3>
          <p className="text-xs text-ink-muted mt-1">
            Curate verified Google customer reviews, star ratings, and reviewer profile images displayed on the homepage.
          </p>
        </div>
        <Link
          href="/admin/reviews"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-button bg-card border border-border text-xs font-bold text-ink shrink-0 hover:bg-canvas"
        >
          <span>Manage Reviews</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-card rounded-card border border-border/80 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-ink">
            Recent WhatsApp Checkouts
          </h3>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        {metrics.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-muted">
            No WhatsApp orders recorded yet. Orders created via storefront cart checkout will automatically appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas-soft border-b border-border/60 text-ink-muted uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Amount (₦)</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-ink">
                {metrics.recentOrders.map((ord) => (
                  <tr key={ord.orderNumber} className="hover:bg-canvas-soft/50">
                    <td className="p-4 font-mono font-bold">{ord.orderNumber}</td>
                    <td className="p-4 font-medium">{ord.customerName}</td>
                    <td className="p-4">{ord.customerPhone}</td>
                    <td className="p-4">{ord.items?.length || 0} print runs</td>
                    <td className="p-4 font-bold">₦{ord.totalAmount?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-pale text-primary">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
