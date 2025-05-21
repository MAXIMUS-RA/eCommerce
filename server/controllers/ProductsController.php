<?php

use Core\Response;


class ProductsController
{
    public function home($params = array())
    {
        return new Response(['message' => "Welcome to the homepage. [Products Home]"]);
    }

    public function index()
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;

        if ($page < 1) $page = 1;
        if ($perPage < 1) $perPage = 1;
        if ($perPage > 100) $perPage = 100;

        $paginatedProducts = Product::paginate($page, $perPage);
        return new Response($paginatedProducts);
    }

    public function show($params = [])
    {
        $product = Product::find((int)($params['id'] ?? 0));
        if (!$product) {
            return new Response(['error' => 'Not found'], 404);
        }
        return new Response($product);
    }

    public function store($params = [])
    {
        // !!! ТИМЧАСОВО ДЛЯ ВІДЛАДКИ !!!
        error_log("------- NEW PRODUCT STORE REQUEST -------");
        error_log("POST data: " . print_r($_POST, true));
        error_log("FILES data: " . print_r($_FILES, true));
        // !!! КІНЕЦЬ ТИМЧАСОВОГО КОДУ !!!

        // Перевірка, чи це POST-запит (хоча роутер вже мав би це зробити)
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return new Response(['error' => 'Invalid request method.'], 405);
        }

        // Отримуємо текстові дані з $_POST
        $categoryId = $_POST['category_id'] ?? null;
        $name = $_POST['name'] ?? null;
        $description = $_POST['description'] ?? null;
        $price = $_POST['price'] ?? null;
        $stock = $_POST['stock'] ?? null;

        // Валідація обов'язкових полів
        if (empty($categoryId) || empty($name) || empty($price) || empty($stock)) {
            // Можна додати більш детальну валідацію для кожного поля
            return new Response(['error' => 'Category ID, Name, Price, and Stock are required.'], 400);
        }

        $imagePathInDb = null; // Шлях до зображення, який буде збережено в БД

        // Обробка завантаженого файлу
        // Використовуємо ключ "image", як він надсилається з фронтенду
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/products/'; // Адаптуйте шлях
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0775, true) && !is_dir($uploadDir)) {
                    error_log('Failed to create upload directory: ' . $uploadDir);
                    return new Response(['error' => 'Server error: Could not create upload directory.'], 500);
                }
            }

            // Генерація унікального імені файлу, щоб уникнути перезапису
            $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $fileName = uniqid('product_', true) . '.' . $fileExtension;
            $targetFilePath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
                $imagePathInDb = '/uploads/products/' . $fileName; // Шлях, доступний через веб
            } else {
                error_log('Failed to move uploaded file: ' . $_FILES['image']['name']);
            }
        } elseif (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            // Якщо файл був надісланий, але сталася помилка, крім "файл не вибрано"
            error_log('File upload error: ' . $_FILES['image']['error'] . ' for file ' . $_FILES['image']['name']);
            // return new Response(['error' => 'Error uploading image: code ' . $_FILES['image']['error']], 400);
        }


        $data = [
            'category_id'  => (int)$categoryId,
            'name'  => trim($name),
            'description'  => trim($description),
            'price'  => (float)$price, // Переконайтесь, що тип даних правильний
            'stock'  => (int)$stock,   // Переконайтесь, що тип даних правильний
            'image_path'  => $imagePathInDb, // Зберігаємо шлях до файлу або null
        ];

        var_dump($data); // Для відладки, потім прибрати

        try {
            $id = Product::create($data);
            if ($id) {
                $createdProduct = Product::find($id); // Отримати створений продукт для відповіді
                return new Response(['message' => 'Product created successfully', 'product' => $createdProduct], 201);
            } else {
                return new Response(['error' => 'Failed to create product in database.'], 500);
            }
        } catch (\Exception $e) {
            error_log("Error creating product: " . $e->getMessage());
            return new Response(['error' => 'An unexpected error occurred while creating the product.'], 500);
        }
    }
}
