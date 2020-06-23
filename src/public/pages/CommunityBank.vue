<template>
    <div id="communityBank">
        <div v-if="!$store.state.session.isConnected">
            <h1>Авторизуйтесь для продолжения</h1>
        </div>
        <div v-else>
            <h1>Страница общественного банка</h1>
            <h3>по-хорошему, переделать бы её</h3>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CommunityBank"
    }
</script>

<style scoped>
    #communityBank {
        background-color: var(--bg);
        color: var(--color);
        text-align: center;
    }
</style>