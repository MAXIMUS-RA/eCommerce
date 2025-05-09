<?php
use Core\Response;
class UsersController{

    function index(){
        $users = Users::all();
        return new Response($users);
    }

}