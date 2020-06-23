<template>
    <div id="quotesEditor">
        <div v-if="!$store.state.session.isConnected">
            <h1>Авторизуйтесь для продолжения</h1>
        </div>
        <div v-else>
            <h1>Страница редактора цитат</h1>
            <h3>как и всё остальное - в разработке</h3>
        </div>
    </div>
</template>

<script>
    export default {
        name: "QuotesEditor"
    }
</script>

<style scoped>
    #quotesEditor {
        background-color: var(--bg);
        color: var(--color);
        text-align: center;
    }
</style>