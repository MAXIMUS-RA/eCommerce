<?php 

use Core\Response;

class CategoriesController {

    public function index(){
        $categories = Categories::all();
        return new Response($categories);
    }

}