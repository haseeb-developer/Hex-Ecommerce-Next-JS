"use client";

import { motion } from "framer-motion";
import { Package, Calendar, DollarSign } from "lucide-react";

export default function OrdersTab() {
  // Placeholder for orders - will be populated when checkout is implemented
  const orders: any[] = [];

  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Order History</h2>
        <p className="text-gray-600">View and track your orders</p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No orders yet</p>
          <p className="text-sm text-gray-500">Your order history will appear here once you make a purchase</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.total}</p>
                  <p className="text-sm text-gray-600">{order.status}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

