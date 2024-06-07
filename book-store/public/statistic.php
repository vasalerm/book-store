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
    try {
        $days = 7;

        $postData = json_decode(file_get_contents("php://input"), true);
        if(isset($postData['period']) && ($postData['period'] == '7' || $postData['period'] == '14')) {
            $days = $postData['period'];
        }

        $today = new DateTime();
        $lastDays = (new DateTime())->modify("-$days days");

        $stmt = $pdo->prepare("SELECT DATE(time) AS date, SUM(stock.price * order_details.quantity) AS earnings
                               FROM orders
                               JOIN order_details ON orders.id = order_details.order_id
                               JOIN stock ON order_details.book_id = stock.books_id
                               WHERE time BETWEEN :lastDays AND :todayEnd
                               GROUP BY DATE(time)
                               ORDER BY DATE(time)");
        $stmt->execute([':lastDays' => $lastDays->format('Y-m-d 00:00:00'), ':todayEnd' => $today->format('Y-m-d 23:59:59')]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data = [];
        $interval = new DateInterval('P1D');
        $period = new DatePeriod($lastDays, $interval, $today->modify('+1 day'));

        foreach ($period as $date) {
            $formattedDate = $date->format('Y-m-d');
            $data[$formattedDate] = 0;
        }

        foreach ($results as $result) {
            $data[$result['date']] = $result['earnings'];
        }

        $finalData = [];
        foreach ($data as $date => $earnings) {
            $finalData[] = ['date' => $date, 'earnings' => $earnings];
        }

        echo json_encode($finalData);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Database error: " . $e->getMessage()));
    }
}
?>
