<?php

use Core\Response;
use Core\AuthMiddleware;

class UsersController
{

    function index()
    {
        AuthMiddleware::checkAdmin();
        $users = Users::all();
        return new Response($users);
    }

    private function getAuthenticatedUserId(): ?int
    {
        AuthMiddleware::checkAuthenticated();
        return $_SESSION['user_id'] ?? null;
    }

    function uploadAvatar()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) {
            return new Response(['error' => 'User not authenticated.'], 401);
        }

        if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
            return new Response(['error' => 'No file uploaded or upload error.'], 400);
        }

        $file = $_FILES['avatar'];

        if ($file['size'] > 5 * 1024 * 1024) {
            return new Response(['error' => 'File too large. Maximum size is 5MB.'], 400);
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            return new Response(['error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'], 400);
        }

        $user = Users::find($userId);
        if (!$user) {
            return new Response(['error' => 'User not found.'], 404);
        }

        if (!empty($user['avatar'])) {
            $oldAvatarPath = __DIR__ . '/../../public/uploads/avatars/' . basename($user['avatar']);
            if (file_exists($oldAvatarPath)) {
                unlink($oldAvatarPath);
            }
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = 'avatar_' . $userId . '_' . time() . '.' . $extension;

        $uploadDir = __DIR__ . '/../../public/uploads/avatars/';
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
                error_log('Failed to create upload directory: ' . $uploadDir);
                return new Response(['error' => 'Failed to create upload directory.'], 500);
            }
        }

        $uploadPath = $uploadDir . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
            return new Response(['error' => 'Failed to upload file.'], 500);
        }

        $avatarUrl = '/uploads/avatars/' . $fileName;
        $updated = Users::update($userId, ['avatar' => $avatarUrl]);

        if ($updated) {
            return new Response([
                'message' => 'Avatar uploaded successfully.',
                'avatar_url' => $avatarUrl
            ]);
        } else {
            if (file_exists($uploadPath)) {
                unlink($uploadPath);
            }
            return new Response(['error' => 'Failed to update user avatar.'], 500);
        }
    }

    function updateAvatar()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) {
            return new Response(["error" => "No user found"]);
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');


        if (empty($name) || empty($email)) {
            return new Response(['error' => 'Name and email are required.'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new Response(['error' => 'Invalid email format.'], 400);
        }

        $existingUser = Users::findBy('email', $email);
        if ($existingUser && $existingUser['id'] != $userId) {
            return new Response(['error' => 'Email already taken.'], 400);
        }

        $updated = Users::update($userId, [
            'name' => $name,
            'email' => $email,
        ]);

        if ($updated) {
            return new Response(['message' => 'Profile updated successfully.']);
        } else {
            return new Response(['error' => 'Failed to update profile.'], 500);
        }
    }

    function updateProfile()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) {
            return new Response(['error' => 'User not authenticated.'], 401);
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');

        // Валідація
        if (empty($name) || empty($email)) {
            return new Response(['error' => 'Name and email are required.'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new Response(['error' => 'Invalid email format.'], 400);
        }

        // Перевіряємо, чи email не зайнятий іншим користувачем
        $existingUser = Users::findBy('email', $email);
        if ($existingUser && $existingUser['id'] != $userId) {
            return new Response(['error' => 'Email already taken.'], 400);
        }

        $updated = Users::update($userId, [
            'name' => $name,
            'email' => $email,
        ]);

        if ($updated) {
            return new Response(['message' => 'Profile updated successfully.']);
        } else {
            return new Response(['error' => 'Failed to update profile.'], 500);
        }
    }
}
