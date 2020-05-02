<template>
    <div id="chat">
        <div v-if="!$store.state.session.isConnected">
            <h1>Авторизуйтесь для продолжения</h1>
        </div>
        <div v-else>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Chat"
    }
</script>

<style scoped>
    #chat {
        text-align: center;
    }
</style>