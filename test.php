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
        $curl = curl_init('https://uc2d84f138f95b2db768f09a4ecb.dl.dropboxusercontent.com/cd/0/get/AdXZ8OxYmYJZZzm5jnPzpnrt_XTrfckgOF7dIOys9k4Hp2IZLG8-ftY7tg76wh7ahu8Wpss-16mi8V9V8FbCqh2ZZ2_fj2pFsLzwWeXEdpw33fcD-HhxltiXhpRummYz97A/file?_download_id=75594692198892630488005043702324298593249247273312545567383985745&_notify_domain=www.dropbox.com&dl=1');

        //don't fetch the actual page, you only want headers
        curl_setopt($curl, CURLOPT_NOBODY, true);

        //stop it from outputting stuff to stdout
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        // attempt to retrieve the modification date
        curl_setopt($curl, CURLOPT_FILETIME, true);

        $result = curl_exec($curl);

        if ($result === false) {
            die (curl_error($curl)); 
        }

        $timestamp = curl_getinfo($curl, CURLINFO_FILETIME);
        if ($timestamp != -1) { //otherwise unknown
            echo date("Y-m-d H:i:s", $timestamp); //etc
        } 
    ?>
</body>
</html>