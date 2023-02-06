<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'httpRequest.php';
require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: text/html; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');

date_default_timezone_set('America/Bogota');

require_once 'google-api-php-client/src/Google_Client.php';
require_once 'google-api-php-client/src/contrib/Google_Oauth2Service.php';

class user extends httpRequest {
    const servidor = "localhost";

    const usuario_db = "u706710905_KmnjgF47ryD3wE";
    const pwd_db = "K6_efjgktFmcjWseF";
    const nombre_db = "u706710905_Dhg6Fkw34PZX";

    private $_conn = NULL;
    private $_metodo;
    private $_argumentos;

    private function conectDB() {
        try {
            $dsn = 'mysql:dbname=' . self::nombre_db . ';host=' . self::servidor. ';charset=utf8mb4';
            $this->_conn = new PDO($dsn, self::usuario_db, self::pwd_db, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES  \'UTF8\''));
        } catch (PDOException $e) {
            echo 'Falló la conexión: ' . $e->getMessage();
        }
    }

    public function callprocess($urlRest) {
        if (isset($urlRest[1])) {
            $url = explode('/', trim($urlRest[1]));
            $url = array_filter($url);
            $this->conectDB();
            $this->_metodo = $url[1];
            $this->_argumentos = $url;
            $this->_conn->query("SET NAMES 'utf8'");
            $this->_conn->query("SET time_zone = '-5:00'");
            $func = $this->_metodo;
            if ((int) method_exists($this, $func) > 0) {
                call_user_func(array($this, $this->_metodo));
            } else {
                $this->sendResponse(json_encode(array('status' => "error", "msg" => "petición no encontrada")), 404);
            }
        }
    }


    public function userSession() {
       if ($_SERVER['REQUEST_METHOD'] != "PUT" && $_SERVER['REQUEST_METHOD'] != "OPTIONS") {
            $this->sendResponse(json_encode(array('status' => "error", "msg" => "metodo no soportado")), 200);
        } else {
            $postFile = file_get_contents("php://input");
            $objectPost = json_decode($postFile);
            $secretString = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 16);
            $querySql = "INSERT INTO cp_user_session (user_session_token) VALUES ('" . $secretString . "')";
            $query = $this->_conn->prepare($querySql);
            $query->execute();
            $response['session'] = base64_encode(openssl_encrypt($secretString, 'aes-256-cbc', getallheaders()['key'], 0, base64_decode(getallheaders()['controller'])));
            $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 200);
        }
    }

    public function changeUrl() {
       if ($_SERVER['REQUEST_METHOD'] != "POST" && $_SERVER['REQUEST_METHOD'] != "OPTIONS") {
            $this->sendResponse(json_encode(array('status' => "error", "msg" => "metodo no soportado")), 200);
        } else {
            $postFile = file_get_contents("php://input");
            $objectPost = json_decode($postFile);
            $response['urlEncode'] = rtrim(strtr(base64_encode($objectPost->urlData), '+/', '-_'), '=');
            $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 200);
        }
    }

    public function redirectUrl() {
       if ($_SERVER['REQUEST_METHOD'] != "POST" && $_SERVER['REQUEST_METHOD'] != "OPTIONS") {
            $this->sendResponse(json_encode(array('status' => "error", "msg" => "metodo no soportado")), 200);
        } else {
            $postFile = file_get_contents("php://input");
            $objectPost = json_decode($postFile);
            $response['urlEncode'] = base64_decode(str_pad(strtr($objectPost->urlData, '-_', '+/'), strlen($objectPost->urlData) % 4, '=', STR_PAD_RIGHT));
            $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 200);
        }
    }

    public function createAccount() {
       if ($_SERVER['REQUEST_METHOD'] != "PUT" && $_SERVER['REQUEST_METHOD'] != "OPTIONS") {
            $this->sendResponse(json_encode(array('status' => "error", "msg" => "metodo no soportado")), 200);
        } else {
            $postFile = file_get_contents("php://input");
            $objectPost = json_decode($postFile);

            $querySql = "SELECT user_email FROM cyp_user WHERE user_email = '" . $objectPost->userEmail . "'";
            $query = $this->_conn->query($querySql);
            $filas = $query->fetchAll(PDO::FETCH_ASSOC);
            if (count($filas) > 0 ) {
                $response['status'] = "error";
                $response['msg'] = "Usuario previamente creado";
                $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 500);
            } else {
                $querySql = "INSERT INTO cyp_user (user_email, user_password, user_name) VALUES ('" . $objectPost->userEmail . "', '" . $objectPost->userPassword . "', '" . $objectPost->userName . "')";
                $query = $this->_conn->prepare($querySql);
                $query->execute();
                $response['key'] = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 16);
                $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 200);
            }
        }
    }

    public function createAccountInvite() {
       if ($_SERVER['REQUEST_METHOD'] != "PUT" && $_SERVER['REQUEST_METHOD'] != "OPTIONS") {
            $this->sendResponse(json_encode(array('status' => "error", "msg" => "metodo no soportado")), 200);
        } else {
            $postFile = file_get_contents("php://input");
            $objectPost = json_decode($postFile);

            $querySql = "SELECT user_email FROM cyp_user WHERE user_email = '" . $objectPost->userEmail . "'";
            $query = $this->_conn->query($querySql);
            $filas = $query->fetchAll(PDO::FETCH_ASSOC);
            if (count($filas) > 0 ) {
                $response['status'] = "error";
                $response['msg'] = "Usuario previamente creado";
                $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 500);
            } else {
                $querySql = "INSERT INTO cyp_user (user_email, user_password, user_name) VALUES ('" . $objectPost->userEmail . "', '" . $objectPost->userPassword . "', '" . $objectPost->userName . "')";
                $query = $this->_conn->prepare($querySql);
                $query->execute();

                $querySql = "INSERT INTO cyp_company_user (company_id, user_id, user_type_id) VALUES ('" . $objectPost->companyId . "', (SELECT user_id FROM cyp_user WHERE user_email = '" . $objectPost->userEmail . "'), '" . $objectPost->userProfile . "')";
                $query = $this->_conn->prepare($querySql);
                $query->execute();

                $response['key'] = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 16);
                $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 200);
            }
        }
    }


    public function  changePasswordAccount() {
       if ($_SERVER['REQUEST_METHOD'] != "PUT" && $_SERVER['REQUEST_METHOD'] != "OPTIONS") {
            $this->sendResponse(json_encode(array('status' => "error", "msg" => "metodo no soportado")), 200);
        } else {
            $postFile = file_get_contents("php://input");
            $objectPost = json_decode($postFile);

            $calOTP = substr(strtoupper(base64_encode(openssl_encrypt($objectPost->userEmail + date("Ymd"), 'aes-256-cbc', getallheaders()['key'], 0, base64_decode(getallheaders()['controller'])))),0,7);
            if($calOTP === $objectPost->userOTP) {
                $querySql = "UPDATE cyp_user SET user_password = '" . $objectPost->userPassword . "' WHERE user_email = '" . $objectPost->userEmail . "'";
                $query = $this->_conn->prepare($querySql);
                $query->execute();
                $response['key'] = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 16);
                $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 200);
            } else {
                $response['status'] = "error";
                $response['msg'] = "La OTP es invalida";
                $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 500);
            }
        } 
    }

    public function tokenJwt ($userObj) {
        $time = time();
        $token = array(
            'iat' => $time,
            'exp' => $time + (60*60),
            'data' => $userObj
        );

        $jwt = JWT::encode($token, 'people&culture', 'HS256');
        $decoded = JWT::decode($jwt, new Key('people&culture', 'HS256'));
        $response['key'] = $jwt;
        $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 200);
    }

    public function loginUser () {
        if ($_SERVER['REQUEST_METHOD'] != "POST" && $_SERVER['REQUEST_METHOD'] != "OPTIONS") {
            $this->sendResponse(json_encode(array('status' => "error", "msg" => "metodo no soportado")), 200);
        } else {
            $postFile = file_get_contents("php://input");
            $objectPost = json_decode($postFile);
            $this->_conn->query("SET lc_time_names = 'es_ES'");
            $querySql = "SELECT *, (SELECT SUM(point_value) FROM cyp_point WHERE cyp_point.user_id = user_id) AS point_value, DATE_FORMAT(user_date,'%M %d de %Y') AS user_create_date FROM cyp_user INNER JOIN cyp_level ON (cyp_level.level_id = cyp_user.level_id) WHERE user_email = '" . $objectPost->userEmail . "' AND user_password = '" . $objectPost->userPassword . "'";
            $query = $this->_conn->query($querySql);
            $filas = $query->fetchAll(PDO::FETCH_ASSOC);
            $num = count($filas);
            if ($num > 0) {
                $cont = 0;
                foreach ($filas as $row){
                    $userObj = new stdClass();
                    $userObj->userId = $row['user_id'];
                    $userObj->userName = $row['user_name'];
                    $userObj->userEmail = $row['user_email'];
                    $userObj->userTypeId = $row['user_type_id'];
                    $userObj->userNumberId = $row['user_number_id'];
                    $userObj->userPhone = $row['user_phone'];
                    $userObj->userStatus = $row['user_status'];
                    $userObj->userNickname = $row['user_nickname'];
                    $userObj->userAvatar = $row['user_avatar'];
                    $userObj->userCreateDate = $row['user_create_date'];
                    $userObj->levelName = $row['level_name'];
                    $userObj->pointValue = $row['point_value'];
                    $response[$cont] = $userObj;
                    $cont++;
                }
                $queryCompanySql = "SELECT * FROM cyp_company_user INNER JOIN cyp_company ON (cyp_company.company_id = cyp_company_user.company_id) INNER JOIN cyp_user_type ON (cyp_user_type.user_type_id = cyp_company_user.user_type_id) WHERE cyp_company_user.user_id = '" . $userObj->userId . "'";
                $queryCompany = $this->_conn->query($queryCompanySql);
                $filasCompany = $queryCompany->fetchAll(PDO::FETCH_ASSOC);
                $numCompany = count($filasCompany);
                if ($numCompany > 0) {
                    $cont = 0;
                    foreach ($filasCompany as $row){
                        $userObj->companyId = $row['company_id'];
                        $userObj->companyName = $row['company_name'];
                        $userObj->companyAddress = $row['company_address'];
                        $userObj->companyPhone = $row['company_phone'];
                        $userObj->companyDb = $row['company_db'];
                        $userObj->companyUserType = $row['user_type_id'];
                        $userObj->userTypeName = $row['user_type_name'];
                        $cont++;
                    }

                    $queryUserTypePrivilege = "SELECT * FROM cyp_user_type_privilege WHERE user_type_id = '" . $row['user_type_id'] . "'";
                    $queryTypePrivilege = $this->_conn->query($queryUserTypePrivilege);
                    $filasTypePrivilege = $queryTypePrivilege->fetchAll(PDO::FETCH_ASSOC);
                    $numTypePrivilege = count($filasTypePrivilege);
                    $cont = 0;
                    if ($numTypePrivilege > 0) {
                        foreach ($filasTypePrivilege as $row){
                            $typeObj = new stdClass();
                            $typeObj->privilegeId = $row['privilege_id'];
                            $responsePrivilege[$cont] = $typeObj;
                            $cont++;
                        }
                    }

                    $queryUserTypePrivilege = "SELECT * FROM cyp_user_privilege WHERE user_id = '" . $userObj->userId . "'";
                    $queryTypePrivilege = $this->_conn->query($queryUserTypePrivilege);
                    $filasTypePrivilege = $queryTypePrivilege->fetchAll(PDO::FETCH_ASSOC);
                    $numTypePrivilege = count($filasTypePrivilege);
                    if ($numTypePrivilege > 0) {
                        foreach ($filasTypePrivilege as $row){
                            $typeObj = new stdClass();
                            $typeObj->privilegeId = $row['privilege_id'];
                            $responsePrivilege[$cont] = $typeObj;
                            $cont++;
                        }
                    }
                    
                    $cont = 0;
                    foreach ($filasCompany as $row){
                        $userObj->listPrivilege = $responsePrivilege;
                        $response[$cont] = $userObj;
                        $cont++;
                    }
                    $this->tokenJwt($userObj);
                } else {
                    $response['status'] = "company";
                    $response['userId'] = $userObj->userId;
                    $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 500);
                }
                
            } else {
                $response['status'] = "error";
                $response['msg'] = "Credenciales incorrectas";
                $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 500);
            }
        }
    }


    public function refreshToken () {
        if ($_SERVER['REQUEST_METHOD'] != "POST" && $_SERVER['REQUEST_METHOD'] != "OPTIONS") {
            $this->sendResponse(json_encode(array('status' => "error", "msg" => "metodo no soportado")), 200);
        } else {
            $postFile = file_get_contents("php://input");
            $objectPost = json_decode($postFile);
            $this->_conn->query("SET lc_time_names = 'es_ES'");
            $querySql = "SELECT *, (SELECT SUM(point_value) FROM cyp_point WHERE cyp_point.user_id = user_id) AS point_value, DATE_FORMAT(user_date,'%M %d de %Y') AS user_create_date FROM cyp_user INNER JOIN cyp_level ON (cyp_level.level_id = cyp_user.level_id) WHERE user_id = '" . $objectPost->userId . "'";
            $query = $this->_conn->query($querySql);
            $filas = $query->fetchAll(PDO::FETCH_ASSOC);
            $num = count($filas);
            if ($num > 0) {
                $cont = 0;
                foreach ($filas as $row){
                    $userObj = new stdClass();
                    $userObj->userId = $row['user_id'];
                    $userObj->userName = $row['user_name'];
                    $userObj->userEmail = $row['user_email'];
                    $userObj->userTypeId = $row['user_type_id'];
                    $userObj->userNumberId = $row['user_number_id'];
                    $userObj->userPhone = $row['user_phone'];
                    $userObj->userStatus = $row['user_status'];
                    $userObj->userNickname = $row['user_nickname'];
                    $userObj->userAvatar = $row['user_avatar'];
                    $userObj->userCreateDate = $row['user_create_date'];
                    $userObj->levelName = $row['level_name'];
                    $userObj->pointValue = $row['point_value'];
                    $response[$cont] = $userObj;
                    $cont++;
                }
                $queryCompanySql = "SELECT * FROM cyp_company_user INNER JOIN cyp_company ON (cyp_company.company_id = cyp_company_user.company_id) WHERE cyp_company_user.user_id = '" . $userObj->userId . "'";

                $queryCompany = $this->_conn->query($queryCompanySql);
                $filasCompany = $queryCompany->fetchAll(PDO::FETCH_ASSOC);
                $numCompany = count($filasCompany);
                if ($numCompany > 0) {
                    $cont = 0;
                    foreach ($filasCompany as $row){
                        $userObj->companyId = $row['company_id'];
                        $userObj->companyName = $row['company_name'];
                        $userObj->companyAddress = $row['company_address'];
                        $userObj->companyPhone = $row['company_phone'];
                        $userObj->companyDb = $row['company_db'];
                        $userObj->companyUserType = $row['user_type_id'];
                        $response[$cont] = $userObj;
                        $cont++;
                    }
                    $this->tokenJwt($userObj);
                } else {
                    $response['status'] = "company";
                    $response['userId'] = $userObj->userId;
                    $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 500);
                }
            } else {
                $response['status'] = "error";
                $response['msg'] = "Credenciales incorrectas";
                $this->sendResponse(json_encode($response, JSON_UNESCAPED_UNICODE), 500);
            }
        }
    }
}
$rest = new user();
$rest->callprocess(explode('user.php', trim($_SERVER["REQUEST_URI"])));

?>