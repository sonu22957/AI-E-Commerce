import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import axiosInstance from "../../services/axios";
import { FiUploadCloud, FiX } from "react-icons/fi";

export default function ProductModal({ isOpen, onClose, onSave, product = null }) {
  const [formData, setFormData] = useState(() => {
    if (product) {
      return {
        ...product,
        image: product.image || (product.images && product.images.length > 0 ? product.images[0] : ""),
      };
    }
    return {
      name: "",
      price: "",
      description: "",
      category: "",
      stock: "",
      image: "",
    };
  });
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append("image", file);

    setUploading(true);
    try {
      const response = await axiosInstance.post("/api/upload", fileData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // response.data contains the un-wrapped success response because of our interceptor
      // Actually, wait, if the interceptor unwraps, response.data IS the payload: { url: ... }
      // If it doesn't unwrap for some reason, we fallback to response.data.data.url
      const imageUrl = response.data?.url || response.data?.data?.url;
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div className="flex gap-4">
            <Input
              label="Price ($)"
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="flex-1"
            />
            <Input
              label="Stock"
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
              className="flex-1"
            />
          </div>
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <FiUploadCloud />
                <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
          <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={uploading}>
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
