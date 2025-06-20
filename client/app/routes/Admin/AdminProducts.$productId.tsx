import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
// import { useParams, useNavigate } from "@remix-run/react"; //
//  ✅ Додано useNavigate
import { useParams, useNavigate } from "react-router";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_path?: string;
}

const API = "http://localhost:8000";

function AdminProductUpdate() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("ProductId from URL:", productId); // Для діагностики

    if (!productId) {
      setError("Product ID is missing from URL");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching product with ID:", productId);
        const response = await axios.get(`${API}/products/${productId}`);
        const productData = response.data;

        setProduct(productData);
        setProductName(productData.name || "");
        setDescription(productData.description || "");
        setPrice(productData.price?.toString() || "");
        setStock(productData.stock?.toString() || "");
        setSelectedCategoryId(productData.category_id?.toString() || "");

        console.log("Product loaded:", productData);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message || "Помилка завантаження продукту"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>(`${API}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productId) {
      setError("Product ID is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category_id", selectedCategoryId);
    formData.append("_method", "PUT"); // ✅ Додаємо hidden field

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      console.log("Updating product with ID:", productId);

      const response = await axios.post(
        `${API}/admin/products/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("Product updated successfully!");
      navigate("/admin/products");
    } catch (err: any) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.error || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Завантаження продукту...</p>
        </div>
      </div>
    );
  }


  if (error && !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => navigate("/admin/products")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Повернутися до списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">
          {product ? `Редагувати товар: ${product.name}` : "Завантаження..."}
        </h1>
        <button
          onClick={() => navigate("/admin/products")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Назад до списку
        </button>
      </div>

      {product?.image_path && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Поточне зображення:
          </h3>
          <img
            src={`${API}${product.image_path}`}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}


      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-20">
          <div className="flex-1">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            

            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price:
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock:
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category:
              </label>
              <select
                id="category_id"
                name="category_id"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4 p-4 border border-dashed border-gray-300 rounded-md bg-gray-50 h-full flex flex-col justify-center">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Image:{" "}
                {imageFile
                  ? "(New image selected)"
                  : "(Keep current or upload new)"}
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  } else {
                    setImageFile(null);
                  }
                }}
                className="block w-full text-sm text-gray-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-indigo-50 file:text-indigo-700
                                      hover:file:bg-indigo-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, GIF up to 2MB (optional - leave empty to keep current
                image)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Оновлення..." : "Оновити товар"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductUpdate;
