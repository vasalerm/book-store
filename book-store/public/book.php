<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = 'localhost'; // адрес сервера 
$database = 'book-stock'; // имя базы данных
$user = 'postgres'; // имя пользователя
$password = 'qwerty'; // пароль
$port = 5433; // Нестандартный порт

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$database", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(array("error" => "Database connection failed: " . $e->getMessage())));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    // Извлекаем данные из тела запроса
    $book_name = $input['book_name'];
    $author_id = $input['author_id'];
    $price = $input['price'];
    $quantity = $input['quantity'];

    if (empty($book_name) || empty($author_id) || empty($price) || !isset($quantity)) {
        http_response_code(400);
        echo json_encode(array("error" => "Book name, author id, price, and quantity are required"));
        exit;
    }

    try {
        // Вставка данных о книге
        $stmt = $pdo->prepare("INSERT INTO books (name, authors_id) VALUES (:name, :authors_id)");
        $stmt->bindParam(':name', $book_name);
        $stmt->bindParam(':authors_id', $author_id);
        $stmt->execute();

        $book_id = $pdo->lastInsertId();

        // Вставка данных о запасе
        $stmt = $pdo->prepare("INSERT INTO stock (books_id, price, quantity) VALUES (:books_id, :price, :quantity)");
        $stmt->bindParam(':books_id', $book_id);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->execute();

        echo json_encode(array("success" => "Book and stock added successfully"));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    }
}
?>
