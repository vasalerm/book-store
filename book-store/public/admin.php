<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    $token = $input['token'];

    if (empty($token)) {
        http_response_code(400);
        echo json_encode(array("error" => "Token is required"));
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT r.name AS role 
                               FROM users u 
                               JOIN roles r ON u.roles_id = r.id 
                               WHERE u.token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user === false) {
            http_response_code(404);
            echo json_encode(array("error" => "User not found"));
            exit;
        }

        $role = $user['role'];
        $access = $role === 'Admin' ? true : false;

        echo json_encode(array("access" => $access));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    }
}
?>
