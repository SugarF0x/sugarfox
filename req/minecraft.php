<section class="downloads">
    <?php
        require('req/list.php');
        foreach($mcDownloads as $ls):
    ?>

    <ul class="popout-ul">
        <li class="downloads__name">
            <?php echo $ls['name'] ?>
        </li>

        <li class="downloads__image">
            <img src="<?php echo $ls['img'] ?>" alt="<?php echo $ls['name'] ?>.png">
        </li>

        <li class="downloads__desc">
            <?php echo $ls['desc'] ?>
        </li>

        <li class="downloads__date">
            Дата патча: 
            <?php echo $ls['date'] ?>
        </li>

        <!-- here i made it all in one line so as to avoid that fucking gap between the buttons that drove me crazy -->
        <li class="downloads__buttons">
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