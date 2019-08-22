<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="icon" href="img/sgfx_line.png">
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
            <div class="col-6 d-flex align-items-center" id="logo">
                <img src="img/sgfx_line_blue.png" alt="sgfx-logo">
                <span>SGFX</span>
            </div>
            <div class="col-6" id="section"></div>
        </div>
    </header>

		<!-- TODO: make each row of this a horizontal-scroller (or not :hmmm:) -->
    <div class="container-fluid p-0 main">
        <section class="row">
            <h3 class="col-12">Основа</h3>
            <div class='col-12' id="insert-projects"></div>
        </section>
        <section class="row">ass</section>
        <section class="row">ass</section>
    </div>

    <footer class="container-fluid">
        <div class="row">
            <div class="col-12 text-right" id="quotes">
                [Цитатки]
                <span>
                    [num/ber]
                </span>
            </div>
        </div>
    </footer>

    <script>
        let elements = null;
        $.get('lists/main-page.json', data => {
            elements = new PentaLink(data);
        }, 'json');
        elements = null;

        let quotes = new Quotes();
    </script>
</body>
</html>