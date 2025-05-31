import type { Route } from "./+types/Home";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-12 items-center justify-center">
          <div className="flex flex-col gap-6 items-center justify-center text-center">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
                <span className="block">Ми тут, щоб</span>
                <span className="block text-blue-600">
                  гарантувати ваш успіх
                </span>
              </h1>
            </div>
            <div className="w-32 h-1 bg-blue-600 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Швидка доставка
              </h3>
              <p className="text-gray-600">
                Отримайте ваше замовлення швидко та безпечно по всій Україні
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Якісні товари
              </h3>
              <p className="text-gray-600">
                Тільки перевірені та сертифіковані товари від українських та світових брендів
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Підтримка 24/7
              </h3>
              <p className="text-gray-600">
                Наша українськомовна команда завжди готова допомогти вам
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl md:text-6xl font-bold text-gray-800">
                Наша
              </span>
              <span className="text-4xl md:text-6xl font-bold text-blue-500">
                Місія
              </span>
            </div>
            <hr className="w-full border-t-2 border-gray-300 mb-12" />

            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-80 flex-shrink-0">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Неперевершений сервіс
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-lg md:text-2xl text-gray-600 leading-relaxed">
                    Підтримувати українських споживачів та бізнес у їх розвитку, 
                    надаючи доступ до найкращих товарів та послуг в інтернеті.
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-80 flex-shrink-0">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Спеціалізація
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-lg md:text-2xl text-gray-600 leading-relaxed">
                    Наша головна експертиза полягає в розумінні потреб українського 
                    ринку та забезпеченні клієнтів найкращими рішеннями для онлайн-покупок.
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-80 flex-shrink-0">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Досвід
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-lg md:text-2xl text-gray-600 leading-relaxed">
                    Роки досвіду роботи з українськими покупцями - від приватних осіб 
                    до великих корпорацій, розуміння потреб кожного клієнта.
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-80 flex-shrink-0">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Технології
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-lg md:text-2xl text-gray-600 leading-relaxed">
                    Найкраще поєднання сучасних технологій та людського підходу 
                    для максимального комфорту наших клієнтів.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-white text-gray-800 mt-20 w-full border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-600">eCommerce Ukraine</h3>
              <p className="text-gray-600">
                Ваш надійний партнер для онлайн покупок в Україні. Якісні товари, 
                швидка доставка по всій країні та відмінний сервіс українською мовою.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Telegram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Viber"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.488-1.995.702 0 1.041.219 1.041 1.219 0 .738-.469 1.844-.711 2.87-.203.855.428 1.55 1.275 1.55 1.51 0 2.67-1.592 2.67-3.892 0-2.035-1.462-3.458-3.55-3.458-2.418 0-3.838 1.814-3.838 3.687 0 .731.281 1.51.632 1.936.069.083.079.156.058.241-.063.263-.203.822-.231.937-.037.155-.12.188-.277.113-1.043-.485-1.694-2.01-1.694-3.235 0-2.68 1.948-5.14 5.618-5.14 2.94 0 5.226 2.098 5.226 4.895 0 2.921-1.844 5.26-4.404 5.26-.859 0-1.667-.448-1.943-1.012l-.526 2.005c-.191.735-.703 1.654-1.047 2.215C9.618 23.807 10.8 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Швидкі посилання
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="/" className="hover:text-blue-600 transition-colors">
                    Головна
                  </a>
                </li>
                <li>
                  <a
                    href="/products"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Каталог товарів
                  </a>
                </li>
                <li>
                  <a
                    href="/categories"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Категорії
                  </a>
                </li>
                <li>
                  <a
                    href="/sale"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Розпродаж
                  </a>
                </li>
                <li>
                  <a
                    href="/new"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Новинки
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Обслуговування клієнтів
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a
                    href="/help"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Центр допомоги
                  </a>
                </li>
                <li>
                  <a
                    href="/delivery"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Доставка і оплата
                  </a>
                </li>
                <li>
                  <a
                    href="/returns"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Повернення товару
                  </a>
                </li>
                <li>
                  <a
                    href="/warranty"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Гарантія та сервіс
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Часті питання
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Контакти</h4>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>м. Київ, вул. Хрещатик, 1</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>0 800 500 123 (безкоштовно)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>info@ecommerce.com.ua</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Пн-Нд: 8:00-20:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-500 text-sm">
                © 2025 eCommerce Ukraine. Всі права захищені.
              </div>
              <div className="flex space-x-6 text-sm text-gray-500">
                <a
                  href="/privacy"
                  className="hover:text-blue-600 transition-colors"
                >
                  Політика конфіденційності
                </a>
                <a
                  href="/terms"
                  className="hover:text-blue-600 transition-colors"
                >
                  Умови користування
                </a>
                <a
                  href="/cookies"
                  className="hover:text-blue-600 transition-colors"
                >
                  Використання cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
