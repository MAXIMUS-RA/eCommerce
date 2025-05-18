import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router";
import { selectAuth } from "~/redux/slices/authSlice";
import { addToCart, addToCartAPI } from "~/redux/slices/cartSlice";
import type { AppDispatch, RootState } from "~/redux/store";

interface Product {
  id: number;
  name: string;
  description: string;
  image_path: string;
  price: number;
  stock: number;
}

function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector(selectAuth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Product>(
          `http://localhost:8000/products/${productId}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Помилка завантаження товару. Спробуйте пізніше.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Ви маєте ввійти в аккаунт, щоб додати товар у кошик.");
      navigate("/login");
      return;
    }
    if (product) {
      const itemToAdd = {
        product_id: product.id,
        quantity: quantity,
      };
      dispatch(addToCartAPI(itemToAdd));
      console.log(`Додано в кошик: ${product?.name}, кількість: ${quantity}`);
    } else {
      console.error("Неможливо додати в кошик: дані товару не завантажені.");
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (loading) {
    return (
      <div className="py-8 px-4 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 max-w-6xl mx-auto">
        <div className="text-center text-red-500">{error}</div>
        <div className="mt-4 text-center">
          <Link to="/products" className="text-indigo-600 hover:underline">
            Повернутися до списку товарів
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-8 px-4 max-w-6xl mx-auto">
        <div className="text-center text-red-500">Товар не знайдено</div>
        <div className="mt-4 text-center">
          <Link to="/products" className="text-indigo-600 hover:underline">
            Повернутися до списку товарів
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="mb-4">
        <Link to="/products" className="text-indigo-600 hover:underline">
          ← Назад до списку товарів
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border mb-4">
            {product.image_path ? (
              <img
                src={product.image_path}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Немає зображення
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-indigo-600 mb-4">
            {product.price} грн{" "}
            {quantity > 1 &&
              `× ${quantity} = ${(product.price * quantity).toFixed(2)} грн`}
          </p>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Опис</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
          <label htmlFor="">Кількість на складі: {product.stock}</label>
          <div className="space-y-4 mt-2">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="font-medium">
                Кількість:
              </label>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-1 border rounded-l-lg bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-t border-b py-1"
                />
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-1 border rounded-r-lg bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Додати в кошик" : "Немає в наявності"}
            </button>

            {addedToCart && (
              <div className="text-center p-2 rounded bg-green-100 text-green-700">
                Товар додано в кошик!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
