import React from "react";
import { useDispatch } from "react-redux";
import {
  updateCart,
  removeFromCart,
  removeFromCartAPI,
  updateCartAPI,
} from "~/redux/slices/cartSlice";
import type { AppDispatch } from "~/redux/store";

const API_SERVER_URL = "http://localhost:8000";

interface CartItemProps {
  id: number;
  name: string;
  image_path?: string;
  description?: string;
  price: number;
  quantity: number;
  product_id: number;
}

export default function CartItem({
  id,
  name,
  image_path,
  description,
  price,
  quantity,
  product_id,
}: CartItemProps) {
  const dispatch = useDispatch<AppDispatch>();

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "Немає опису";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="flex flex-col md:flex-row items-center px-6 py-4 border-b border-gray-200">
      <div className="w-full md:w-2/5 flex items-center mb-4 md:mb-0">
        <img
          src={`${API_SERVER_URL}${image_path}`}
          alt={name || "Product image"}
          className="w-16 h-16 object-cover rounded mr-4 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <a
            href={`/products/${product_id}`}
            className="text-lg font-semibold text-gray-800 hover:text-indigo-600 block truncate"
            title={name}
          >
            {truncateText(name, 30)}
          </a>
          <p className="text-sm text-gray-500 mt-1" title={description}>
            {truncateText(description || "", 40)}
          </p>
        </div>
        {!id && (
          <>
            <div className="text-red-500 w-16 h-16 flex items-center justify-center mr-4 bg-gray-100 rounded">
              ?
            </div>
            <div className="text-red-500">Product data missing</div>
          </>
        )}
      </div>

      <div className="w-full md:w-1/5 text-left md:text-center mb-2 md:mb-0">
        <span className="md:hidden font-semibold mr-2">Ціна:</span>
        {id ? (
          <span className="text-gray-700 font-medium">₴{price}</span>
        ) : (
          <span className="text-gray-500">N/A</span>
        )}
      </div>

      <div className="w-full md:w-1/5 flex items-center justify-start md:justify-center mb-4 md:mb-0">
        <span className="md:hidden font-semibold mr-2">Кількість:</span>
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-500 duration-300 rounded hover:text-gray-700 p-2 hover:bg-gray-100 disabled:opacity-50"
            disabled={quantity <= 1}
            onClick={() => {
              if (quantity > 1) {
                dispatch(
                  updateCartAPI({
                    product_id: product_id,
                    quantity: quantity - 1,
                  })
                );
              }
            }}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                stroke="currentColor"
                d="M20 12L4 12"
              />
            </svg>
          </button>

          <input
            type="number"
            name="quantity"
            value={quantity}
            className="mx-2 w-16 text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            min={1}
            readOnly
          />

          <button
            type="button"
            className="text-gray-500 duration-300 rounded hover:text-gray-700 p-2 hover:bg-gray-100"
            onClick={() => {
              dispatch(
                updateCartAPI({
                  product_id: product_id,
                  quantity: quantity + 1,
                })
              );
            }}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                stroke="currentColor"
                d="M12 4V20M20 12H4"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/5 text-left md:text-right mb-4 md:mb-0">
        <span className="md:hidden font-semibold mr-2">Сума:</span>
        {id ? (
          <span className="font-semibold text-gray-900 text-lg">
            ₴{((quantity ?? 1) * (price ?? 0)).toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-500">N/A</span>
        )}
      </div>

      <div className="w-full md:w-1/12 text-right">
        <button
          type="button"
          className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
          title="Видалити товар"
          onClick={() => {
            if (id !== undefined && id !== null) {
              dispatch(removeFromCartAPI({ product_id }));
            } else {
              console.error("Cannot remove item: invalid ID");
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
