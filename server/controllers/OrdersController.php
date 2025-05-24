<?php

use Core\AuthMiddleware;
use Core\Response;

class OrdersController
{
    public function __construct()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    private function getAuthenticatedUserId(): ?int
    {
        AuthMiddleware::checkAuthenticated();
        return $_SESSION['user_id'] ?? null;
    }

    /**
     * Створює замовлення з поточного кошика
     */
    public function createFromCart()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        // Отримуємо поточний кошик
        $cart = Carts::findBy('user_id', $userId);
        if (!$cart) {
            return new Response(['error' => 'Cart is empty.'], 400);
        }

        $cartId = $cart['id'];
        $cartItems = CartItems::getItemsByCartIdWithProductDetails($cartId);

        if (empty($cartItems)) {
            return new Response(['error' => 'Cart is empty.'], 400);
        }

        // Перевіряємо наявність товарів на складі
        foreach ($cartItems as $item) {
            $product = Product::find($item['product_id']);
            if (!$product || $product['stock'] < $item['quantity']) {
                return new Response([
                    'error' => "Недостатньо товару '{$item['name']}' на складі."
                ], 400);
            }
        }

        // Розрахунок загальної суми (використовуємо поточні ціни з БД)
        $totalAmount = 0.00;
        foreach ($cartItems as $item) {
            $totalAmount += $item['price'] * $item['quantity'];
        }

        // Створюємо замовлення
        $orderId = Orders::createFromCart($userId, $cartItems, $totalAmount);

        if (!$orderId) {
            return new Response(['error' => 'Failed to create order.'], 500);
        }

        // Зменшуємо кількість товарів на складі
        foreach ($cartItems as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $newStock = $product['stock'] - $item['quantity'];
                Product::update($item['product_id'], ['stock' => $newStock]);
            }
        }

        // Очищаємо кошик після успішного створення замовлення
        CartItems::deleteByCartId($cartId);

        return new Response([
            'message' => 'Order created successfully.',
            'order_id' => $orderId,
            'total_amount' => number_format($totalAmount, 2, '.', '')
        ]);
    }

    /**
     * Отримання всіх замовлень користувача
     */
    public function getUserOrders()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $orders = Orders::findAllByUserId($userId);

        // Додаємо товари до кожного замовлення
        foreach ($orders as &$order) {
            $order['items'] = OrderItems::getItemsByOrderIdWithProductDetails($order['id']);
        }

        return new Response([
            'orders' => $orders
        ]);
    }

    /**
     * Отримання конкретного замовлення
     */
    public function getOrder($orderId)
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $order = Orders::find($orderId);

        if (!$order || $order['user_id'] != $userId) {
            return new Response(['error' => 'Order not found.'], 404);
        }

        $order['items'] = OrderItems::getItemsByOrderIdWithProductDetails($orderId);

        return new Response(['order' => $order]);
    }

    /**
     * Отримання всіх замовлень (для адміністратора)
     */
    public function getAllOrders()
    {
        // Перевірка, чи користувач є адміністратором
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $user = Users::find($userId);
        if (!$user || !$user['is_administrator']) {
            return new Response(['error' => 'Access denied.'], 403);
        }

        $orders = Orders::all();

        // Додаємо товари та інформацію про користувача до кожного замовлення
        foreach ($orders as &$order) {
            $order['items'] = OrderItems::getItemsByOrderIdWithProductDetails($order['id']);
            $orderUser = Users::find($order['user_id']);
            $order['user_email'] = $orderUser['email'] ?? 'Unknown';
        }

        return new Response([
            'orders' => $orders
        ]);
    }

    /**
     * Оновлення статусу замовлення (для адміністратора)
     */
    public function updateOrderStatus($orderId)
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $user = Users::find($userId);
        if (!$user || !$user['is_administrator']) {
            return new Response(['error' => 'Access denied.'], 403);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $status = $input['status'] ?? null;

        // Використовуємо правильні статуси з вашої БД
        if (!$status || !in_array($status, ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])) {
            return new Response(['error' => 'Valid status is required. Allowed: pending, processing, shipped, delivered, cancelled'], 400);
        }

        $order = Orders::find($orderId);
        if (!$order) {
            return new Response(['error' => 'Order not found.'], 404);
        }

        $updated = Orders::update($orderId, ['status' => $status]);

        if ($updated) {
            return new Response(['message' => 'Order status updated successfully.']);
        } else {
            return new Response(['error' => 'Failed to update order status.'], 500);
        }
    }
}
