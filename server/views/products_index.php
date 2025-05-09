<?php
echo "<h1>Products List</h1>";
if (!empty($products)) {
    echo "<ul>";
    foreach ($products as $product) {
        echo "<li>" . htmlspecialchars($product['name']) . " - $" . htmlspecialchars($product['price']) . "</li>";
    }
    echo "</ul>";
} else {
    echo "<p>No products found.</p>";
}
?>
