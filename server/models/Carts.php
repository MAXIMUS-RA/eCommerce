<?php


class Carts extends BaseModel{

    protected static string $table = 'carts';
    public static function findOrCreateByUserId(int $userId): ?array
    {
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
    public static function findBy(string $field, $value): ?array
{
    if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
        error_log("CRITICAL ERROR in " . __METHOD__ . " (Carts.php): BaseModel::\$pdo is not a valid PDO object.");
        return null; 
    }
    $sql = "SELECT * FROM " . static::$table . " WHERE {$field} = :value LIMIT 1";
    try {
        $stmt = static::$pdo->prepare($sql);
        $stmt->execute(['value' => $value]);
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    } catch (\PDOException $e) {
        error_log("PDOException in " . __METHOD__ . " (Carts.php): " . $e->getMessage());
        return null;
    }
}


}