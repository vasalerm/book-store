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

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        $stmt = $pdo->prepare("SELECT id, CONCAT(first_name, ' ', middle_name, ' ', last_name) AS author FROM authors");
        $stmt->execute();
        $authors = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($authors === false) {
            $authors = [];
        }

        echo json_encode(array("success" => "Authors fetched successfully", "authors" => $authors));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    $first_name = $input['first_name'];
    $middle_name = $input['middle_name'];
    $last_name = $input['last_name'];

    if (empty($first_name) || empty($last_name)) {
        http_response_code(400);
        echo json_encode(array("error" => "First name and last name are required"));
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO authors (first_name, middle_name, last_name) VALUES (:first_name, :middle_name, :last_name)");
        $stmt->bindParam(':first_name', $first_name);
        $stmt->bindParam(':middle_name', $middle_name);
        $stmt->bindParam(':last_name', $last_name);
        $stmt->execute();

        echo json_encode(array("success" => "Author added successfully"));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    }
}
?>
