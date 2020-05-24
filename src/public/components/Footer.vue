<template>
    <footer :class="{darkmode : darkmode}">
        <Darkmode></Darkmode>
        <Quotes></Quotes>
    </footer>
</template>

<script>
    import Quotes   from './Quotes.vue';
    import Darkmode from './DarkmodeToggle.vue';

    export default {
        name: "Footer",
        components: {
            Quotes,
            Darkmode
        },
        computed: {
            darkmode() {
                return this.$store.state.darkmode;
            }
        }
    }
</script>

<style scoped lang="less">
    .darkmode {
        background-color: #4a4b4c;
    }

    footer {
        transition: .25s;
        padding: 0.5rem;
        background-color: steelblue;
        color: white;

        min-height: 1rem;
        display: flex;
        justify-content: space-between;
    }
</style>