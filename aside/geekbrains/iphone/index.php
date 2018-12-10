<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <link href="styles/styles.css" rel="stylesheet">
    <script src="scripts/jquery.js"></script>
    <script src="scripts/site.js"></script>
    <title>Frupblvke</title>
</head>
<body>
    <?php
        $goods = [
            ['id' => 1,
             'name' => 'iphone',
             'img' => '../images/goods/iphone.jpg',
             'desc' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo excepturi nostrum repellat laudantium distinctio ipsum voluptates consequatur unde, ullam eligendi.',
             'price' => 2000
            ],
            ['id' => 2,
             'name' => 'samsung',
             'img' => '../images/goods/samsung.jpg',
             'desc' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo excepturi nostrum repellat laudantium distinctio ipsum voluptates consequatur unde, ullam eligendi.',
             'price' => 1400
            ],
            ['id' => 3,
             'name' => 'htc',
             'img' => '../images/goods/htc.jpg',
             'desc' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo excepturi nostrum repellat laudantium distinctio ipsum voluptates consequatur unde, ullam eligendi.',
             'price' => 1200
            ]
        ];
    ?>
    
    <?php require('req/header.php'); ?>
    
    <!--  -->
    
    <?php
        if ($_GET == null) {
            require('req/main.php');
        } elseif ($_GET['page']=='shop') {
            require('req/shop.php');
        } elseif ($_GET['page']=='good') {
            require('req/good.php');
        };
    ?>
    
    <!--  -->
    
    <?php require('req/footer.php'); ?>

    </body>
</html>
