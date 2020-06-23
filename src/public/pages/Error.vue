<template>
    <div id="error">
        <h1>Произошла ошибка</h1>
        <h3>Какая именно - не знаю</h3>
        <h5>да поможет вам бог</h5>
    </div>
</template>

<script>
    export default {
        name: "Error"
    }
</script>

<style scoped>
    #error {
        background-color: var(--bg);
        color: var(--color);
        text-align: center;
    }
</style>