<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$database", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(array("error" => "Database connection failed: " . $e->getMessage())));
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);

        $stmt = $pdo->prepare("SELECT first_name, last_name, email, phone FROM users WHERE token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(array("error" => "User not found"));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Token not provided"));
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}
?>
