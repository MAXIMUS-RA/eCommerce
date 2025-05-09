<?php


class Carts extends BaseModel{

    protected static string $table = 'carts';

    /**
     * Знаходить або створює активний кошик для користувача.
     * @param int $userId
     * @return array|null Масив з даними кошика або null у разі помилки створення.
     */
    public static function findOrCreateByUserId(int $userId): ?array
    {
        // Цей findBy тепер буде безпечнішим, якщо він визначений нижче з перевіркою,
        // або якщо він успадковується від BaseModel, де перевірка вже є.
        $cart = static::findBy('user_id', $userId);
        if ($cart) {
            return $cart;
        }

        $cartId = static::create(['user_id' => $userId]);
        if ($cartId && !($cartId instanceof \Core\Response)) {
            return static::find($cartId);
        }
        error_log("Failed to create or find cart for user ID: " . $userId);
        return null;
    }

    /**
     * Знаходить кошик за певним полем.
     * @param string $field Назва поля
     * @param mixed $value Значення поля
     * @return array|null
     */
    // public static function findBy(string $field, $value): ?array
    // {
    //     // Додана перевірка PDO
    //     if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
    //         error_log("CRITICAL ERROR in " . __METHOD__ . " (Carts.php): BaseModel::\$pdo is not a valid PDO object.");
    //         // throw new \LogicException("BaseModel::\$pdo is not initialized in " . __METHOD__);
    //         return null;
    //     }

    //     $sql = "SELECT * FROM " . static::$table . " WHERE {$field} = :value LIMIT 1";
    //     $stmt = static::$pdo->prepare($sql);
    //     $stmt->execute(['value' => $value]);
        
    //     $result = $stmt->fetch(\PDO::FETCH_ASSOC);

    //     return $result ?: null;
    // }
    public static function findBy(string $field, $value): ?array
{
    // ВАЖЛИВА ПЕРЕВІРКА:
    if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
        error_log("CRITICAL ERROR in " . __METHOD__ . " (Carts.php): BaseModel::\$pdo is not a valid PDO object.");
        // Можна навіть кинути виняток тут, щоб побачити це в логах роутера
        // throw new \LogicException("BaseModel::\$pdo is not initialized in " . __METHOD__ . " (Carts.php)");
        return null; // Повернення null тут може призвести до помилки далі, якщо не перевіряти результат
    }

    $sql = "SELECT * FROM " . static::$table . " WHERE {$field} = :value LIMIT 1";
    try {
        $stmt = static::$pdo->prepare($sql);
        $stmt->execute(['value' => $value]);
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    } catch (\PDOException $e) {
        error_log("PDOException in " . __METHOD__ . " (Carts.php): " . $e->getMessage());
        return null; // Повертаємо null у разі помилки PDO
    }
}


}