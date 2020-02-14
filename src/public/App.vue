<template>
    <div>
        <Header></Header>
        <div id="main" class="container pt-5 text-center">

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