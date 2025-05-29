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
        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 10);
        $categoryId = $_GET['category_id'] ?? null;

        if ($categoryId === 'null' || $categoryId === '' || $categoryId === null) {
            $categoryId = null;
        } else {
            $categoryId = is_numeric($categoryId) ? (int)$categoryId : null;
        }

        $result = Product::paginate($page, $perPage, $categoryId);

        if (empty($result)) {
            return new Response([
                'data' => [],
                'total_items' => 0,
                'total_pages' => 0,
                'current_page' => 1,
                'per_page' => $perPage
            ]);
        }

        return new Response($result);
    }
    public function adminIndex()
    {
        $products = Product::all();
        return new Response([
            'data' => $products,
            'total' => count($products),
            'message' => 'All products for admin panel'
        ]);
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

        if (!empty(Product::findBy("name", $data['name']))) {
            return new Response(["error" => "This Products alredy exist"], 400);
        }

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
    public function update($params = [])
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return new Response(['error' => 'Invalid request method.'], 405);
        }

        if (($_POST['_method'] ?? '') !== 'PUT') {
            return new Response(['error' => 'Method PUT required via _method field.'], 405);
        }

        $productId = (int)($params['id'] ?? 0);
        $product = Product::find($productId);
        if (!$product) {
            return new Response(['error' => 'Product not found'], 404);
        }
        $categoryId = $_POST['category_id'] ?? null;
        $name = $_POST['name'] ?? null;
        $description = $_POST['description'] ?? null;
        $price = $_POST['price'] ?? null;
        $stock = $_POST['stock'] ?? null;

        if (empty($categoryId) || empty($name) || empty($price) || empty($stock)) {
            return new Response(['error' => 'Category ID, Name, Price, and Stock are required.'], 400);
        }

        $imagePathInDb = $product['image_path'];

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
                if ($product['image_path'] && file_exists(__DIR__ . '/../../public' . $product['image_path'])) {
                    unlink(__DIR__ . '/../../public' . $product['image_path']);
                }
                $imagePathInDb = '/uploads/products/' . $fileName;
            } else {
                error_log('Failed to move uploaded file: ' . $_FILES['image']['name']);
                return new Response(['error' => 'Failed to upload new image.'], 500);
            }
        }

        $data = [
            'category_id'  => (int)$categoryId,
            'name'  => trim($name),
            'description'  => trim($description),
            'price'  => (float)$price,
            'stock'  => (int)$stock,
            'image_path'  => $imagePathInDb,
        ];

        if (!empty(Product::findBy("name", $data['name'])) && $data['name'] !== $product["name"]) {
            return new Response(["error" => "Product with this name already exists"], 400);
        }

        try {
            $updated = Product::update($productId, $data);
            if ($updated) {
                $updatedProduct = Product::find($productId);
                return new Response(['message' => 'Product updated successfully', 'product' => $updatedProduct]);
            } else {
                return new Response(['error' => 'Failed to update product in database.'], 500);
            }
        } catch (\Exception $e) {
            error_log("Error updating product: " . $e->getMessage());
            return new Response(['error' => 'An unexpected error occurred while updating the product.'], 500);
        }
    }

    function delete($params = [])
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            return new Response(['error' => 'Invalid request method.'], 405);
        }

        $productId = (int)($params['id'] ?? 0);
        $product = Product::find($productId);
        if (!$product) {
            return new Response(['error' => 'Product not found'], 404);
        }

        try {
            if ($product["image_path"] && file_exists(__DIR__ . '/../../public' . $product["image_path"])) {
                unlink(__DIR__ . '/../../public' . $product["image_path"]);
            }
            $delete = Product::delete($productId);
            if ($delete) {
                return new Response(['message' => 'Product deleted successfully']);
            } else {
                return new Response(['error' => 'Failed to delete product from database.'], 500);
            }
        } catch (\Throwable $th) {
            error_log("Error deleting product: " . $th->getMessage());
            return new Response(['error' => 'An unexpected error occurred while deleting the product.'], 500);
        }
    }
}
