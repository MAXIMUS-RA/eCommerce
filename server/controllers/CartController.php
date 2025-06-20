<?php

use Core\Response;
use Core\AuthMiddleware;

class CartController
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

    private function getInputData(): array
    {
        if (!empty($_POST)) {
            return $_POST;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        return $input ?: [];
    }

    private function getUserCart(int $userId): ?array
    {
        $cart = Carts::findOrCreateByUserId($userId);
        if (!$cart) {
            error_log("CartController: Could not find or create cart for user {$userId}.");
            return null;
        }
        return $cart;
    }

    public function addItem()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $cart = $this->getUserCart($userId);
        if (!$cart) {
            return new Response(['error' => 'Could not retrieve or create cart.'], 500);
        }
        $cartId = $cart['id'];

        $input = $this->getInputData();
        $productId = $input['product_id'] ?? null;
        $quantity = (int)($input['quantity'] ?? 1);

        if (!$productId || $quantity <= 0) {
            return new Response(['error' => 'Product ID and valid quantity are required.'], 400);
        }

        $product = Product::find($productId);
        if (!$product) {
            return new Response(['error' => 'Product not found.'], 404);
        }
        if ($product['stock'] < $quantity) {
            return new Response(['error' => 'Not enough stock available.'], 400);
        }
        if ($product) {
            $newStock = $product['stock'] - $quantity;
            Product::update($productId, ['stock' => $newStock]);
        }


        $existingCartItem = CartItems::findByCartAndProduct($cartId, $productId);

        if ($existingCartItem) {
            $newQuantity = $existingCartItem['quantity'] + $quantity;
            CartItems::updateQuantity($existingCartItem['id'], $newQuantity);
        } else {
            CartItems::create([
                'cart_id' => $cartId,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }
        return $this->viewCart();
    }

    public function updateItem()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $cart = $this->getUserCart($userId);
        if (!$cart) return new Response(['error' => 'Cart not found for user.'], 404);
        $cartId = $cart['id'];

        $input = $this->getInputData();
        $productId = $input['product_id'] ?? null;
        $newQuantity = (int)($input['quantity'] ?? 0);

        if (!$productId) {
            return new Response(['error' => 'Product ID is required.'], 400);
        }

        $cartItem = CartItems::findByCartAndProduct($cartId, $productId);
        if (!$cartItem) {
            return new Response(['error' => 'Product not found in cart.'], 404);
        }
        $product = Product::find($productId);
        $quantityDiff = $newQuantity - $cartItem['quantity'];
        if ($quantityDiff > 0 && $product['stock'] < $quantityDiff) {
            return new Response(['error' => 'Not enough stock available.'], 400);
        }
        if ($product) {
            $newStock = $product['stock'] - $quantityDiff;
            Product::update($productId, ['stock' => $newStock]);
        }
        if ($newQuantity <= 0) {
            CartItems::delete($cartItem['id']);
        } else {
            CartItems::updateQuantity($cartItem['id'], $newQuantity);
        }
        return $this->viewCart();
    }

    public function removeItem()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $cart = $this->getUserCart($userId);
        if (!$cart) return new Response(['error' => 'Cart not found for user.'], 404);
        $cartId = $cart['id'];

        $input = $this->getInputData();
        $productId = $input['product_id'] ?? null;

        if (!$productId) {
            return new Response(['error' => 'Product ID is required.'], 400);
        }

        $cartItem = CartItems::findByCartAndProduct($cartId, $productId);
        if (!$cartItem) {
            return new Response(['error' => 'Product not found in cart.'], 404);
        }


        $product = Product::find($productId);
        if ($product) {
            $newStock = $product['stock'] + $cartItem['quantity'];
            Product::update($productId, ['stock' => $newStock]);
        }


        CartItems::delete($cartItem['id']);
        return $this->viewCart();
    }

    public function viewCart()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        error_log("CartController::viewCart() - Authenticated User ID: " . $userId);

        $cart = Carts::findBy('user_id', $userId);


        if (!$cart) {

            return new Response([
                'message' => 'Cart is empty.',
                'cart_items' => [],
                'total_unique_items' => 0,
                'total_items_count' => 0,
                'total_price' => 0.00
            ]);
        }
        $cartId = $cart['id'];
        $itemsWithDetails = CartItems::getItemsByCartIdWithProductDetails($cartId);

        $totalPrice = 0.00;
        $totalItemsCount = 0;
        if (is_array($itemsWithDetails)) {
            foreach ($itemsWithDetails as $item) {

                $currentPrice = $item['current_price'] ?? 0;
                $quantity = $item['quantity'] ?? 0;
                $totalPrice += $currentPrice * $quantity;
                $totalItemsCount += $quantity;
            }
        }
        return new Response([
            'message' => 'Current cart contents.',
            'cart_id' => $cartId,
            'cart_items' => $itemsWithDetails,
            'total_unique_items' => count($itemsWithDetails),
            'total_items_count' => $totalItemsCount,
            'total_price' => number_format($totalPrice, 2, '.', '')
        ]);
    }

    public function clearCart()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $cart = Carts::findBy('user_id', $userId);
        if ($cart) {
            CartItems::deleteByCartId($cart['id']);
        }

        return new Response(['message' => 'Cart cleared successfully.', 'cart_items' => []]);
    }
}
