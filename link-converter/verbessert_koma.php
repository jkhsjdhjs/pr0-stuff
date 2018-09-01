	

    <?php
    function resolve ($l) {
        $base = 'http://pr0gramm.com/';
        if (preg_match('~#newest/\*/(\d+)~i', $l, $id)) {
            return $base . 'new/' . $id;
        }
        if (preg_match('~#newest/([^/]+)/\d+/(\d{4}/\d{2}/.+)$~i', $l, $tag)) {
            $p = json_decode(@file_get_contents($base . 'api/items/get?newer=0&tags=' . urlencode($tag[1])), true);
            if (is_array($p) && array_key_exists('items', $p)) {
                $len = strlen($tag[2]);
                foreach ($p['items'] as $item) {
                    if (substr($item['image'], 0, $len) == $tag[2]) {
                        return $base . 'new/' . $item['id'];
                    }
                }
            }
        }
        return false;
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
            <form action="" method="GET">
                <input type="text" name="old_link" placeholder="Alter Link">
                <input type="submit" value="Neuen Link ausgeben">
            </form>
            <?php
            if (isset($_GET['old_link'])) {
                $ol = trim($_GET['old_link']);
                $hOl = htmlspecialchars($ol);
                echo '<br>Input: <a href="' . $hOl . '">' . $hOl . '</a><br>';
                $nl = resolve($ol);
                if ($nl) {
                    $hNl = htmlspecialchars($nl);
                    echo 'Output: <a href="' . $hNl . '">' . $hNl . '</a>';
                } else {
                    echo '<span style="color: red;">ERROR!</span> Richtiges Format? Gültiger Link? Ansonsten <a href="http://pr0gramm.com/user/jkhsjdhjs">jkhsjdhjs PN schreiben</a>!';
                }
            }
            ?>
        </body>
    </html>

