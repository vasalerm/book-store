<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$config = include('config.php');

$host = $config['host'];
$database = $config['database'];
$user = $config['user'];
$password = $config['password'];
$port = $config['port'];
try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$database", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(array("error" => "Database connection failed: " . $e->getMessage())));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

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

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        $stmt = $pdo->query("
            SELECT 
                books.id AS book_id, 
                books.name AS book_name, 
                authors.first_name AS author_first_name, 
                authors.middle_name AS author_middle_name, 
                authors.last_name AS author_last_name, 
                stock.price, 
                stock.quantity 
            FROM books 
            JOIN authors ON books.authors_id = authors.id 
            JOIN stock ON books.id = stock.books_id
        ");
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($books);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    }
}
?>
