<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

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

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (!isset($_GET['order_id'])) {
        http_response_code(400);
        echo json_encode(array("error" => "Order ID not provided"));
        exit();
    }

    $orderId = $_GET['order_id'];

    try {
        $stmt = $pdo->prepare("SELECT books.name AS book_name, order_details.quantity, stock.price 
                                FROM order_details 
                                INNER JOIN books ON order_details.book_id = books.id 
                                INNER JOIN stock ON order_details.book_id = stock.books_id 
                                WHERE order_details.order_id = :orderId");
        $stmt->execute(array(':orderId' => $orderId));
        $orderDetails = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($orderDetails) {
            echo json_encode($orderDetails);
        } else {
            http_response_code(404);
            echo json_encode(array("error" => "Order details not found"));
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}
?>
