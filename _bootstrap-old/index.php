<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="icon" href="img/sgfx_line_blue.webp">
    <title>Fox Lair</title>

    <link rel="stylesheet" href="styles/style.css">                                             <!-- My stylesheet -->
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css">                <!-- Bootstrap -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous">                                                              <!-- Font Awesome -->

    <script src="node_modules/jquery/dist/jquery.js"></script>                                  <!-- JQuery -->
    <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.js"></script>                  <!-- Bootstrap -->
    <script src="https://vk.com/js/api/openapi.js?162" type="text/javascript"></script>         <!-- VK API -->

    <script src="js/elements.js"></script>                                                      <!-- My Elements -->
    <script src="js/VK-integration.js"></script>                                                <!-- My VK Integration -->
    <script src="js/utils.js"></script>                                                         <!-- My Utils -->

    <script>
        $(document).ready(() => {
            setTimeout(() => {
                setInterval(() => {
                    $('[data-toggle="tooltip"]').tooltip();
                },1000)
            },250);
        });

        VK.init({
            apiId: 7123145
        });
    </script>
</head>
<body>
    <header class="container-fluid">
        <div class="row">
            <a href='/' class="col-4 d-flex align-items-center" id="logo">
                <img src="img/sgfx_line_blue.webp" alt="sgfx-logo">
                <span>SGFX</span>
            </a>
            <div class="col-4" id="page-title">
                <?php
                    if ($_GET['page'] != null) {
                        echo $_GET['page'];
                    } else {
                        echo 'Main';
                    }
                ?>
            </div>
            <div class="col-4 d-flex align-items-center justify-content-end" id="header-login">
                <div id="vk_auth"></div>
                <script type="text/javascript">
                    VK.Widgets.Auth("vk_auth", {"onAuth":"function(data) {alert('user '+data['uid']+' authorized');}"});
                </script>
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
            // let vk     = new VK_SGFX();
        </script>
    </footer>
</body>
</html>