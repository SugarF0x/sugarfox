<template>
    <div>
        <Header></Header>
        <main>
            <section>
                <h1>Архив</h1>
                <PentaLink disabled img="img/main/geekbrains.webp" desc="Geekbrains"                          ></PentaLink>
                <PentaLink          img="img/main/snake.webp"      desc="Змейка"     link="./archive/snake"   ></PentaLink>
                <PentaLink          img="img/main/wedding.webp"    desc="Свадьба"    link="./archive/wedding" ></PentaLink>
            </section>
            <section>
                <h1>Другое</h1>
                <PentaLink disabled img="img/main/community-chest.webp" desc="Общественная казна" ></PentaLink>
                <PentaLink disabled img="img/main/minecraft.webp"       desc="Minecraft"          ></PentaLink>
            </section>
        </main>
        <Footer></Footer>
    </div>
</template>

<script>
    import PentaLink from './components/PentaLink.vue'
    import Header    from './components/Header.vue'
    import Footer    from './components/Footer.vue'

    export default {
        data() {
            return {

            }
        },
        components: {
            PentaLink,
            Header,
            Footer
        }
    }
</script>

<style lang="less" src="./styles/main.less"></style>