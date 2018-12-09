<header>
    <a href="..">
        <img class="header__logo" src="img/sgfx.png" alt="sugar_f0x.jpg">
        
        <div class="header__name">
            sgfx
        </div>
    </a>
    
    <div class="header__section">
        <?php 
            if (is_null($_GET['section'])) {
                echo Главная;
            } else {
                echo $_GET['section'];
            };
        ?>
    </div>
    <div class="cls"></div>
    
</header>