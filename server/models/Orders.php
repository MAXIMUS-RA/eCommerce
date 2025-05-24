<?php

class Orders extends BaseModel
{
    protected static string $table = 'orders';
    public static function createFromCart(int $userId, array $cartItems, float $totalAmount): ?int
    {
        $orderId = static::create([
            'user_id' => $userId,
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'created_at' => date('Y-m-d H:i:s')
        ]);

        if ($orderId && !($orderId instanceof \Core\Response)) {
            // Копіюємо елементи з кошика в order_items
            foreach ($cartItems as $item) {
                OrderItems::create([
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            }
            return $orderId;
        }

        return null;
    }

    /**
     * Отримати всі замовлення користувача
     */
    public static function findAllByUserId(int $userId): array
    {
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (Orders.php): BaseModel::\$pdo is not a valid PDO object.");
            return [];
        }

        $sql = "SELECT * FROM " . static::$table . " WHERE user_id = :user_id ORDER BY created_at DESC";
        try {
            $stmt = static::$pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (\PDOException $e) {
            error_log("PDOException in " . __METHOD__ . " (Orders.php): " . $e->getMessage());
            return [];
        }
    }
}
