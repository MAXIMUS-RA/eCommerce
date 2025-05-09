<?php

namespace Core;
use Models\Users;

class AuthMiddleware
{
    public static function checkAuthenticated()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        if (empty($_SESSION['user_id'])) {
            (new Response(['error' => 'Unauthorized. Authentication required.'], 401))
                ->setHeader('WWW-Authenticate', 'Bearer realm="My API"')
                ->send();
        }
    }

    public static function checkAdmin()
    {
        self::checkAuthenticated(); 

        $userId = $_SESSION['user_id'];
        var_dump($userId);

        
        $user = \Users::find($userId);
        var_dump($user);


        if (!$user || ($user['isAdmin'] ?? false) !== true) {
            (new Response(['error' => 'Forbidden. Administrator access required.'], 403))->send();
        }
    }
}
