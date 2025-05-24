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
  isAuthenticated:boolean
  
}
const API_SERVER_URL = "http://localhost:8000"; 

function Card(props: CardProduct) {
  const dispatch = useDispatch<AppDispatch>();
  const {isAuthenticated} = useSelector(selectAuth);
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
      <div className="h-48 w-full overflow-hidden">
        <Link to={`/products/${props.id}`}>
          <img
            src={`${API_SERVER_URL}${props.image}`}
            alt={props.name}
            className="object-cover w-full h-full"
          />
        </Link>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow mb-4">
          <span className="block text-lg font-semibold mb-1">{props.name}</span>
          <span className="block text-gray-600 text-sm leading-relaxed">
            {props.description}
          </span>
        </div>

        <div>
          <span className="block text-xl font-bold text-green-600 mb-3">
            ${props.price}
          </span>
          <button
            onClick={handleAdd}
            className="w-full px-4 py-2 border rounded-lg bg-indigo-600 text-white text-sm font-medium duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={props.stock <= 0}
          >
            {props.stock > 0 ? "Додати в кошик" : "Немає в наявності"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
