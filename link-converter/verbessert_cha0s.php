	

    <?php          
    function getNewLink($link) {
            $baseUrl = 'http://pr0gramm.com/new/';
            if( preg_match('#newest/\*/(\d+)#', $link, $m) ) {
                    return $baseUrl.$m[1];
            }
            else if( preg_match('#newest/(.*?)/\d+/(\d+)/(\d+)#', $link, $m) ) {
                    $yearAndDate = $m[2].$m[3];
                    $result = json_decode(file_get_contents('http://pr0gramm.com/api/items/get?tags='.$m[1]), true);
                    foreach( $result['items'] as $item ) {
                            if( date('Ym',$item['created']) === $yearAndDate ) {
                                    return $baseUrl.$item['id'];
                            }
                    }
            }
            return null;
    }
    ?>
     
    <!DOCTYPE html>
    <html>
    <head>
            <meta http-equiv="content-type" content="text/html; charset=UTF-8">
            <title>Pr0gramm Link Converter v9000.0</title>
    </head>
    <body>
            <header>
                    <h2>Pr0gramm Link Converter v1.0</h2>
                    <p>Old Link Format -> New Link Format</p>
            </header>
            <p>
                    Format: <code>http://pr0gramm.com/#newest/*/id/jahr/monat/bild</code><br/>
                    oder: <code>http://pr0gramm.com/#newest/tag/zahl/jahr/monat/bild</code>
            </p>
           
            <p>Das http://pr0gramm.com/ muss nicht unbedingt mit dabei sein, das mindeste ist <code>#newest/</code>!
     
            <form action="" method="GET">
                    <input type="text" name="link" placeholder="Alter Link">
                    <input type="submit" value="Neuen Link ausgeben">
            </form>
            <?php if( !empty($_GET['link']) && $newLink = getNewLink($_GET['link']) ) { ?>
                    <p>Input: <?php echo htmlspecialchars($_GET['link']); ?></p>
                    <p>Output: <a href="<?php echo htmlspecialchars($newLink); ?>"><?php echo htmlspecialchars($newLink); ?></a></p>
            <? } ?>
    </body>
    </html>

