<template>
    <header class="container-fluid d-flex justify-content-between"
            :class="{darkmode : darkmode}"
    >
        <router-link to="/"
                     class="d-flex align-items-center"
                     id="logo"
        >
            <img src="/img/sgfx_line_blue.webp" alt="sgfx-logo">
            <span>SGFX</span>
        </router-link>
        <Login></Login>
    </header>
</template>

<script>
    import Login from './Login.vue'

    export default {
        name: "Header",
        components: {
            Login
        },
        computed: {
            darkmode() {
                return this.$store.state.darkmode
            }
        }
    }
</script>

<style scoped lang="less">
    .darkmode {
        background-color: #4a4b4c;
    }

    header {
        transition-duration: .25s;
        padding: 0.5rem;
        background-color: steelblue;
        color: white;
        #logo {
            height: 3rem;
            text-decoration: none;
            color: white;
            img {
                height: 2.5rem;
            }
            span {
                font-family: Kurbanistika, sans-serif;
                font-size: 2.5rem;
            }
        }
    }
</style>