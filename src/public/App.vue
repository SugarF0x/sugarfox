<template>
    <div class="container pt-5 text-center">
        {{msg}}
        <br>
        <PentaLink
            img="img/main/geekbrains.webp"
            desc="Geekbrains"
        ></PentaLink>
    </div>
</template>

<script>
    import PentaLink from './components/PentaLink.vue'

    export default {
        data() {
            return {
                msg: 'TEST MESSAGE OF GAY'
            }
        },
        components: {
            PentaLink
        }
    }
</script>

<style lang="less" src="./styles/main.less"></style>