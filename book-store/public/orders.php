<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = 'localhost'; // Адрес сервера
$database = 'book-stock'; // Имя базы данных
$user = 'postgres'; // Имя пользователя
$password = 'qwerty'; // Пароль
$port = 5433; // Нестандартный порт

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$database", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(array("error" => "Database connection failed: " . $e->getMessage())));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // Извлекаем данные о заказе из запроса
    $token = $data['token'];
    $books = $data['books']; // массив книг в заказе в формате [{book_id, book_name, author_first_name, author_middle_name, author_last_name, price, quantity}]

    try {
        $pdo->beginTransaction();

        // Добавляем запись о заказе в таблицу Orders
        $stmt = $pdo->prepare("INSERT INTO Orders (token, time) VALUES (:token, NOW())");
        $stmt->execute(array(':token' => $token));
        $orderId = $pdo->lastInsertId();

        // Добавляем записи о каждой книге в заказе в таблицу Order_details
        foreach ($books as $book) {
            $stmt = $pdo->prepare("INSERT INTO Order_details (order_id, book_id, quantity) VALUES (:orderId, :bookId, :quantity)");
            $stmt->execute(array(':orderId' => $orderId, ':bookId' => $book['book_id'], ':quantity' => $book['quantity']));
        }

        $pdo->commit();

        echo json_encode(array("success" => "Order placed successfully"));
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    }
}
?>