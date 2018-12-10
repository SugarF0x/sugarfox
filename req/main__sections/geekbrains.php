<div class="main geekbrains">
    <section>
        <p>
            Проекты, над которыми работал в течение обучения на онлайн-курсах GeekBrains
        </p>
        
        <li>Расположены в порядке своего создания</li>
        <li>Некоторые проекты или макеты канули в лету, потому что я дебил<br>и только недавно стал нормально делать бекапы</li>
    </section>
    
    <section>
        <h1>Веб-разработка</h1>
        
        <div class="wrapper-section">
            <?php
                require('req/list.php');
                foreach($geekbrainsWEB as $ls):
            ?>
                <ul class="popout-ul">
                    <li class="gb__name">
                        <?php echo $ls['name'] ?>
                    </li>
                    
                    <li class="gb__img">
                        <img src="<?php echo $ls['img'] ?>" alt="<?php echo ($ls['name'] . '.png') ?>">
                    </li>
                    
                    <li class="gb__butts">
                        <button <?php if ($ls['psd']=='#') { echo disabled; } ?> onclick="window.location.href='<?php echo $ls['psd'] ?>'">Макет</button><button <?php if ($ls['site']=='#') { echo disabled; } ?> onclick="window.location.href='<?php echo $ls['site'] ?>'">Сайт</button>
                    </li>
                </ul>
            <?php endforeach; ?>
        </div>
    </section>
</div>