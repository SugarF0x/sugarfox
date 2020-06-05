<template>
    <div id="minecraft">
        <div class="modpack"
             v-for="n in modpacks"
        >
            <div class="name">{{n.name}}</div>
            <div class="img">
                <img :src="n.img" :alt="n.name">
            </div>
            <div class="desc">{{n.desc}}</div>
            <div class="buttons">
                <a :href="n.dlc">Клиент</a>
                <a :href="n.dls">Сервер</a>
                <a :href="n.dlb">Бэкап</a>
            </div>
        </div>
        <div class="modpack">
            <div class="name">Добавить сборку</div>
            <div class="new">
                <font-awesome-icon icon="plus-square"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Minecraft",
        data() {
            return {
                modpacks: ''
            }
        },
        mounted() {
            this.$root.getJson('/api/minecraft')
                .then(response =>  {
                    if (response.result) {
                        this.modpacks = response.data
                    }
                })
        }
    }
</script>

<style lang="less" scoped>
    #minecraft {
        background-color: var(--bg);
        color: var(--color);
        padding: 3rem 1rem;
        display: flex;
        flex-flow: row;
        max-width: 100vw;
        flex-wrap: wrap;
        justify-content: center;
        .modpack {
            width: 25rem;
            height: 30rem;
            display: flex;
            flex-flow: column;
            text-align: center;
            margin: 1rem;
            padding: 1rem;
            background-color: var(--el);
            border: .1rem solid var(--action);
            border-radius: 1rem;
            .name {
                font-size: 1.8em;
                padding-bottom: 1rem;
            }
            .desc {
                text-align: justify;
                margin: 1rem 0;
            }
            .buttons {
                flex: 1;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                margin: .5rem;
                a {
                    border: .1rem solid var(--action);
                    border-radius: 1rem;
                    background-color: var(--action);
                    padding: .8rem;
                    margin: 0 .3rem;
                    color: white;
                    text-decoration: none;
                }
                a:hover {
                    border: .1rem solid var(--hover)
                }
            }
            img {
                display: block;
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
                align-self: center;
            }
            .img {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 10rem;
            }
            .new {
                padding: 1rem;
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                > * {
                    width: 80%;
                    height: 80%;
                    color: var(--hover);
                }
            }
            .new:hover {
                cursor: not-allowed;
            }
        }
    }
</style>