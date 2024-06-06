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

    $search_field = $input['search_field'];
    $search_query = $input['search_query'];

    if (empty($search_field) || empty($search_query)) {
        http_response_code(400);
        echo json_encode(array("error" => "Search field and search query are required"));
        exit;
    }

    if ($search_field === 'author') {
        $sql = "
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
            WHERE 
                authors.first_name ILIKE :search_query OR 
                authors.middle_name ILIKE :search_query OR 
                authors.last_name ILIKE :search_query
        ";
    } elseif ($search_field === 'title') {
        $sql = "
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
            WHERE 
                books.name ILIKE :search_query
        ";
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Invalid search field"));
        exit;
    }

    try {
        $stmt = $pdo->prepare($sql);
        $search_query_param = '%' . $search_query . '%';
        $stmt->bindParam(':search_query', $search_query_param);
        $stmt->execute();
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($books);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    }
}
?>
