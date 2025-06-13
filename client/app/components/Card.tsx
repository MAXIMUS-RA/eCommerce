import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { selectAuth } from "~/redux/slices/authSlice";
import { addToCart, addToCartAPI } from "~/redux/slices/cartSlice";
import type { AppDispatch } from "~/redux/store";
interface CardProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  isAuthenticated: boolean;
}
const API_SERVER_URL = "http://localhost:8000";

function Card(props: CardProduct) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector(selectAuth);
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!isAuthenticated) {
      alert("Ви маєте ввійти в аккаунт, щоб додати товар у кошик.");
      navigate("/login");
      return;
    }
    dispatch(
      addToCartAPI({
        product_id: props.id,
        quantity: 1,
      })
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-xs w-full flex flex-col h-full">
      <div className="h-48 w-full overflow-hidden hover:scale-105 transition-transform duration-300">
        <Link to={`/products/${props.id}`}>
          <img
            src={`${API_SERVER_URL}${props.image}`}
            alt={props.name}
            className="object-contain w-full h-full"
          />
        </Link>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow mb-4">
          <span className="block text-lg font-semibold mb-1">{props.name}</span>
          <span className="block text-gray-600 text-sm leading-relaxed truncate">
            {props.description}
          </span>
        </div>
        <div className="mt-auto p-4 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-green-700">
              ${props.price}
            </span>
            {props.stock <= 10 && (
              <span className="px-2 py-1 text-xs font-semibold uppercase bg-amber-100 text-amber-800 rounded-full animate-pulse">
                Закінчується
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={props.stock <= 0}
            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold uppercase rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {props.stock > 0 ? "Додати в кошик" : "Немає в наявності"}
          </button>
        </div>
        </div>
      </div>
  );
}

export default Card;
