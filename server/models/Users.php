<?php

class Users extends BaseModel
{
    protected static string $table = "users";

    public static function getByEmail($email)
    {

        $stmt = static::$pdo->prepare("SELECT * FROM " . static::$table . " WHERE email = :email");
        $stmt->execute([
            ':email' => $email
        ]);


        return $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
    }
}
