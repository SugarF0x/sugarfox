<section class="row">
    <h3 class="col-12">Основа</h3>
    <div class='col-12' id="insert-projects"></div>
</section>

<section class="row">
    <h3 class="col-12">Архив</h3>
    <div class="col-12" id="insert-archive"></div>
</section>

<script>
    let elements = null;
    $.get('data/main-page.json', data => {
        elements = new PentaLink(data);
    }, 'json');
    elements = null;
</script>