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
    public static function paginate(int $page = 1, int $perPage = 10): array
    {
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . ": BaseModel::\$pdo is not a valid PDO object for table " . (isset(static::$table) ? static::$table : 'unknown') . ".");
            throw new \LogicException("BaseModel::\$pdo is not initialized in " . __METHOD__);
        }

        // 1. Get total count of items
        $totalCountStmt = static::$pdo->query("SELECT COUNT(*) FROM " . static::$table);
        $totalItems = (int) $totalCountStmt->fetchColumn();

        // 2. Calculate total pages
        $totalPages = (int) ceil($totalItems / $perPage);

        // Ensure page is within valid range
        if ($page < 1) {
            $page = 1;
        }
        // If totalPages is 0 (no items), page 1 is fine. Otherwise, cap page at totalPages.
        if ($page > $totalPages && $totalPages > 0) {
            $page = $totalPages;
        }
        
        // Handle case where there are no items, page should still be 1
        if ($totalPages === 0 && $page > 1) {
            $page = 1;
        }


        // 3. Calculate offset
        $offset = ($page - 1) * $perPage;

        // 4. Fetch data for the current page
        $sql = "SELECT * FROM " . static::$table . " ORDER BY " . static::$primaryKey . " ASC LIMIT :perPage OFFSET :offset";
        $stmt = static::$pdo->prepare($sql);
        $stmt->bindValue(':perPage', $perPage, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];

        return [
            'data' => $data,
            'total_items' => $totalItems,
            'total_pages' => $totalPages,
            'current_page' => $page,
            'per_page' => $perPage,
        ];
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
            // Повернення null тут може приховати проблему ініціалізації PDO.
            // Розгляньте можливість кидання винятку, якщо це критична помилка конфігурації.
            throw new \LogicException("BaseModel::\$pdo is not initialized in " . __METHOD__);
        }

        // Припускаємо, що $field є довіреною назвою стовпця і не потребує додаткової санітизації тут.
        // Для PostgreSQL, якщо імена стовпців прості (нижній регістр, без спецсимволів), лапки не потрібні.
        // Якщо вони можуть бути змішаного регістру або містити спеціальні символи, їх слід брати у подвійні лапки: "\"{$field}\""
        // Щоб бути послідовним з Carts::findBy, який не бере $field в лапки, і припускаючи прості імена стовпців:
        $sql = "SELECT * FROM " . static::$table . " WHERE {$field} = :value LIMIT 1";

        // PDOException буде перехоплено роутером, якщо виникає помилка запиту
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
