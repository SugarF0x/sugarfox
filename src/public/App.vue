<template>
    <div>
        <Header></Header>
        <div id="main" class="container pt-5 text-center">
            {{msg}}
            <br>
            <PentaLink></PentaLink>
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
                msg: 'TEST MESSAGE OF GAY'
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