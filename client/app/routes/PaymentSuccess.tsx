import { Link, useNavigate } from "react-router";
import {
  CheckCircle,
  ShoppingBag,
  ArrowLeft,
  Package,
  Mail,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCartItems } from "~/redux/slices/cartSlice";
import type { AppDispatch } from "~/redux/store";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    dispatch(setCartItems([]));

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/products");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
          <div className="text-center">
            <div className="relative inline-flex">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-75"></div>
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900 mb-2">
              Оплата успішна! 🎉
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Дякуємо за ваше замовлення. Платіж успішно обробено.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900 mb-1">
                Email підтвердження
              </h3>
              <p className="text-sm text-blue-700">
                Підтвердження надіслано на вашу пошту
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900 mb-1">Підготовка</h3>
              <p className="text-sm text-purple-700">
                Ваше замовлення готується до відправки
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-900 mb-1">Доставка</h3>
              <p className="text-sm text-orange-700">
                Зв'яжемося найближчим часом
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Що відбувається далі?
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Платіж підтверджено
                  </h4>
                  <p className="text-sm text-gray-600">
                    Ваш платіж успішно обробленно через LiqPay
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Обробка замовлення
                  </h4>
                  <p className="text-sm text-gray-600">
                    Наша команда готує ваші товари до відправки
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Відправка</h4>
                  <p className="text-sm text-gray-600">
                    Отримаєте номер для відстеження доставки
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/profile"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Переглянути мої замовлення
            </Link>

            <Link
              to="/products"
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Продовжити покупки
            </Link>

            <button
              onClick={() => navigate("/contact")}
              className="w-full flex justify-center items-center py-2 px-4 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Потрібна допомога? Зв'яжіться з нами
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Автоматичне перенаправлення на каталог через {countdown} секунд
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-indigo-600 h-1 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <span>🔒 Безпечна оплата</span>
            <span>•</span>
            <span>📞 Підтримка 24/7</span>
            <span>•</span>
            <span>🚚 Швидка доставка</span>
          </div>
        </div>
      </div>
    </div>
  );
}
