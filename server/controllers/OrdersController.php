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

    public function createFromCart()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $cart = Carts::findBy('user_id', $userId);
        if (!$cart) {
            return new Response(['error' => 'Cart is empty.'], 400);
        }

        $cartId = $cart['id'];
        $cartItems = CartItems::getItemsByCartIdWithProductDetails($cartId);
        if (empty($cartItems)) {
            return new Response(['error' => 'Cart is empty.'], 400);
        }

        $totalAmount = 0.00;
        foreach ($cartItems as $item) {
            $totalAmount += $item['price'] * $item['quantity'];
        }

        $orderId = Orders::createFromCart($userId, $cartItems, $totalAmount);
        if (!$orderId) {
            return new Response(['error' => 'Failed to create order.'], 500);
        }

        CartItems::deleteByCartId($cartId);

        return new Response([
            'message' => 'Order created successfully.',
            'order_id' => $orderId,
            'total_amount' => number_format($totalAmount, 2, '.', '')
        ]);
    }

    public function getUserOrders()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $orders = Orders::findAllByUserId($userId);
        foreach ($orders as &$order) {
            $order['items'] = OrderItems::getItemsByOrderIdWithProductDetails($order['id']);
        }

        return new Response([
            'orders' => $orders
        ]);
    }

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

    public function getAllOrders()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $user = Users::find($userId);
        if (!$user || !$user['isAdmin']) {
            return new Response(['error' => 'Access denied.'], 403);
        }

        $orders = Orders::all();
        foreach ($orders as &$order) {
            $order['items'] = OrderItems::getItemsByOrderIdWithProductDetails($order['id']);
            $orderUser = Users::find($order['user_id']);
            $order['user_email'] = $orderUser['email'] ?? 'Unknown';
        }

        return new Response([
            'orders' => $orders
        ]);
    }

    public function updateOrderStatus($params) 
    {
        $orderId = is_array($params) ? ($params['id'] ?? null) : $params;
        if (!$orderId || !is_numeric($orderId)) {
            return new Response(['error' => 'Invalid order ID.'], 400);
        }

        $orderId = (int)$orderId; 

        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $user = Users::find($userId);

        if (!$user || !$user['isAdmin']) { 
            error_log("Access denied - user is not administrator. User data: " . print_r($user, true));
            return new Response(['error' => 'Access denied.'], 403);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $status = $input['status'] ?? null;

        if (!$status || !in_array($status, ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])) {
            error_log("Invalid status: " . ($status ?? 'null'));
            return new Response(['error' => 'Valid status is required. Allowed: pending, processing, shipped, delivered, cancelled'], 400);
        }

        $order = Orders::find($orderId);
        if (!$order) {
            error_log("Order not found: " . $orderId);
            return new Response(['error' => 'Order not found.'], 404);
        }

        error_log("Attempting to update order " . $orderId . " to status: " . $status);
        $updated = Orders::update($orderId, ['status' => $status]);
        error_log("Update result: " . ($updated ? 'success' : 'failed'));

        if ($updated) {
            return new Response(['message' => 'Order status updated successfully.']);
        } else {
            return new Response(['error' => 'Failed to update order status.'], 500);
        }
    }
}
