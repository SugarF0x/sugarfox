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
            --color:      #FFFFFF; // text
            --bar:        #181b1f; // top and bottom bar
            --bg:         #282b2f; // general background
            --el:         #373b3e; // background for elements
            --action:     #484b4e; // same for borders
            --hover:      #494d50; // same for input areas
            --highlight:  #3e4144; // do i need this? it's like alt-hover

            --alt-action: #4c4c4c;
            --alt-hover:  #6b6b6c;
            --alt-bg:     #43464a;
        }
    }

    .lightmode {
        * {
            --color:      #000000; // text
            --bar:        #4682b4; // top and bottom bar
            --bg:         #ffffff; // general background
            --el:         #ffffff; // background for elements
            --action:     #479acd; // same for borders
            --hover:      #ffffff; // same for input areas
            --highlight:  #dcdcdc; // do i need this? it's like alt-hover

            --alt-action: #6ba4c1;
            --alt-hover:  #dcdcdc;
            --alt-bg:     #f0f8ff;
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