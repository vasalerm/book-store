<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

$config = include('config.php');

$host = $config['host'];
$database = $config['database'];
$user = $config['user'];
$password = $config['password'];
$port = $config['port'];

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$database", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(array("error" => "Database connection failed: " . $e->getMessage())));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $token = $data['token'];
    $books = $data['books'];

    try {
        $pdo->beginTransaction();
    
        $stmt = $pdo->prepare("INSERT INTO orders (token, time) VALUES (:token, NOW())");
        $stmt->execute(array(':token' => $token));
        $orderId = $pdo->lastInsertId(); 
    
        foreach ($books as $book) {
            $stmt = $pdo->prepare("SELECT quantity FROM stock WHERE books_id = :bookId");
            $stmt->execute(array(':bookId' => $book['book_id']));
            $stockQuantity = $stmt->fetchColumn();
    
            if ($stockQuantity < $book['quantity']) {
                throw new Exception("Недостаточно книг на складе");
            }
    
            $stmt = $pdo->prepare("UPDATE stock SET quantity = quantity - :quantity WHERE books_id = :bookId");
            $stmt->execute(array(':quantity' => $book['quantity'], ':bookId' => $book['book_id']));
    
            $stmt = $pdo->prepare("INSERT INTO order_details (order_id, book_id, quantity) VALUES (:orderId, :bookId, :quantity)");
            $stmt->execute(array(':orderId' => $orderId, ':bookId' => $book['book_id'], ':quantity' => $book['quantity']));
        }
    
        $pdo->commit();
    
        echo json_encode(array("success" => "Order placed successfully"));
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(array("error" => $e->getMessage()));
    }
}


if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        $token = str_replace('Bearer ', '', $authHeader);

        $stmt = $pdo->prepare("
            SELECT 
                Orders.id AS order_id, 
                Orders.time AS order_time,
                COALESCE(SUM(order_details.quantity * stock.price), 0) AS total_amount
            FROM 
                Orders 
            LEFT JOIN 
                order_details ON Orders.id = order_details.order_id
            LEFT JOIN
                stock ON order_details.book_id = stock.books_id
            WHERE 
                Orders.token = :token
            GROUP BY 
                Orders.id
        ");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($orders) {
            echo json_encode($orders);
        } else {
            http_response_code(404);
            echo json_encode(array("error" => "No orders found"));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Token not provided"));
    }
}


?>
