<?php

namespace Core;

class Router
{
    protected $staticRoutes = [];
    protected $dynamicRoutePatterns = [];

    public function __construct() {}

    public function loadRoutes(array $staticRoutes, array $dynamicRoutePatterns = [])
    {
        $this->staticRoutes = $staticRoutes;
        $this->dynamicRoutePatterns = $dynamicRoutePatterns;
    }

    public function direct($uri, $requestMethod)
    {
        $requestMethod = strtoupper($requestMethod);

        try {
            if (isset($this->staticRoutes[$requestMethod][$uri])) {
                $routeDetails = $this->staticRoutes[$requestMethod][$uri];
                $this->dispatchToController(
                    $routeDetails['controller'],
                    $routeDetails['action'],
                    $routeDetails['params'] ?? []
                );
                return;
            }

            if (isset($this->dynamicRoutePatterns[$requestMethod])) {
                foreach ($this->dynamicRoutePatterns[$requestMethod] as $pattern => $handlerDetails) {
                    if (preg_match($pattern, $uri, $matches)) {
                        $params = $handlerDetails['params'] ?? [];

                        foreach ($matches as $key => $value) {
                            if (is_string($key)) {
                                $params[$key] = $value;
                            }
                        }

                        if ($pattern === "#^/products/(\d+)$#" && isset($matches[1]) && !isset($params['id'])) {
                            $params['id'] = $matches[1];
                        }

                        $this->dispatchToController(
                            $handlerDetails['controller'],
                            $handlerDetails['action'],
                            $params
                        );
                        return;
                    }
                }
            }

            $this->handleNotFound($uri, $requestMethod);
        } catch (\Throwable $e) { 
            $this->handleError($e);
        }
    }

    protected function dispatchToController($controllerName, $action, $params = [])
    {
        $controllerFile = __DIR__ . "/../controllers/{$controllerName}.php";

        if (!file_exists($controllerFile)) {
            throw new \Exception("Controller file not found: {$controllerFile}");
        }
        require_once $controllerFile;

        if (!class_exists($controllerName)) {
            throw new \Exception("Controller class '{$controllerName}' not found.");
        }
        $controllerInstance = new $controllerName();

        if (!method_exists($controllerInstance, $action)) {
            throw new \Exception("Action '{$action}' not found in controller '{$controllerName}'.");
        }

        $response = $controllerInstance->$action($params);

        if ($response instanceof \Core\Response) {
            $response->send();
        } else {

            error_log("Controller '{$controllerName}::{$action}' did not return a Core\\Response object. Wrapping output.");
            (new \Core\Response($response, 200))->send();
        }
    }

    protected function handleNotFound($uri, $requestMethod)
    {
        (new \Core\Response([
            'status' => 'error',
            'message' => "Resource not found. URI: {$uri}, Method: {$requestMethod}"
        ], 404))->send();
    }

    protected function handleError(\Throwable $e)
    {
        error_log("Router Error: " . $e->getMessage() . "\n" . $e->getTraceAsString());

        $statusCode = ($e instanceof \PDOException) ? 503 : 500;

        $responseData = [
            'status' => 'error',
            'message' => 'An internal server error occurred.'
        ];


        (new \Core\Response($responseData, $statusCode))->send();
    }
}
