"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Send } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 8;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl text-ink">
          WhatsApp Orders Ledger ({orders.length})
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Review commercial print orders dispatched to WhatsApp with itemized specifications.
        </p>
      </div>

      <div className="bg-card rounded-card border border-border/80 shadow-soft overflow-hidden p-4 sm:p-6 space-y-4">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-ink-muted space-y-2">
            <ShoppingBag className="w-8 h-8 opacity-40 mx-auto" />
            <p className="font-semibold text-ink">
              No customer orders recorded yet.
            </p>
            <p>
              Customer checkouts from the slide-over cart will automatically be saved here.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-canvas-soft border-b border-border/60 text-ink-muted uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Delivery State/Address</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total (₦)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Quick WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-ink">
                  {paginatedOrders.map((ord) => (
                    <tr
                      key={ord.orderNumber}
                      className="hover:bg-canvas-soft/50"
                    >
                      <td className="p-4 font-mono font-bold">
                        {ord.orderNumber}
                      </td>
                      <td className="p-4 font-semibold">{ord.customerName}</td>
                      <td className="p-4">{ord.customerPhone}</td>
                      <td className="p-4 text-ink-muted truncate max-w-xs">
                        {ord.deliveryAddress || "Lagos Pickup"}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="text-primary font-bold hover:underline cursor-pointer"
                        >
                          {ord.items?.length || 0} item(s) →
                        </button>
                      </td>
                      <td className="p-4 font-bold text-ink">
                        ₦{ord.totalAmount?.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-pale text-primary">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(ord.customerName)}%2C%20this%20is%20Iceberg%20Studio%20regarding%20your%20order%20${ord.orderNumber}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25D366] text-white text-[11px] font-bold hover:opacity-90 transition-opacity"
                        >
                          <Send className="w-3 h-3" />
                          <span>Chat</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={orders.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <div className="bg-card rounded-card border border-border max-w-md w-full p-6 space-y-4 shadow-elevation">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-ink">
                  Order Breakdown: {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-ink-muted">
                  Client: {selectedOrder.customerName} (
                  {selectedOrder.customerPhone})
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedOrder.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-theme bg-canvas-soft border border-border/60 text-xs space-y-1"
                >
                  <div className="flex items-baseline justify-between font-bold text-ink">
                    <span>{item.title}</span>
                    <span>₦{item.totalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    Qty: {item.quantity?.toLocaleString()} pcs · Stock:{" "}
                    {item.paperStock || "Standard"}
                  </div>
                  {item.finish && (
                    <div className="text-[11px] text-primary font-medium">
                      Finish: {item.finish}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold">
              <span>Total Estimated:</span>
              <span className="text-base font-black text-ink">
                ₦{selectedOrder.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
