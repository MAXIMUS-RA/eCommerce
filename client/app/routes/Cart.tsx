import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectAuth } from "~/redux/slices/authSlice";
import { selectCart, updateCart } from "~/redux/slices/cartSlice";
import type { AppDispatch } from "~/redux/store";
import CartItem from "~/components/CartItem";

export default function Cart() {
  const { isAuthenticated } = useSelector(selectAuth);
  const { items } = useSelector(selectCart);
  const dispatch = useDispatch<AppDispatch>();
  const navigator = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigator("/login");
    }
  }, [isAuthenticated, navigator]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Your Shopping Cart
      </h1>
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-white rounded-lg shadow">
          <p className="text-xl">Your cart is currently empty.</p>
          <a
            href="/products"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="hidden md:flex px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="w-2/5">Product</div>
              <div className="w-1/5 text-center">Price</div>
              <div className="w-1/5 text-center">Quantity</div>
              <div className="w-1/5 text-right">Total</div>
              <div className="w-1/12 text-right"></div>
            </div>

            {items.map((element: any) => (
              <CartItem
              key={element.id}
                id={element.id}
                price={element.price}
                quantity={element.quantity}
                image_path={element.image_path}
                name={element.name}
                description={element.description}
                product_id={element.product_id}
              ></CartItem>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <div className="w-full md:w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Cart Summary
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">
                  $
                  {items
                    .reduce(
                      (sum: number, el: any) =>
                        sum + (el.quantity ?? 1) * (el.price ?? 0), 
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <a
                href="#"
                className="mt-6 block w-full text-center bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Proceed to Checkout
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
