<?php

use Core\Response;
use Core\AuthMiddleware; // Переконайтеся, що імпорт є

class DashboardController
{
    public function index()
    {
        // Цей виклик перевірить, чи користувач залогінений,
        // а потім витягне дані користувача з БД і перевірить поле is_admin.
        AuthMiddleware::checkAdmin();

        // Якщо користувач не адмін, AuthMiddleware::checkAdmin() вже надіслав
        // відповідь 403 Forbidden і завершив виконання.
        // Код нижче виконається тільки для адміністраторів.

        // Ваша логіка для адмін-панелі
        $adminData = [
            'message' => 'Welcome to the Admin Dashboard!',
            'admin_user_id' => $_SESSION['user_id'], // user_id все ще беремо з сесії
            // Можна додати інші дані, специфічні для адмінів
        ];

        return new Response($adminData);
    }

    /**
     * Дія, доступна всім автентифікованим користувачам (не тільки адмінам).
     */
    public function userSettings()
    {
        // Цей виклик перевірить, чи користувач залогінений.
        AuthMiddleware::checkAuthenticated();

        // Код для налаштувань користувача
        $userData = [
            'message' => 'User settings page.',
            'user_id' => $_SESSION['user_id'],
        ];
        return new Response($userData);
    }
}