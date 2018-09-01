<?php
	if($_SERVER['REQUEST_METHOD'] == 'GET') {
		$ol = $_GET['old_link'];
		if($ol != "") {
			//unerwünschte Leerzeichen entfernen
			$ol = str_replace(' ', '', $ol);
			if(strpos($ol, "#newest/*/") !== false) { //Format 1 (id bereits im Link enthalten)
				$error = false;
				$id = substr($ol, strpos($ol, "#newest/*/") + 10, strpos($ol, "/", strpos($ol, "#newest/*/") + 10) - strpos($ol, "#newest/*/") - 10);
				$nl = "http://pr0gramm.com/new/".$id;
			}
			else if(strpos($ol, "#newest/") !== false) { //Format 2 (mit Tag anstatt id)
				$error = false;
				//Informationen aus dem alten Link lesen
				$tag = substr($ol, strpos($ol, "#newest/") + 8, strpos($ol, "/", strpos($ol, "#newest/") + 8) - strpos($ol, "#newest/") - 8);
				$number = substr($ol, strpos($ol, $tag."/") + strlen($tag."/"), strpos($ol, "/", strpos($ol, $tag."/") + strlen($tag."/")) - strpos($ol, $tag."/") - strlen($tag."/"));
				$year = substr($ol, strpos($ol, $number."/") + strlen($number."/"), strpos($ol, "/", strpos($ol, $number."/") + strlen($number."/")) - strpos($ol, $number."/") - strlen($number."/"));
				$month = substr($ol, strpos($ol, $year."/") + strlen($year."/"), strpos($ol, "/", strpos($ol, $year."/") + strlen($year."/")) - strpos($ol, $year."/") - strlen($year."/"));
				$image = substr($ol, strpos($ol, $month."/") + strlen($month."/")); 
				//Pr0gramm API mit dem Tag des alten Links aufrufen; newer=0 für rückwärtige Sortierung
				$apiurl = "http://pr0gramm.com/api/items/get?newer=0&tags=".$tag;
				$content = file_get_contents($apiurl);
				//Informationen der API zu einzelnen Bildern aufspalten und im Array speichern
				$end[0] = 1;
				$i = 0;
				do {
					$i++;
					$start[$i] = strpos($content, "{", $end[$i - 1]);
					$end[$i] = strpos($content, "}", $start[$i]) + 1;
					$images[$i] = substr($content, $start[$i], $end[$i] - $start[$i]);
				} while($start[$i] > $start[$i - 1]);
				//Informationen zu den Bildern nach passenden Informationen des alten Links durchsuchen
				$count = $i - 1;
				for($i = 1; $i <= $count; $i++) {
					if(strpos($images[$i], $year) !== false && strpos($images[$i], $month) !== false && strpos($images[$i], $image) !== false) {
						//wenn gefunden, ID des Bildes auslesen
						$startpos = strpos($images[$i], "id\":") + 4;
						$endpos = strpos($images[$i], ",");
						$id = substr($images[$i], $startpos, $endpos - $startpos);
						break;
					}
				}
				if($id == "") { //Falls die ID leer ist, war der eingegebene Link ungültig
					$error = true;
				}
				else { //falls nicht, war er gültig, deshalb...
					//...neuen Link zusammenbauen
					$nl = "http://pr0gramm.com/new/".$tag."/".$id;
				}

			}
			else {
				$error = true;
			}
			//Sonderzeichen ersetzen, die bei HTML zu Problemen führen
			$ol = str_replace(">","&lt;",$ol);
			$ol = str_replace("<","&gt;",$ol);
			$nl = str_replace(">","&lt;",$nl);
			$nl = str_replace("<","&gt;",$nl);
		}
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title>
			Pr0gramm Link Converter v1.0
		</title>
	</head>
	<body>
		<header>
			<h2>Pr0gramm Link Converter v1.0</h2><br>
			Old Link Format -> New Link Format
		</header>
		<br>Format: http://pr0gramm.com/#newest/*/id/jahr/monat/bild
		<br>oder: http://pr0gramm.com/#newest/tag/zahl/jahr/monat/bild
		<br>
		<br>Das http://pr0gramm.com/ muss nicht unbedingt mit dabei sein, das mindeste ist #newest/ !
		<br>
		<br>
		<form action="eigene_version.php" method="GET">
			<input type="text" name="old_link" placeholder="Alter Link">
			<input type="submit" value="Neuen Link ausgeben">
		</form>
		<?php
			//Ausgabe der Informationen
			if(isset($ol) && $ol != "" && $_SERVER['REQUEST_METHOD'] == 'GET') {
				echo "<br>Input: <a href=\"$ol\">".$ol."</a>";
				echo "<br>";
				if(isset($nl) && $nl != "") {
					echo "Output: <a href=\"$nl\">".$nl."</a>";
				}
				if ($error == true) {
					echo "<span style=\"color: red;\">ERROR!</span> Richtiges Format? Gültiger Link? Ansonsten <a href=\"http://pr0gramm.com/user/jkhsjdhjs\">jkhsjdhjs PN schreiben</a>!";
				}
			}
		?>
	</body>
</html>
