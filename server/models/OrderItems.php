<?php

class OrderItems extends BaseModel
{
    protected static string $table = 'orders_items';
    public static function getItemsByOrderIdWithProductDetails(int $orderId): array
    {
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (OrderItems.php): BaseModel::\$pdo is not a valid PDO object.");
            return [];
        }

        $sql = "SELECT oi.id, oi.quantity, oi.created_at as added_at,
                       p.id as product_id, p.name, p.description, p.price, p.image_path
                FROM " . static::$table . " oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = :order_id";
        try {
            $stmt = static::$pdo->prepare($sql);
            $stmt->execute(['order_id' => $orderId]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (\PDOException $e) {
            error_log("PDOException in " . __METHOD__ . " (OrderItems.php): " . $e->getMessage());
            return [];
        }
    }


    public static function findByOrderAndProduct(int $orderId, int $productId): ?array
    {
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (OrderItems.php): BaseModel::\$pdo is not a valid PDO object.");
            return null;
        }

        $sql = "SELECT * FROM " . static::$table . " WHERE order_id = :order_id AND product_id = :product_id";
        try {
            $stmt = static::$pdo->prepare($sql);
            $stmt->execute(['order_id' => $orderId, 'product_id' => $productId]);
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            return $result ?: null;
        } catch (\PDOException $e) {
            error_log("PDOException in " . __METHOD__ . " (OrderItems.php): " . $e->getMessage());
            return null;
        }
    }


    public static function deleteByOrderId(int $orderId): bool
    {
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (OrderItems.php): BaseModel::\$pdo is not a valid PDO object.");
            return false;
        }

        $sql = "DELETE FROM " . static::$table . " WHERE order_id = :order_id";
        try {
            $stmt = static::$pdo->prepare($sql);
            return $stmt->execute(['order_id' => $orderId]);
        } catch (\PDOException $e) {
            error_log("PDOException in " . __METHOD__ . " (OrderItems.php): " . $e->getMessage());
            return false;
        }
    }
}
