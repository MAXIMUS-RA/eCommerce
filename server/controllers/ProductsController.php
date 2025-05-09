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
        $products = Product::all();
        return new Response($products);
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
