<footer>
    <p>
        <?php
            $quotes = file("req/listings/quotes.txt");
            $quoteNumber = rand(0,count($quotes)-1);
            echo $quotes[$quoteNumber];
        ?>
    </p>
    <p>
        <?php
            echo ($quoteNumber+1) . "/" . count($quotes);
        ?>
    </p>
</footer>