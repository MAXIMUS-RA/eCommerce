import React from "react";
import { Link } from "react-router";
interface CardProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

function Card(props: CardProduct) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-xs flex flex-col h-full">
      <div className="h-48 w-full overflow-hidden">
        <Link to={`/products/${props.id}`}>
          <img
            src={props.image}
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
          <button className="w-full px-4 py-2 border rounded-lg bg-indigo-600 text-white text-sm font-medium duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50">
            Додати в кошик
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
