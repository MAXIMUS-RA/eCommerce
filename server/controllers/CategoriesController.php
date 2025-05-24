<?php

use Core\Response;

class CategoriesController
{

    public function index()
    {
        $categories = Categories::all();
        return new Response($categories);
    }


    public function store()
    {
        $name = null;
        
        if (empty($_POST)) {
            $input = json_decode(file_get_contents('php://input'), true);
            $name = $input['name'] ?? null;
        } else {
            $name = $_POST['name'] ?? null;
        }
        
        if (empty($name)) {
            return new Response(["error" => "Name is required"], 400);
        }
        
        if (!empty(Categories::findBy('name', $name))) {
            return new Response(["error" => "This category already exists"], 400);
        }
        
        try {
            $createdCategory = Categories::create(["name" => $name]);
            return new Response(["msg" => "Success creating category", "category" => $createdCategory]);
        } catch (\Exception $e) {
            error_log("Error creating category: " . $e->getMessage());
            return new Response(['error' => 'An unexpected error occurred while creating the category.'], 500);
        }
    }
}
