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
        min-height: 1rem;
        display: flex;
        justify-content: space-between;
    }
</style>