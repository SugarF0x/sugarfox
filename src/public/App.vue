<template>
    <div>
        <Header></Header>
        <div id="main" class="container pt-5 text-center">
            <PentaLink disabled img="img/main/community-chest.webp" desc="Общественная казна"></PentaLink>
            <PentaLink disabled img="img/main/geekbrains.webp" desc="Geekbrains"></PentaLink>
            <PentaLink disabled img="img/main/minecraft.webp" desc="Minecraft"></PentaLink>
            <PentaLink disabled img="img/main/snake.webp" desc="Змейка"></PentaLink>
            <PentaLink disabled img="img/main/wedding.webp" desc="Свадьба"></PentaLink>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import PentaLink from './components/PentaLink.vue'
    import Header from './components/Header.vue'
    import Footer from './components/Footer.vue'

    export default {
        data() {
            return {

            }
        },
        components: {
            PentaLink,
            Header,
            Footer
        }
    }
</script>

<style lang="less" src="./styles/main.less"></style>