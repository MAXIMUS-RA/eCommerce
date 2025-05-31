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

        $result = Users::create([
            'name' => $name,
            'email' => $email,
            'password' => $hash
        ]);

        if ($result instanceof Response) {
            return $result;
        }

        $id = $result;
        error_log("Register: created user id=$id");

        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $id;

        return new Response(['message' => 'Registered', 'id' => $id], 201);
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

        $user = Users::getByEmail($email);
        var_dump($user);

        // Check if user was found
        if (!$user) {
            return new Response(['error' => 'Invalid credentials'], 401);
        }

        if (password_verify($password, $user['password'])) {
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
            $_SESSION['user_id'] = $user['id'];
            return new Response(['message' => 'Logged in', "user" => $user]);
        }

        return new Response(['error' => 'Invalid credentials'], 401);
    }

    public function logout()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION = array();

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
