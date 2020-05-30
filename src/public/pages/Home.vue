<template>
    <div id="home">
        <section>
            <h1>Архив</h1>
            <PentaLink img="img/main/geekbrains.webp"
                       desc="Geekbrains"
            ></PentaLink>
            <PentaLink img="img/main/snake.webp"
                       desc="Змейка"
                       link="./archive/snake"
            ></PentaLink>
            <PentaLink img="img/main/wedding.webp"
                       desc="Свадьба"
                       link="./archive/wedding"
            ></PentaLink>
        </section>
        <section>
            <h1>Другое</h1>
            <PentaLink img="img/main/minecraft.webp"
                       desc="Minecraft"
                       path="./minecraft"
            ></PentaLink>
        </section>
        <section>
            <h1>
                Интерактив<span title="Необходим вход" class="noHighlight">*</span>
            </h1>
            <PentaLink img="img/main/community-chest.webp"
                       desc="Общественная казна"
                       path="./community-bank"
                       auth-required="true"
            ></PentaLink>
            <PentaLink img="img/main/chat.webp"
                       desc="Чат"
                       path="./chat"
                       auth-required="true"
            ></PentaLink>
            <PentaLink img="img/main/quotes-editor.webp"
                       desc="Редактор цитат"
                       path="./quotes-editor"
                       auth-required="true"
            ></PentaLink>
        </section>
    </div>
</template>

<script>
    import PentaLink from '../components/PentaLink.vue'

    export default {
        name: "Home",
        components: {
            PentaLink
        }
    }
</script>

<style scoped lang="less">
    #home {
        background-color: var(--bg);
        color: var(--color);
        > section {
            padding: .5rem 1.5rem;
        }
        > section:nth-of-type(2n) {
            background-color: var(--bg-alt)
        }
    }
</style>