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
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return new Response(['error' => 'Invalid request method.'], 405);
        }

        $categoryId = $_POST['category_id'] ?? null;
        $name = $_POST['name'] ?? null;
        $description = $_POST['description'] ?? null;
        $price = $_POST['price'] ?? null;
        $stock = $_POST['stock'] ?? null;

        if (empty($categoryId) || empty($name) || empty($price) || empty($stock)) {
            return new Response(['error' => 'Category ID, Name, Price, and Stock are required.'], 400);
        }

        $imagePathInDb = null; 

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/products/'; 
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0775, true) && !is_dir($uploadDir)) {
                    error_log('Failed to create upload directory: ' . $uploadDir);
                    return new Response(['error' => 'Server error: Could not create upload directory.'], 500);
                }
            }

            $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $fileName = uniqid('product_', true) . '.' . $fileExtension;
            $targetFilePath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
                $imagePathInDb = '/uploads/products/' . $fileName; 
            } else {
                error_log('Failed to move uploaded file: ' . $_FILES['image']['name']);
            }
        } elseif (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            error_log('File upload error: ' . $_FILES['image']['error'] . ' for file ' . $_FILES['image']['name']);
        }


        $data = [
            'category_id'  => (int)$categoryId,
            'name'  => trim($name),
            'description'  => trim($description),
            'price'  => (float)$price, 
            'stock'  => (int)$stock,   
            'image_path'  => $imagePathInDb, 
        ];

        var_dump($data); 

        try {
            $id = Product::create($data);
            if ($id) {
                $createdProduct = Product::find($id); 
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

