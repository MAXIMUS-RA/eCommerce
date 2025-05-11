import { useLoaderData, useParams, Link as RemixLink } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"; // або cloudflare/next
import axios from "axios";

// Інтерфейс для одного продукту (узгодьте з вашим API)
interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: number;
  image_path: string; // Переконайтеся, що це поле є у відповіді API
  // ... інші поля, якщо є
}

// Loader функція для завантаження даних на сервері
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<ProductDetails> {
  const productId = params.productId; // productId береться з назви файлу ($productId)
  if (!productId) {
    throw new Response("Product ID not found in URL", { status: 400 });
  }

  try {
    const response = await axios.get<ProductDetails>(
      `http://localhost:8000/products/${productId}`
    );

    if (
      !response.data ||
      (typeof response.data === "object" &&
        Object.keys(response.data).length === 0)
    ) {
      // Якщо API повертає порожній об'єкт або null для неіснуючого продукту
      throw new Response("Product not found", { status: 404 });
    }
    return response.data;
  } catch (error: any) {
    console.error(`Failed to load product ${productId}:`, error.message);
    if (axios.isAxiosError(error) && error.response) {
      // Якщо API повернуло помилку (наприклад, 404)
      throw new Response(
        error.response.data?.message || "Error fetching product from API",
        { status: error.response.status }
      );
    }
    // Загальна помилка сервера або мережі
    throw new Response("Failed to load product data", { status: 500 });
  }
}

// Meta функція для SEO
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    // data може бути undefined, якщо loader кинув помилку до повернення даних
    return [{ title: "Product Not Found" }];
  }
  return [
    { title: `${data.name} - Your Store Name` },
    {
      name: "description",
      content: data.description
        ? data.description.substring(0, 150)
        : "Product details.",
    },
  ];
};

// Назва компонента має бути валідною
export default function ProductDetailPage() {
  const product = useLoaderData<ProductDetails>(); // Отримуємо дані з loader

  // Якщо loader кинув помилку, ErrorBoundary буде відрендерений замість цього компонента

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
        <div className="md:w-1/2 p-4">
          <img
            src={
              product.image_path ||
              `https://via.placeholder.com/600x400.png?text=${encodeURIComponent(
                product.name
              )}`
            }
            alt={product.name}
            className="w-full h-auto max-h-[500px] object-contain rounded-lg" // object-contain щоб бачити все зображення
          />
        </div>
        <div className="p-6 md:w-1/2 flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
            {product.description || "No description available."}
          </p>
          <div className="mt-auto">
            {" "}
            {/* Цей div притисне ціну та кнопку до низу */}
            <p className="text-3xl font-semibold text-indigo-600 mb-6">
              ${product.price.toFixed(2)}
            </p>
            <button
              className="w-full px-6 py-3 border rounded-lg bg-indigo-600 text-white font-semibold text-lg duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              // onClick={() => addToCart(product.id)} // Додайте логіку додавання в кошик
            >
              Додати в кошик
            </button>
            <RemixLink
              to="/products"
              className="block text-center mt-4 text-indigo-600 hover:underline"
            >
              Повернутися до товарів
            </RemixLink>
          </div>
        </div>
      </div>
    </div>
  );
}

// Важливо додати ErrorBoundary для обробки помилок, які може кинути loader
export function ErrorBoundary() {
  // const error = useRouteError(); // Можна отримати деталі помилки
  // if (isRouteErrorResponse(error)) { ... } // Для більш детальної обробки
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Ой, сталася помилка!
      </h1>
      <p className="text-gray-700 mb-4">
        Не вдалося завантажити інформацію про товар. Можливо, такого товару не
        існує, або виникла проблема з сервером.
      </p>
      <RemixLink to="/products" className="text-indigo-600 hover:underline">
        Повернутися до списку товарів
      </RemixLink>
    </div>
  );
}
