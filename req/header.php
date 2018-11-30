<header>
    <a href="#">
        <img class="header__logo" src="img/Sugar_F0x.jpg" alt="sugar_f0x.jpg">
        
        <div class="header__name">
            sgfx.ru
        </div>
    </a>
    
    <div class="header__section">
        <?php 
            if (is_null($_GET['section'])) {
                echo Main;
            } else {
                echo $_GET['section'];
            };
        ?>
    </div>
    <div class="cls"></div>
    
</header>