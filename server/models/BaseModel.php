<?php

abstract class BaseModel
{
    protected static PDO $pdo;
    protected static string $table;
    protected static $primaryKey = "id";


    static function setConnection(PDO $pdo)
    {
        static::$pdo = $pdo;
    }

    static function all()
    {
        $stmt = static::$pdo->query("SELECT * FROM " . static::$table);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
    public static function paginate(int $page = 1, int $perPage = 10, $categoryId = null): array
    {
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (BaseModel.php): BaseModel::\$pdo is not a valid PDO object.");
            return [];
        }

        $params = [];
        $whereClause = "";

        if ($categoryId !== null && $categoryId !== 'null' && is_numeric($categoryId)) {
            $whereClause = " WHERE category_id = :category_id";
            $params['category_id'] = (int)$categoryId;
        }

        $countSql = "SELECT COUNT(*) FROM " . static::$table . $whereClause;
        try {
            $stmt = static::$pdo->prepare($countSql);
            $stmt->execute($params);
            $totalItems = (int) $stmt->fetchColumn();
        } catch (\PDOException $e) {
            error_log("PDOException in " . __METHOD__ . " (counting): " . $e->getMessage());
            return [];
        }

        $totalPages = (int) ceil($totalItems / $perPage);

        if ($page < 1) {
            $page = 1;
        }
        if ($page > $totalPages && $totalPages > 0) {
            $page = $totalPages;
        }
        if ($totalPages === 0 && $page > 1) {
            $page = 1;
        }

        $offset = ($page - 1) * $perPage;

        $sql = "SELECT * FROM " . static::$table . $whereClause . " ORDER BY name ASC LIMIT :limit OFFSET :offset";

        try {
            $stmt = static::$pdo->prepare($sql);

            // Bind parameters
            foreach ($params as $key => $value) {
                $stmt->bindValue(":$key", $value, \PDO::PARAM_INT);
            }

            $stmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);

            $stmt->execute();
            $data = $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];

            return [
                'data' => $data,
                'total_items' => $totalItems,
                'total_pages' => $totalPages,
                'current_page' => $page,
                'per_page' => $perPage
            ];
        } catch (\PDOException $e) {
            error_log("PDOException in " . __METHOD__ . " (fetching data): " . $e->getMessage());
            return [];
        }
    }

    static function find(int $id): ?array
    {
        $sql  = "SELECT * FROM " . static::$table . " WHERE " . static::$primaryKey . " = ?";
        $stmt = static::$pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public static function findBy(string $field, $value): ?array
    {
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . ": BaseModel::\$pdo is not a valid PDO object for table " . (isset(static::$table) ? static::$table : 'unknown') . ".");
            throw new \LogicException("BaseModel::\$pdo is not initialized in " . __METHOD__);
        }

        $sql = "SELECT * FROM " . static::$table . " WHERE {$field} = :value LIMIT 1";

        $stmt = static::$pdo->prepare($sql);
        $stmt->execute(['value' => $value]);
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $result ?: null;
    }

    static function create(array $data)
    {
        try {
            $fields       = array_keys($data);
            $placeholders = array_fill(0, count($fields), '?');
            $sql = sprintf(
                "INSERT INTO %s (%s) VALUES (%s)",
                static::$table,
                implode(',', $fields),
                implode(',', $placeholders)
            );
            $stmt = static::$pdo->prepare($sql);
            $stmt->execute(array_values($data));
            return (int) static::$pdo->lastInsertId();
        } catch (\PDOException $e) {
            error_log("DB CREATE ERROR: " . $e->getMessage());
            // Повертаємо Response з помилкою
            return new \Core\Response(['error' => 'Database error during user creation.', 'details' => $e->getMessage()], 500);
        }
    }

    static function update(int $id, array $data): bool
    {
        $sets = array_map(fn($f) => "$f = ?", array_keys($data));
        $sql  = sprintf(
            "UPDATE %s SET %s WHERE %s = ?",
            static::$table,
            implode(',', $sets),
            static::$primaryKey
        );
        $stmt = static::$pdo->prepare($sql);
        $params = array_merge(array_values($data), [$id]);
        return $stmt->execute($params);
    }

    static function delete(int $id): bool
    {
        $sql  = "DELETE FROM " . static::$table . " WHERE " . static::$primaryKey . " = ?";
        $stmt = static::$pdo->prepare($sql);
        return $stmt->execute([$id]);
    }
}
