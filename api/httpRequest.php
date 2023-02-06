<?php

class httpRequest {
    private function getEstatus() {  
        $estado = array(  
            200 => 'OK',  
            201 => 'Created',  
            202 => 'Accepted',  
            204 => 'No Content',  
            301 => 'Moved Permanently',  
            302 => 'Found',  
            303 => 'See Other',  
            304 => 'Not Modified',  
            400 => 'Bad Request',  
            401 => 'Unauthorized',  
            403 => 'Forbidden',  
            404 => 'Not Found',  
            405 => 'Method Not Allowed',  
            500 => 'Internal Server Error');  
        $response = ($estado[$this->_codEstado]) ? $estado[$this->_codEstado] : $estado[500];  
        return $response;  
    }

    public function sendResponse($data, $estado) {  
        $this->_codEstado = ($estado) ? $estado : 200;
        $this->setHeader();  
        echo $data;  
        exit;  
    }

    private function setHeader() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
    }
}
?>