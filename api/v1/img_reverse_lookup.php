<?php

require_once "../config.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
if(@isset($_GET['image'])) {
    $image = $_GET['image'];
    $link = pg_connect(str_replace([";", "pgsql:"], [" "], $pgsql_dsn));
    $result = pg_query("SELECT post_id, file FROM reverse_lookup WHERE file LIKE '$image'");
    if(pg_num_rows($result) > 0) {
        $row = pg_fetch_object($result);
        $output = [
            "error" => "null",
            "image" => $row->file,
            "id" => intval($row->post_id)
        ];
    }
    else {
        $output = [
            "error" => "notFound",
            "code" => 404,
            "msg" => "Not Found"
        ];
    }
}
else {
    $output = [
        "error" => "badRequest",
        "code" => 400,
        "msg" => "Bad Request"
    ];
}
echo json_encode($output);
