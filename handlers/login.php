<?php
if (isset($_POST['domain']) && $_POST['domain']) {
    $domain  = $_POST['domain'];
    $domains = file("../data/frup-users.txt", FILE_IGNORE_NEW_LINES);
    if (in_array($domain,$domains)) {
        echo 'SUCCESS';
    }
}