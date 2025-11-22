"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, MapPin, CheckCircle, X } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import CustomCheckbox from "./CustomCheckbox";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [formData, setFormData] = useState({
    type: "home" as "home" | "work" | "other",
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    isDefault: false,
  });

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        // Using restcountries.com API - free and reliable
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");
        const data = await response.json();
        
        const countriesList = data
          .map((country: any) => ({
            value: country.name.common,
            label: country.name.common,
          }))
          .sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
        
        setCountries(countriesList);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        // Fallback to common countries
        setCountries([
          { value: "United States", label: "United States" },
          { value: "United Kingdom", label: "United Kingdom" },
          { value: "Canada", label: "Canada" },
          { value: "Australia", label: "Australia" },
          { value: "Germany", label: "Germany" },
          { value: "France", label: "France" },
          { value: "Italy", label: "Italy" },
          { value: "Spain", label: "Spain" },
        ]);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...formData, id: editingAddress.id }
          : formData.isDefault ? { ...addr, isDefault: false } : addr
      ));
    } else {
      // Add new address
      const newAddress: Address = {
        ...formData,
        id: `addr_${Date.now()}`,
      };
      
      // If this is default, remove default from others
      if (formData.isDefault) {
        setAddresses(addresses.map(addr => ({ ...addr, isDefault: false })));
      }
      
      setAddresses([...addresses, newAddress]);
    }
    
    // Reset form
    setFormData({
      type: "home",
      fullName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
      isDefault: addresses.length === 0, // First address is default
    });
    setIsAddModalOpen(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      fullName: address.fullName,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  // Disable body scroll when modal is open - MUST disable immediately
  useEffect(() => {
    if (isAddModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      // Cleanup
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isAddModalOpen]);

  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Saved Addresses</h2>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingAddress(null);
            setFormData({
              type: "home",
              fullName: "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
              country: "United States",
              phone: "",
              isDefault: addresses.length === 0,
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Address
        </motion.button>
      </div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No saved addresses yet</p>
          <p className="text-sm text-gray-500">Add your first address to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors relative"
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Default
                </div>
              )}
              
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {address.type}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{address.fullName}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {address.address}
                  <br />
                  {address.city}, {address.state} {address.zipCode}
                  <br />
                  {address.country}
                  <br />
                  {address.phone}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors ml-auto"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <CustomDropdown
                  label="Address Type"
                  options={[
                    { value: "home", label: "Home" },
                    { value: "work", label: "Work" },
                    { value: "other", label: "Other" },
                  ]}
                  value={formData.type}
                  onChange={(value) => setFormData({ ...formData, type: value as "home" | "work" | "other" })}
                  placeholder="Select address type"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    {isLoadingCountries ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                        </div>
                      </div>
                    ) : (
                      <CustomDropdown
                        label="Country"
                        options={countries}
                        value={formData.country}
                        onChange={(value) => setFormData({ ...formData, country: value })}
                        placeholder="Select country"
                        required
                        searchable={true}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <CustomCheckbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                  label="Set as default address"
                />

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
                  >
                    {editingAddress ? "Update Address" : "Save Address"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

