<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <?php
        function extractElementsFromWebPage($webPage, $tagName) {
            //Creating a DOMDocument Object.
            $dom = new DOMDocument;

            //Parsing the HTML from the web page
            if ($dom->loadHTML($webPage)) {
                // Extracting the specified elements from the web page
                @$elements = $dom->getElementsByTagName($tagName);
                return $elements;
            }
            return FALSE;
        }

        function downloadURL($URL) {
            $webPage = file_get_contents ($URL);
            return $webPage;
        }

        $webPage = downloadURL("http://www.mozilla.org/");
        if ($webPage ) {
            $imageURLURLs = extractElementsFromWebPage($webPage, 'img');
            if ($imageURLURLs) {
                foreach ($imageURLURLs as $imageURL){
                    // Extracting the URLs
                    echo $imageURL->getAttribute('src'), "n";
                }
            }
            else {
                echo "Error in parsing the webPagen";
            }
        }
        else {
            echo "Error in downloading the webPagen";
        }
    ?>
</body>
</html>