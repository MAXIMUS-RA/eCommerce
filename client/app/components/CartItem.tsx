import React from "react";
import { useDispatch } from "react-redux";
import {
  updateCart,
  removeFromCart,
  removeFromCartAPI,
  updateCartAPI,
} from "~/redux/slices/cartSlice";
import type { AppDispatch } from "~/redux/store";

interface CartItemProps {
  id: number;
  name: string;
  image_path?: string;
  description?: string;
  price: number;
  quantity: number;
  product_id:number
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

  return (
    <div className="flex flex-col md:flex-row items-center px-6 py-4 border-b border-gray-200">
      <div className="w-full md:w-2/5 flex items-center mb-4 md:mb-0">
        <img
          src={image_path || "#"}
          alt={name || "Product image"}
          className="w-16 h-16 object-cover rounded mr-4 flex-shrink-0"
        />
        <div>
          <a
            href={`/products/${id}`}
            className="text-lg font-semibold text-gray-800 hover:text-indigo-600"
          >
            {name || "Unknown Product"}
          </a>
          <p className="text-sm text-gray-500">
            <span className="font-bold">Description:</span> {description}
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
        <span className="md:hidden font-semibold mr-2">Price:</span>
        {id ? (
          <span className="text-gray-700">${price}</span>
        ) : (
          <span className="text-gray-500">N/A</span>
        )}
      </div>

      <div className="w-full md:w-1/5 flex items-center justify-start md:justify-center mb-4 md:mb-0">
        <span className="md:hidden font-semibold mr-2">Quantity:</span>
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-500 duration-300 rounded-4xl hover:text-gray-700 p-1 hover:bg-gray-300 disabled:opacity-50 "
            onClick={() => {
              // Decrease quantity logic here
              dispatch(
                updateCartAPI({
                  product_id: product_id,
                  quantity: quantity - 1,
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
                d="M20 12L4 12"
              ></path>
            </svg>
          </button>
          <input
            type="number"
            name="quantity"
            value={quantity}
            className="mx-2 w-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            min={1}
            readOnly
          />
          <button
            type="button"
            className="text-gray-500 duration-300 rounded-4xl hover:text-gray-700 p-1 hover:bg-gray-300 disabled:opacity-50 "
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
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Загальна ціна за позицію */}
      <div className="w-full md:w-1/5 text-left md:text-right mb-4 md:mb-0">
        <span className="md:hidden font-semibold mr-2">Total:</span>
        {id ? (
          <span className="font-semibold text-gray-900">
            ${((quantity ?? 1) * (price ?? 0)).toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-500">N/A</span>
        )}
      </div>

      {/* Кнопка видалення */}
      <div className="w-full md:w-1/12 text-right">
        <button
          type="button"
          className="text-red-500 hover:text-red-700"
          title="Remove item"
          onClick={() => {
            if (id !== undefined && id !== null) {
              dispatch(removeFromCartAPI( {product_id} ));
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
