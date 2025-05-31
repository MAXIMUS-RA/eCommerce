import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface LiqPayCheckout {
  init: (params: LiqPayInitParams) => LiqPayCheckoutInstance;
}

interface LiqPayInitParams {
  data: string;
  signature: string;
  embedTo: string;
  mode: "embed" | "popup";
  language?: "uk" | "en" | "ru";
}

interface LiqPayCheckoutInstance {
  on: (event: string, callback: (data: any) => void) => LiqPayCheckoutInstance;
}

declare global {
  interface Window {
    LiqPayCheckout?: LiqPayCheckout;
    LiqPayCheckoutCallback?: () => void;
  }
}

interface PaymentFormProps {
  orderId: number;
  amount: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string, data?: any) => void;
}

export default function PaymentForm({
  orderId,
  amount,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const liqpayCheckoutRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const loadLiqPayScript = () => {
      if (document.getElementById("liqpay-checkout-script")) {
        if (window.LiqPayCheckout) {
          initializeCheckout();
        } else {
          window.LiqPayCheckoutCallback = initializeCheckout;
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "liqpay-checkout-script";
      script.src = "//static.liqpay.ua/libjs/checkout.js";
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        if (window.LiqPayCheckout) {
          initializeCheckout();
        } else {
          window.LiqPayCheckoutCallback = initializeCheckout;
        }
      };
      script.onerror = () => {
        setErrorState("Не вдалося завантажити платіжний модуль LiqPay.");
        setLoading(false);
        onError?.("Не вдалося завантажити платіжний модуль LiqPay.");
      };
      document.body.appendChild(script);
    };

    const initializeCheckout = async () => {
      if (!window.LiqPayCheckout) {
        console.error("LiqPayCheckout SDK не завантажено.");
        setErrorState("Помилка завантаження платіжного модуля.");
        onError?.("Помилка завантаження платіжного модуля.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/payment/create",
          {
            order_id: orderId,
          },
          {
            withCredentials: true,
          }
        );

        const { data, signature } = response.data;

        if (!data || !signature) {
          throw new Error("Не отримано дані для ініціалізації LiqPay");
        }

        setLoading(false);

        window.LiqPayCheckout.init({
          data: data,
          signature: signature,
          embedTo: "#liqpay_checkout_embed",
          mode: "embed", 
          language: "uk",
        })
          .on("liqpay.callback", function (data: any) {
            console.log("LiqPay JS SDK Callback:", data);
            if (data.status === "success" || data.status === "sandbox") {
              onSuccess?.(data);
            } else {
              onError?.(`Статус платежу: ${data.status}`, data);
            }
          })
          .on("liqpay.ready", function (data: any) {
            console.log("LiqPay form ready:", data);
          })
          .on("liqpay.close", function (data: any) {
            
            console.log("LiqPay form closed:", data);
            onError?.("Платіжну форму було закрито.", data);
          });
      } catch (err: any) {
        console.error("Помилка створення платежу LiqPay:", err);
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Не вдалося підготувати форму оплати.";
        setErrorState(errorMessage);
        onError?.(errorMessage);
        setLoading(false);
      }
    };

    loadLiqPayScript();
  }, [orderId, onSuccess, onError]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Завантаження платіжного модуля...</p>
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-4">
          Помилка оплати
        </h3>
        <p className="text-gray-700">{errorState}</p>
        <button
          onClick={() => window.location.reload()} 
          className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Оплата замовлення
      </h3>
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600 mb-1">
          Номер замовлення: <span className="font-medium">#{orderId}</span>
        </p>
        <p className="text-lg font-bold text-green-600">
          Сума: {amount.toFixed(2)} ₴
        </p>
      </div>
      <div id="liqpay_checkout_embed" ref={liqpayCheckoutRef}>
       
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Якщо платіжна форма не з'явилася, будь ласка, оновіть сторінку.
      </p>
    </div>
  );
}
