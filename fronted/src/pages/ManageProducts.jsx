import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/dashboad/Sidebar";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../services/axios";
import ProductModal from "../components/dashboad/ProductModal";

/**
 * ManageProducts Page
 * -------------------
 * Admin interface for managing products (Create, Read, Update, Delete).
 * Features premium Tailwind CSS styling, dark mode support, and empty states.
 */
export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/products");
      // Assuming response.data is an array of products or { products: [...] }
      setProducts(response.data?.products || response.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/api/admin/products/${id}`);
      setProducts(products.filter((p) => p._id !== id && p.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete product.");
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await axiosInstance.put(`/api/admin/products/${editingProduct._id || editingProduct.id}`, productData);
      } else {
        await axiosInstance.post("/api/admin/products", productData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Failed to save product.");
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar navigation */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Products
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add, edit, or remove products from your catalog.
              </p>
            </div>
            <Button
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 font-medium"
              onClick={openAddModal}
            >
              <FiPlus className="mr-2 h-5 w-5" /> Add Product
            </Button>
          </div>

          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader size="lg" className="text-indigo-600" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <Button onClick={fetchProducts}>Retry</Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <FiPlus className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new product.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => (
                      <tr key={product._id || product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                              {((product.images && product.images.length > 0) || product.image) ? (
                                <img
                                  className="h-10 w-10 object-cover"
                                  src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                                  alt=""
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://picsum.photos/seed/${product._id || product.id}/100/100`;
                                  }}
                                />
                              ) : (
                                <span className="text-xs text-gray-400">No img</span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          ${(product.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {product.stock ?? product.countInStock ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {product.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition-colors"
                          >
                            <FiEdit className="h-5 w-5 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id || product.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          >
                            <FiTrash2 className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}
