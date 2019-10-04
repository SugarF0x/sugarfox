<section class="row">
    <h3>Основа</h3>
    <div class='col-12 insert' id="insert-projects"></div>
</section>

<section class="row">
    <h3>Архив</h3>
    <div class="col-12 insert" id="insert-archive"></div>
</section>

<section class="row">
    <h3>
        #Фрупывке
        <i class="fas fa-info-circle" style="font-size:50%; color: gray; opacity: 0.5;" data-toggle="tooltip" data-html="true" data-placement="top" title="Эти функции доступны только членам #фрупывке"></i>
    </h3>
    <div class="col-12 insert" id="insert-frup"></div>
</section>

<script>
    let elements = null;
    $.get('data/main-page.json', data => {
        elements = new PentaLink(data);
    }, 'json');
    elements = null;
</script>