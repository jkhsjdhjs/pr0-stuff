<?php

require_once "../config.php";
require_once "api.php";

if($_SERVER["REQUEST_METHOD"] !== "GET")
    exit_response(405, "invalid_request_method");

if(!(isset($_GET["id"]) xor isset($_GET["file"])))
    exit_response(400, "bad_request");

if(isset($_GET["id"])) {
    $val = (int) $_GET["id"];
    if($val < 1 || (string) $val !== $_GET["id"])
        exit_response(400, "invalid_field_value", "id");
    $cols = ["post_id"];
}
else {
    if(!preg_match("/(\d{4}.+\..+)/", $_GET["file"], $matches))
        exit_response(400, "invalid_field_value", "file");
    $val = $matches[1];
    $cols = ["file", "fullsize"];
}

$dbh = db_conn($pgsql_dsn);

$query = $dbh->prepare("SELECT * FROM reverse_lookup WHERE " . implode(" OR ", array_map(function ($col) {
    return $col . " = ?";
}, $cols)));

if(!$query->execute(array_fill(0, count($cols), $val)))
    exit_response(500, "database_error");

$row = $query->fetch(PDO::FETCH_OBJ);
if(!$row)
    exit_response(200, "no_results");

$row->id = $row->post_id;
unset($row->post_id);

exit_response(200, null, null, $row);
