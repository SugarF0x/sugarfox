<template>
    <footer class="container-fluid">
        <div class="row">
            <div class="col text-right">
                <Quotes></Quotes>
            </div>
        </div>
    </footer>
</template>

<script>
    import Quotes from './Quotes.vue'

    export default {
        name: "Footer",
        components: {
            Quotes
        }
    }
</script>

<style scoped lang="less">
    footer {
        font-size: 1rem;
        min-height: 1rem;
        position: absolute;
        bottom: 0;
    }
</style>