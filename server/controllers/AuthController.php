<?php

use Core\Response;

class AuthController
{
    function register()
    {
        if (empty($_POST)) {
            $input = json_decode(file_get_contents('php://input'), true);
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            $name = $input['name'] ?? '';
        } else {
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';
            $name = $_POST['name'] ?? '';
        }


        if (!$email || !$password || !$name) {
            return new Response(['error' => 'Email, password, and name are required'], 400);
        }

        $existing = Users::all();
        foreach ($existing as $user) {
            if ($user['email'] === $email) {
                return new Response(['error' => 'User already exists'], 409);
            }
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);

        error_log("Register: email=$email, password_hash=$hash (original_password_for_debug=$password)");

        $userId = Users::create([
            'name' => $name,
            'email' => $email,
            'password_hash' => $hash,
            'is_admin' => false // Або інше значення за замовчуванням
        ]);

        if ($userId && !($userId instanceof \Core\Response)) { // Перевірка, що create не повернув помилку
            // Автоматичний логін після реєстрації
            $_SESSION['user_id'] = $userId;
            $_SESSION['user_name'] = $name; // Або отримати з $user, якщо create повертає об'єкт
            $_SESSION['is_admin'] = false; // Або отримати з $user

            $user = Users::find($userId); // Отримати повні дані користувача
            unset($user['password_hash']); // Видалити хеш пароля з відповіді

            return new Response(['message' => 'User registered successfully and logged in.', 'user' => $user], 201);
        } else {
            // Якщо $userId це Response, то це помилка від BaseModel::create
            if ($userId instanceof \Core\Response) return $userId;
            return new Response(['error' => 'Failed to register user.'], 500);
        }
    }

    public function login()
    {
        if (empty($_POST)) {
            $input = json_decode(file_get_contents('php://input'), true);
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
        } else {
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';
        }

        if (!$email || !$password) {
            return new Response(['error' => 'Email and password required'], 400);
        }

        $users = Users::all();
        foreach ($users as $user) {
            if ($user['email'] === $email && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                return new Response(['message' => 'Logged in', "test" => $_SESSION['user_id']]);
            }
        }

        return new Response(['error' => 'Invalid credentials'], 401);
    }

    public function logout()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION = array(); // Очистити масив сесії

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }
        session_destroy();
        return new Response(['message' => 'Logout successful']);
    }
    public function status()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        if (!empty($_SESSION['user_id'])) {
            $user = Users::find($_SESSION['user_id']);
            if ($user) {
                unset($user['password_hash']);
                return new Response(['isAuthenticated' => true, 'user' => $user]);
            }
        }
        return new Response(['isAuthenticated' => false, 'user' => null]);
    }
}
