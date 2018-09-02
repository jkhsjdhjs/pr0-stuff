<?php
    $api = "http://pr0gramm.com/api/items/get?flags=15&newer=";
    $link = new mysqli("localhost", "pr0", "qFVW8yf7pZpDwW4V", "pr0");
    $query = "SELECT MAX(ID) AS ID FROM id_by_image";
    $result = $link->query($query);
    $row = $result->fetch_object();
    //$row = mysqli_fetch_object($result);
    $newest_id = $row->ID;
    $runs = 0;
    while(true) {
        $p = json_decode(file_get_contents($api . urlencode($newest_id)), true);
        if(is_array($p) && array_key_exists('items', $p)) {
            if(is_array($p['items'])) {
                if(count($p['items']) != 0) {
                    foreach($p['items'] as $item) {
                        $id = intval($item['id']);
                        $image = $item['image'];
                        $query = "INSERT INTO id_by_image (ID, IMAGE) VALUES ($id, '$image')";
                        $link->query($query);
                    }
                    $newest_id = $id;
                }
                else {
                    break;
                }
            }
        }
        $runs++;
    }
?>
