<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Core\Response;
use Core\AuthMiddleware;

class PaymentController
{
    private $liqpay;
    private $config;

    public function __construct()
    {
        $this->config = [
            'public_key' => 'sandbox_i66081638797',
            'private_key' => 'sandbox_DzR66fp95VytuRot0EFfyRyZYzrt01RUgldiB8dV',
            'currency' => 'UAH',
            'language' => 'uk',
            'success_url' => 'http://localhost:5173/payment/success',
            'result_url' => 'http://localhost:8000/payment/callback',
        ];

        $this->liqpay = new LiqPay($this->config['public_key'], $this->config['private_key']);
    }
    private function getAuthenticatedUserId(): ?int
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        return $_SESSION['user_id'] ?? null;
    }

    public function createPayment()
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) return new Response(['error' => 'User not authenticated.'], 401);

        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = $input['order_id'] ?? null;

        if (!$orderId) {
            return new Response(['error' => 'Order ID is required'], 400);
        }

        $order = Orders::find($orderId);
        if (!$order) {
            return new Response(['error' => 'Order not found'], 404);
        }


        if ($order['user_id'] != $userId) {
            return new Response(['error' => 'Access denied'], 403);
        }


        $paymentId = 'payment_' . $orderId . '_' . time();

        $params = [
            'action'         => 'pay',
            'amount'         => (float)$order['total_amount'],
            'currency'       => $this->config['currency'],
            'description'    => 'Оплата замовлення #' . $orderId,
            'order_id'       => $paymentId,
            'version'        => 3,
            'language'       => $this->config['language'],
            'result_url'     => $this->config['success_url'],
            'server_url'     => 'https://791b-109-251-239-20.ngrok-free.app/payment/callback',
            'sandbox'        => 1,
        ];

        try {
            $liqpayData = $this->liqpay->cnb_form_raw($params);

            return new Response([
                'payment_id'   => $paymentId,
                'order_id'     => $orderId,
                'data'         => $liqpayData['data'],
                'signature'    => $liqpayData['signature'],
                'amount'       => $order['total_amount'],
                'currency'     => $this->config['currency'],
            ]);
        } catch (Exception $e) {
            error_log('LiqPay payment creation error: ' . $e->getMessage());
            return new Response(['error' => 'Payment creation failed: ' . $e->getMessage()], 500);
        }
    }

    public function callback()
    {
        error_log('LiqPay callback received: ' . print_r($_POST, true));

        $data = $_POST['data'] ?? null;
        $signature = $_POST['signature'] ?? null;

        if (!$data || !$signature) {
            error_log('LiqPay callback: Missing data or signature');
            return new Response(['status' => 'error'], 400);
        }

        $expected_signature = $this->liqpay->str_to_sign($this->config['private_key'] . $data . $this->config['private_key']);
        if ($signature !== $expected_signature) {
            error_log('LiqPay callback: Invalid signature');
            return new Response(['status' => 'error'], 400);
        }

        $payment_data = json_decode(base64_decode($data), true);
        error_log('LiqPay payment data: ' . print_r($payment_data, true));

        $paymentId = $payment_data['order_id'] ?? null;

        if (preg_match('/payment_(\d+)_/', $paymentId, $matches)) {
            $orderId = (int)$matches[1];
        } else {
            error_log('LiqPay callback: Could not extract order ID from payment ID: ' . $paymentId);
            return new Response(['status' => 'error'], 400);
        }

        error_log("Extracted order ID: {$orderId}, Payment status: {$payment_data['status']}");

        if ($payment_data['status'] === 'success' || $payment_data['status'] === 'sandbox') {
            $updated = Orders::update($orderId, ['status' => 'paid']);
            error_log("Order update result: " . ($updated ? 'success' : 'failed'));

            if ($updated) {
                error_log("Order {$orderId} marked as paid via LiqPay");
                return new Response(['status' => 'success'], 200);
            } else {
                error_log("Failed to update order {$orderId} status");
                return new Response(['status' => 'error'], 500);
            }
        } else {
            error_log("LiqPay payment failed for order {$orderId}: " . $payment_data['status']);
            Orders::update($orderId, ['status' => 'payment_failed']);
        }

        return new Response(['status' => 'received'], 200);
    }
    public function checkStatus()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $paymentId = $input['payment_id'] ?? null;

        if (!$paymentId) {
            return new Response(['error' => 'Payment ID is required'], 400);
        }

        try {
            $status = $this->liqpay->api('request', [
                'action' => 'status',
                'version' => 3,
                'order_id' => $paymentId
            ]);

            return new Response($status);
        } catch (Exception $e) {
            error_log('LiqPay status check error: ' . $e->getMessage());
            return new Response(['error' => 'Status check failed'], 500);
        }
    }
}
