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
            return new Response(['error'=>'Not found'], 404);
        }
        return new Response($product);
    }

    public function store($params = [])
    {
        $data = [
            'name'  => $_POST['name'] ?? null,
            'price' => $_POST['price'] ?? null,
            // …
        ];
        $id = Product::create($data);
        return new Response(['id'=>$id], 201);
    }
}
