<section class="minecraft">
    <?php
        require('req/list.php');
        foreach($minecraft as $ls):
    ?>

    <ul class="popout-ul">
        <li class="minecraft__name">
            <?php echo $ls['name'] ?>
        </li>

        <li class="minecraft__image">
            <img src="<?php echo $ls['img'] ?>" alt="<?php echo $ls['name'] ?>.png">
        </li>

        <li class="minecraft__desc">
            <?php echo $ls['desc'] ?>
        </li>

        <li class="minecraft__date">
            Дата патча: 
            <?php echo $ls['date'] ?>
        </li>

        <!-- here i made it all in one line so as to avoid that fucking gap between the buttons that drove me crazy -->
        <li class="minecraft__buttons">
            <button <?php if ($ls['dlc']=='#') { echo disabled; } else { echo enabled; } ?> onclick="window.location.href='<?php echo $ls['dlc'] ?>'">
                Клиент
            </button><button <?php if ($ls['dls']=='#') { echo disabled; } else { echo enabled; } ?> onclick="window.location.href='<?php echo $ls['dls'] ?>'">
                Сервер
            </button><button <?php if ($ls['dlb']=='#') { echo disabled; } else { echo enabled; } ?> onclick="window.location.href='<?php echo $ls['dlb'] ?>'">
                Бэкап
            </button>
        </li>
    </ul>

    <?php 
        endforeach; 
    ?>
</section>