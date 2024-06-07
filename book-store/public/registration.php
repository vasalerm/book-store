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
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$database", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(array("error" => "Database connection failed: " . $e->getMessage())));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $email = $data['email'];
    $phone = $data['phone'];
    $password = $data['password'];

    if (empty($password)) {
        http_response_code(400);
        echo json_encode(array("error" => "Password is required", "code" => 400));
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $token = bin2hex(random_bytes(16));

    try {
        $pdo->beginTransaction();

        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
        $checkStmt->execute(array(':email' => $email));
        if ($checkStmt->fetchColumn() > 0) {
            throw new Exception("Email already exists", 409);
        }

        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, phone, password, token) VALUES (:firstName, :lastName, :email, :phone, :password, :token)");
        $stmt->execute(array(
            ':firstName' => $firstName,
            ':lastName' => $lastName,
            ':email' => $email,
            ':phone' => $phone,
            ':password' => $hashedPassword,
            ':token' => $token
        ));

        $pdo->commit();

        http_response_code(201);
        echo json_encode(array("success" => "User registered successfully", "token" => $token));
    } catch (PDOException $e) {
        $pdo->rollBack();
        if ($e->getCode() == 23505) {
            http_response_code(409); 
            echo json_encode(array("error" => "Email already exists", "code" => 409));
        } else {
            http_response_code(500); 
            echo json_encode(array("error" => "Database error: " . $e->getMessage(), "code" => 500));
        }
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code($e->getCode()); 
        echo json_encode(array("error" => $e->getMessage(), "code" => $e->getCode()));
    }
}
?>
