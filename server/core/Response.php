<?php

namespace Core;

class Response
{
    protected $data;
    protected int $statusCode;
    protected array $headers = [];

    public function __construct($data, int $statusCode = 200)
    {
        $this->data = $data;
        $this->statusCode = $statusCode;
        $this->setHeader('Content-Type', 'application/json');
    }

    public function setHeader(string $name, string $value): self
    {
        $this->headers[$name] = $value;
        return $this;
    }

    public function send(): void
{
    // ✅ ВИПРАВЛЕНО: Додати CORS заголовки
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200); // ✅ ВИПРАВЛЕНО: змінено з 204 на 200
        exit;
    }

    if (!isset($this->headers['Content-Type'])) {
        header('Content-Type: application/json');
    }

    foreach ($this->headers as $name => $value) {
        header("{$name}: {$value}", true);
    }

    // ✅ ВИПРАВЛЕНО: Перевіряємо що статус код валідний
    $statusCode = $this->statusCode;
    if ($statusCode < 100 || $statusCode > 599) {
        error_log("Invalid status code: " . $statusCode . ". Using 200 instead.");
        $statusCode = 200;
    }
    
    http_response_code($statusCode);

    echo json_encode($this->data);
    exit;
}

    public static function json($data, int $statusCode = 200): self
    {
        return new self($data, $statusCode);
    }
}
