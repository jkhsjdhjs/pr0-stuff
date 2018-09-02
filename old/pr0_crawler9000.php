<?php

// vong flummi her <3

$sql = new mysqli("localhost", "pr0", "qFVW8yf7pZpDwW4V");
$abfrage = $sql->query("select max(id) as idmax from `pr0`.`id_by_image` limit 1");
$newest = ($abfrage->num_rows > 0)?$abfrage->fetch_object()->idmax:0;
echo "newest: {$newest}\n";
$stmt = $sql->prepare("insert into `pr0`.`id_by_image` (`id`, `image`, `source`, `down`, `up`, `user`) values (?, ?, ?, ?, ?, ?)");

$timer = microtime(true);
$id = $down = $up = $new = 0;
$image = $source = $user = "";

$stmt->bind_param("issiis", $id, $image, $source, $down, $up, $user);
$run = true;

$sql->query("start transaction");
do {
	$page = json_decode(file_get_contents("http://pr0gramm.com/api/items/get/?flags=7&newer={$newest}"), true);
	if(array_key_exists("items", $page)) {
		if(count($page['items'] > 0)) {
			foreach($page['items'] as $item) {
				$id = intval($item['id']);
				$image = $item['image'];
				$source = $item['source'];
				$down = intval($item['down']);
				$up = intval($item['up']);
				$user = $item['user'];
				$stmt->execute();
				$new++;
			}
			if($id <= $newest)
				$run = false;
			$newest = $id;
		}
	}
} while($run);

$stmt->close();
$sql->query("commit");
echo "done. {$new} new. took ".round(microtime(true)-$timer, 5)." seconds\n";

