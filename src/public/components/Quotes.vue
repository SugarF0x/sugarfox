<template>
    <div
            class="quote d-inline-flex align-items-center">
        <div
                class="quote__text"
                :style="{opacity: opacity}"
                @click="getQuote(true)">
            {{quote}}
        </div>
        <div class="quote__number">
            [{{id}} / {{max}}]
        </div>
        <div
                class="quote__refresh">
            <input type="checkbox" id="checkbox" v-model="autoRefresh" v-show="false">
            <label
                    for="checkbox"
                    data-toggle="tooltip"
                    title="Авто обновление цитат"
                    data-delay='{ "show": 500, "hide": 100 }'>
                <font-awesome-icon
                        icon="sync-alt"
                        style="font-size: 0.65em"
                        :class="{quote__number : !autoRefresh}"/>
            </label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Quotes",
        data() {
            return {
                quote: 'undefined',
                id: 0,
                max: 0,
                autoUpdate: true,
                opacity: 1,
                autoRefresh: true
            }
        },
        methods: {
            getQuote(auto) {
                this.$parent.getJson('/api/quotes/random')
                    .then(data => {
                        this.quote = data.quote;
                        this.id    = data.id;
                        this.max   = data.max;
                    });
                if (auto) this.autoUpdate = false;
            }
        },
        mounted() {
            /* TODO:
                > make sure it only updates after having recieved another quote
                    perhaps this can be achieved via callback or .then() function of our beloved getJson()
             */
            this.getQuote();
            setInterval( () => {
                if (this.autoUpdate && this.autoRefresh) {
                    this.opacity = 0;
                    setTimeout( () => {
                        this.getQuote();
                        setTimeout(() => {
                            this.opacity = 1;
                        },100);
                    },400);
                } else {
                    this.autoUpdate = true;
                }
            },3500);
        }
    }
</script>

<style scoped lang="less">
    .quote {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
        > * {
            display: inline-block;
            padding: 0.2rem;
        }
        .quote__text:hover, .quote__refresh > label:hover {
            cursor: pointer;
        }
        .quote__text {
            transition-timing-function: ease-in-out;
            transition-duration: 0.25s;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .quote__number {
            font-size: 0.65em;
            opacity: 0.5;
        }
        .quote__refresh {
            label {
                margin: 0;
                display: flex;
                align-items: center;
            }
        }
    }
</style>