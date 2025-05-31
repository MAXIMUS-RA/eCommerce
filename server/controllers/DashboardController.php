<?php

use Core\Response;
use Core\AuthMiddleware;

class DashboardController
{
    public function index()
    {
        AuthMiddleware::checkAdmin();

        $adminData = [
            'message' => 'Welcome to the Admin Dashboard!',
            'admin_user_id' => $_SESSION['user_id'],
        ];

        return new Response($adminData);
    }

    public function userSettings()
    {
        AuthMiddleware::checkAuthenticated();
        $userData = [
            'message' => 'User settings page.',
            'user_id' => $_SESSION['user_id'],
        ];
        return new Response($userData);
    }
}
