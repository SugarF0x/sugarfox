<div style="margin-bottom: 20px; float: left;">

    <?php $goodD = $goods[$_GET['id']-1]; ?>
   
    <div id="openedProduct-img">
        <img src="<?php echo $goodD['img']; ?>">
    </div>
    <div id="openedProduct-content">
        <h1 id="openedProduct-name">
            <?php echo $goodD['name']; ?>
        </h1>
        <div id="openedProduct-desc">
            <?php echo $goodD['desc']; ?>
        </div>
        <div id="openedProduct-price">
            Цена: <?php echo $goodD['price']; ?> $
        </div>
    </div>
</div>