"use client";

import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { AdminOrderDetail } from "./AdminOrderDetail";

const STATUS_FILTERS = [
  "all",
  "new_order",
  "awaiting_payment",
  "awaiting_info",
  "awaiting_photos",
  "awaiting_agreement",
  "needs_review",
  "ready_for_mls",
  "submitted_to_mls",
  "live",
  "correction_needed",
  "closed_archived"
];

export function AdminOrderTable({ orders }: { orders: any[] }) {
  const [filter, setFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.order_status === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-3 py-1 text-xs font-display font-bold uppercase tracking-wide ${
              filter === status ? "bg-navy text-white" : "bg-gray text-ink/60"
            }`}
          >
            {status.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray font-display text-xs font-bold uppercase tracking-wide text-navy">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray">
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">
                  {order.properties
                    ? `${order.properties.property_address}, ${order.properties.city} ${order.properties.state}`
                    : <span className="text-ink/40">Paid, details not submitted yet</span>}
                </td>
                <td className="px-4 py-3">
                  {order.sellers ? `${order.sellers.first_name} ${order.sellers.last_name}` : <span className="text-ink/40">—</span>}
                </td>
                <td className="px-4 py-3">{order.packages?.name}</td>
                <td className="px-4 py-3"><StatusBadge status={order.order_status} /></td>
                <td className="px-4 py-3">${order.total_amount}</td>
                <td className="px-4 py-3">
                  <button className="text-blue underline" onClick={() => setSelectedOrderId(order.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink/50">
                  No orders match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrderId && (
        <AdminOrderDetail orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      )}
    </div>
  );
}
