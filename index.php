<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="img/Blue%20Fox%20Paw%20Hollow.png">
    <link rel="stylesheet" href="styles/style.css">
    <title>Fox Lair</title>
</head>
<body>
    <?php require('req/header.php'); ?>
    
    <main>
        <?php
            if (is_null($_GET['section'])) {
                require('req/main.php');
            } elseif ($_GET['section']=='minecraft') {
                require('req/minecraft.php');
            } else {
                require('req/404.php');
            };
        ?>
    </main>
    
    <?php require('req/footer.php'); ?>
</body>
</html>