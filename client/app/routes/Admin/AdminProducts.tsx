import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "~/components/DataTable";
import { Button } from "~/components/ui/button";
import { Edit, Trash2, Eye, Plus } from "lucide-react"; // Додано іконки
import { Link, useNavigate } from "react-router";

interface Product {
  id: number;
  name: string;
  description: string | null; // ✅ ВИПРАВЛЕНО: Може бути null
  price: number;
  image_path: string;
  stock: number;
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // ✅ Додано loading state
  const [error, setError] = useState<string | null>(null); // ✅ Додано error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:8000/admin/products`
        );
        console.log(response);

        setProducts(response.data.data || []); // ✅ Додано fallback
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.response?.data?.error || "Помилка завантаження товарів");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const navigate = useNavigate();
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "image_path", // ✅ Виправлено назву поля
      header: "Зображення",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="w-16 h-16 overflow-hidden rounded-lg border">
            <img
              src={`http://localhost:8000${product.image_path}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Назва",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="max-w-xs">
            <div className="font-medium text-gray-900">{product.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Опис",
      cell: ({ row }) => {
        const product = row.original;
        const description = product.description?.trim() || "Без опису";

        return (
          <div className="max-w-xs">
            <div className="text-sm text-gray-600 truncate" title={description}>
              {description.length > 50
                ? `${description.substring(0, 50)}...`
                : description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Ціна",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="font-medium text-green-600">${product.price}</div>
        );
      },
    },
    {
      accessorKey: "stock",
      header: "Залишок",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              product.stock > 10
                ? "bg-green-100 text-green-800"
                : product.stock > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Дії",
      cell: ({ row }) => {
        const product = row.original;

        const handleView = () => {
          navigate(`/products/${product.id}`);
        };

        const handleEdit = () => {
          console.log("Edit product:", product.id);
          navigate(`/admin/products/${product.id}`);
        };

        const handleDelete = async () => {
          if (
            confirm(`Ви впевнені, що хочете видалити товар "${product.name}"?`)
          ) {
            try {
              await axios.delete(
          `http://localhost:8000/admin/products/${product.id}`
              );
              setProducts(products.filter(p => p.id !== product.id));
            } catch (error) {
              console.error("Error deleting product:", error);
              alert("Помилка при видаленні товару");
            }
          }
        };

        return (
          <div className="flex space-x-2">
            <Button
              onClick={handleView}
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-800 hover:border-blue-300"
              title="Переглянути товар"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="text-green-600 hover:text-green-800 hover:border-green-300"
              title="Редагувати товар"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-800 hover:border-red-300"
              title="Видалити товар"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            
          </div>
        );
      },
    },
  ];

  const handleAddProduct = () => {
    console.log("Add new product");
    navigate("/admin/products/store");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Завантаження товарів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Спробувати знову
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">
          Управління товарами
        </h1>

        <Link
            className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          to={"./store"}
        >
          <Plus className="w-4 h-4 mr-2" />
          Додати товар
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <DataTable
          columns={columns}
          data={products}
          input={false}
          disablePagination={true}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-blue-600">
            {products.length}
          </div>
          <div className="text-sm text-gray-600">Всього товарів</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.stock > 0).length}
          </div>
          <div className="text-sm text-gray-600">В наявності</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-red-600">
            {products.filter((p) => p.stock === 0).length}
          </div>
          <div className="text-sm text-gray-600">Закінчились</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-600">
            {products.filter((p) => p.stock > 0 && p.stock <= 10).length}
          </div>
          <div className="text-sm text-gray-600">Мало залишилось</div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
