<footer>
    <p>
        <?php 
            $quotes = file("req/listings/quotes.txt");
            echo $quotes[rand(0,count($quotes)-1)];
        ?>
    </p>
</footer>