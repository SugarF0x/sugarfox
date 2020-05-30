<template>
    <div id="vueapp"
         :class="{darkmode : darkmode, lightmode : !darkmode}"
    >
        <Header></Header>
        <router-view></router-view>
        <Footer></Footer>
    </div>
</template>

<script>
    import Header from './components/Header.vue'
    import Footer from './components/Footer.vue'

    export default {
        computed: {
            darkmode() {
                return this.$store.state.darkmode
            }
        },
        components: {
            Header,
            Footer
        }
    }
</script>

<style lang="less">
    @import "./styles/main.css";

    /* TODO: review the palette
        > need to take a look ad my dark theme VK and copy it at my best abilities
            with all the backgrounds, highlights, borders and whatnot
     */

    .darkmode {
        * {
            --color:  white;
            --bg:     #1A1A1B;
            --bg-alt: #2b2b2c;
            --bar:    #4a4b4c;
        }
    }

    .lightmode {
        * {
            --color:  black;
            --bg:     white;
            --bg-alt: aliceblue;
            --bar:    steelblue;
        }
    }

    #vueapp {
        display: flex;
        flex-flow: column;
        min-height: 100vh;
        > div {
            flex: 1;
        }
    }
</style>