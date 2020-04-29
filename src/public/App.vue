<template>
    <div>
        <Header></Header>
        <main>
            <router-view></router-view>
        </main>
        <Footer></Footer>
    </div>
</template>

<script>
    import Header from './components/Header.vue'
    import Footer from './components/Footer.vue'

    export default {
        data() {
            return {

            }
        },
        components: {
            Header,
            Footer
        }
    }
</script>

<style lang="less" src="./styles/main.less"></style>