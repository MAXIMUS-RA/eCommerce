<?php

class CartItems extends BaseModel
{
    protected static string $table = 'cart_items';

    public static function findByCartAndProduct(int $cartId, int $productId): ?array
    {
        // Додана перевірка PDO
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (CartItems.php): BaseModel::\$pdo is not a valid PDO object.");
            return null;
        }
        $sql = "SELECT * FROM " . static::$table . " WHERE cart_id = :cart_id AND product_id = :product_id";
        $stmt = static::$pdo->prepare($sql);
        $stmt->execute(['cart_id' => $cartId, 'product_id' => $productId]);
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public static function getItemsByCartIdWithProductDetails(int $cartId): array
    {
        // Додана перевірка PDO
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (CartItems.php): BaseModel::\$pdo is not a valid PDO object.");
            return []; 
        }
        $sql = "SELECT ci.id as id, ci.quantity,
                       p.id as product_id, p.name,p.description as description, p.price as price, p.image_path
                FROM " . static::$table . " ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.cart_id = :cart_id";
        try {
            $stmt = static::$pdo->prepare($sql);
            $stmt->execute(['cart_id' => $cartId]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (\PDOException $e) {
            error_log("PDOException in " . __METHOD__ . " (CartItems.php): " . $e->getMessage());
            return [];
        }
    }

    public static function updateQuantity(int $cartItemId, int $quantity): bool
    {
        // Додана перевірка PDO (якщо BaseModel::update не робить цього сам)
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (CartItems.php): BaseModel::\$pdo is not a valid PDO object for update.");
            return false;
        }
        // BaseModel::update очікує ID запису та масив даних
        return static::update($cartItemId, ['quantity' => $quantity]);
    }

    public static function deleteByCartId(int $cartId): bool
    {
        // Додана перевірка PDO
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (CartItems.php): BaseModel::\$pdo is not a valid PDO object for delete.");
            return false;
        }
        $sql = "DELETE FROM " . static::$table . " WHERE cart_id = :cart_id";
        $stmt = static::$pdo->prepare($sql);
        return $stmt->execute(['cart_id' => $cartId]);
    }
}
