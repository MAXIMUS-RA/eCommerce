<?php


class Product extends BaseModel{

    protected static string $table = 'products';

    public static function findByCategory ($categoryId){
        if (!isset(static::$pdo) || !(static::$pdo instanceof \PDO)) {
            error_log("CRITICAL ERROR in " . __METHOD__ . " (Product.php): BaseModel::\$pdo is not a valid PDO object.");
            return [];
        }

        $sql = "SELECT * FROM " . static::$table . " WHERE category_id = :category_id ORDER BY created_at DESC";
        try {
            $stmt = static::$pdo->prepare($sql);
            $stmt->execute(['category_id' => $categoryId]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (\PDOException $e) {
            error_log("PDOException in " . __METHOD__ . " (Product.php): " . $e->getMessage());
            return [];
        }
    }
}