<template>
    <footer>
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
        }
    }
</script>

<style scoped lang="less">
    footer {
        padding: 0.5rem;
        background-color: steelblue;
        color: white;

        min-height: 1rem;
        display: flex;
        justify-content: space-between;
    }
</style>