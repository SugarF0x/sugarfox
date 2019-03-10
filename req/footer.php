<footer>
    <p>
        <?php
            require('req/list.php');
            echo $odmenQuotes[rand(0,count($odmenQuotes)-1)];
        ?>
    </p>
</footer>