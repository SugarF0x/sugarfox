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
    /* TODO: add dark mode checkbox
        > an example of such a checkbox can be seen here:
            URL: https://nuxtjs.org/
    */

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
        min-height: 1rem;
    }
</style>