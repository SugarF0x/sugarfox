<header>
    <div class="header__topbar">
        <a href="">
            <img src="img/waxom.png" alt="Waxom.png" class="topbar__logo">
            
            <div class="topbar__name">
                Waxom
            </div>
        </a>

        <div class="topbar__navbar">
            <?php foreach($navbutts as $button): ?>
                <a href="<?php echo $button['link']?>">
                    <?php echo $button['text']?>
                </a>
            <?php endforeach ?>
            
            <div class="navbar__icons">
                <a href="#">
                    <i class="fas fa-shopping-bag"></i>
                </a>
                <a href="#">
                    <i class="fas fa-search"></i>
                </a>
            </div>
        </div>
    </div>
    
    <div class="cls"></div>
    
    <div class="header__main">
        <a href="#">
            <i class="fas fa-angle-left fa-7x"></i>
        </a>
        
        <article>
            <h2>Unique and Modern Design</h2>
            <h1>Portfolio PSD Template</h1>
            
            <p>
                Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.
            </p>
            
            <div class="button bold">GET STARTED</div>
        </article>
        
        <a href="#">
            <i class="fas fa-angle-right fa-7x"></i>
        </a>
    </div>
    
    <div class="header__bottom">
        <div class="wrap">
            <div class="bullet"></div>
        </div>
        <div class="wrap">
            <div class="bullet"></div>
        </div>
        <div class="wrap">
            <div class="bullet"></div>
        </div>
        <div class="wrap">
            <div class="bullet"></div>
        </div>
        <div class="wrap">
            <div class="bullet"></div>
        </div>
    </div>
</header>