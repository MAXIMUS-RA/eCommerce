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
        if (headers_sent($file, $line)) {
            error_log("Headers already sent in {$file} on line {$line}. Cannot send JSON response properly.");
        }
        header("Access-Control-Allow-Origin: http://localhost:5173");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(204); 
            exit;
        }

        if (!isset($this->headers['Content-Type'])) {
            header('Content-Type: application/json');
        }

        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}", true);
        }

        http_response_code($this->statusCode);

        echo json_encode($this->data);

        exit;
    }

    public static function json($data, int $statusCode = 200): self
    {
        return new self($data, $statusCode);
    }
}
