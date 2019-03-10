<footer>
    <p>
        <?php
            require('req/list.php');
            echo $frupQuotes[rand(0,count($frupQuotes)-1)];
        ?>
    </p>
</footer>