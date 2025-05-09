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

    static function find(int $id): ?array
    {
        $sql  = "SELECT * FROM " . static::$table . " WHERE " . static::$primaryKey . " = ?";
        $stmt = static::$pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    static function create(array $data): int
    {
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
