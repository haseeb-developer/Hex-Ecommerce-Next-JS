"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, MapPin, Package, Settings, LogOut, Plus, Edit, Trash2, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import AccountTab from "@/sections/account/AccountTab";
import AddressesTab from "@/sections/account/AddressesTab";
import OrdersTab from "@/sections/account/OrdersTab";

type TabType = "account" | "addresses" | "orders";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { clearCart } = useCartStore();
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    clearCart();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0]">
        <div className="w-8 h-8 border-[3px] border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "account" as TabType, label: "Account", icon: User },
    { id: "addresses" as TabType, label: "Addresses", icon: MapPin },
    { id: "orders" as TabType, label: "Orders", icon: Package },
  ];

  return (
    <div className="h-fit bg-[#F8F5F0] pb-2 pt-6 m-[20px] rounded-2xl">
      {/* Main Container - Same spacing as header */}
      <div
        className="border border-gray-200 rounded-2xl shadow-sm"
        style={{
          backgroundColor: "#F8F5F0",
          margin: "0 20px 20px 20px",
          padding: "20px",
        }}
      >
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-gray-600">
            Manage your account settings, addresses, and orders
          </p>
        </motion.div>

        {/* Grid Layout: Vertical Tabs + Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Vertical Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-3"
          >
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-black text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-9 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {activeTab === "account" && <AccountTab user={user!} onLogout={handleLogout} />}
            {activeTab === "addresses" && <AddressesTab />}
            {activeTab === "orders" && <OrdersTab />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

