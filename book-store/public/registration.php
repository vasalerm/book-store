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

    // Хэширование пароля
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    try {
        // Начало транзакции
        $pdo->beginTransaction();

        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
        $checkStmt->execute(array(':email' => $email));
        if ($checkStmt->fetchColumn() > 0) {
            throw new Exception("Email already exists", 409);
        }

        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, phone, password) VALUES (:firstName, :lastName, :email, :phone, :password)");
        $stmt->execute(array(
            ':firstName' => $firstName,
            ':lastName' => $lastName,
            ':email' => $email,
            ':phone' => $phone,
            ':password' => $hashedPassword
        ));

        // Завершение транзакции
        $pdo->commit();

        http_response_code(201);
        echo json_encode(array("success" => "User registered successfully"));
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
