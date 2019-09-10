<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="icon" href="img/sgfx_line_blue.png">
    <title>Fox Lair</title>

    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap-grid.css">
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap-reboot.css">

    <script src="node_modules/jquery/dist/jquery.js"></script>
    <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.js"></script>

    <script src="js/elements.js"></script>
    <script>
        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
</head>
<body>
    <header class="container-fluid">
        <div class="row">
            <a href='/' class="col-6 d-flex align-items-center" id="logo">
                <img src="img/sgfx_line_blue.png" alt="sgfx-logo">
                <span>SGFX</span>
            </a>
            <div class="col-6" id="page-title">
                <?php
                    if ($_GET['page'] != null) {
                        echo $_GET['page'];
                    } else {
                        echo 'Main';
                    }
                ?>
            </div>
        </div>
    </header>

    <div class="container-fluid p-0" id="main">
        <?php
        if ($_GET['page'] == null) {
            require('req/main.php');
        } elseif (file_exists('req/' . $_GET['page'] . '.php')) {
            require('req/' . $_GET['page'] . '.php');
        }
        ?>
    </div>

    <footer class="container-fluid">
        <div class="row">
            <div class="col-12 text-right" id="quotes">
                <span id="quotes-text"></span>
                <span id="quotes-number">[0/0]</span>
            </div>
        </div>
        <script>
            let quotes = new Quotes();
        </script>
    </footer>
</body>
</html>