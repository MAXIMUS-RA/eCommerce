import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import { selectAuth } from "~/redux/slices/authSlice";
import SkeletonCard from "~/components/SkeletonCard";
import { Skeleton } from "~/components/ui/skeleton";
import { Combobox } from "~/components/Combobox";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_path: string;
  stock: number;
}
interface Category {
  id: number;
  name: string;
}

interface PaginatedProductsResponse {
  data: Product[];
  total_items: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}
const API_SERVER_URL = "http://localhost:8000";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Не вдалося завантажити категорії. Спробуйте пізніше.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<PaginatedProductsResponse>(
          `http://localhost:8000/products?page=${currentPage}&per_page=${itemsPerPage}&category_id=${
            selectedCategory || null
          }`
        );
        setProducts(response.data.data);
        setTotalPages(response.data.total_pages);
        setCurrentPage(response.data.current_page);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Не вдалося завантажити товари. Спробуйте пізніше.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [currentPage, itemsPerPage, selectedCategory]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 mx-1 border rounded ${
            1 === currentPage
              ? "bg-indigo-600 text-white"
              : "bg-white text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="px-3 py-1 mx-1">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={loading && i === currentPage}
          className={`px-3 py-1 mx-1 border rounded ${
            i === currentPage
              ? "bg-indigo-600 text-white cursor-default"
              : "bg-white text-indigo-600 hover:bg-indigo-50"
          } ${loading && i === currentPage ? "opacity-50" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="px-3 py-1 mx-1">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 mx-1 border rounded ${
            totalPages === currentPage
              ? "bg-indigo-600 text-white"
              : "bg-white text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          {totalPages}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading && products.length === 0) {
    return (
      <div className="py-8 px-4">
        <div className="w-full flex justify-center p-2">
          <Skeleton className="h-8 w-1/3 mb-3 rounded bg-gray-200"></Skeleton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
        <div className="flex justify-center items-center mt-8">
          <div className="px-4 py-2 mx-1 border rounded-2xl bg-gray-200 animate-pulse h-10 w-24"></div>
          {Array.from({ length: Math.min(totalPages, 5) || 3 }).map(
            (_, index) => (
              <Skeleton
                key={index}
                className="px-3 py-1 mx-1 rounded bg-gray-200 animate-pulse h-8 w-8"
              ></Skeleton>
            )
          )}
          <Skeleton className="px-4 py-2 mx-1 border rounded-2xl bg-gray-200 animate-pulse h-10 w-24"></Skeleton>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Наші Товари</h1>

      <div className="my-2">
        <Combobox
          categories={categories}
          selectedCategoryId={selectedCategory}
          onCategorySelect={(categoryId) => {
            setSelectedCategory(categoryId);
            console.log("Вибрана категорія:", categoryId);
          }}
        ></Combobox>
      </div>
      <div className="relative min-h-[200px]">
        {products.length === 0 && !loading ? (
          <p className="text-center text-gray-500">Товари не знайдено.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <li key={product.id} className="flex">
                <Card
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.image_path}
                  stock={product.stock}
                  isAuthenticated={isAuthenticated}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Пагінація */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 mx-1 border rounded-2xl bg-white text-indigo-600 duration-300 hover:bg-indigo-200 disabled:opacity-50 cursor-pointer"
          >
            Попередня
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 mx-1 border rounded-2xl bg-white text-indigo-600 duration-300 hover:bg-indigo-200 disabled:opacity-50 cursor-pointer"
          >
            Наступна
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
