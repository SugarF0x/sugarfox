<template>
    <div class="quote noHighlight d-inline-flex align-items-center">
        <div
            class="quote__text"
            :class="{disabledAction: !$store.state.session.isConnected}"
            :style="{opacity: opacity}"
            @click="getQuote(true)"
        >
            {{quote}}
        </div>
        <div class="quote__number">
            [{{id}} / {{max}}]
        </div>
        <div class="quote__refresh">
            <input
                type="checkbox"
                id="checkbox"
                v-model="autoRefresh"
                v-show="false"
            >
            <label
                for="checkbox"
                title="Авто обновление цитат"
            >
                <font-awesome-icon
                    icon="sync-alt"
                    style="font-size: 0.65em"
                    :class="{quote__number : !autoRefresh}"
                />
            </label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Quotes",
        data() {
            return {
                quote: '-',
                id: 0,
                max: 0,
                autoUpdate: true, // refresh
                opacity: 1,
                autoRefresh: true // auto fetch
            }
        },
        methods: {
            getQuote(manual) {
                if (manual) {
                    this.autoUpdate = false;
                }
                this.$root.getJson('/api/quotes/random')
                    .then(data => {
                        if (data.result) {
                            this.quote = data.quote;
                            this.id    = data.id;
                            this.max   = data.max;
                        } else {
                            this.quote = data.msg;
                            this.autoRefresh = false;
                        }
                        setTimeout(() => {this.fade(0)},250);
                    })
                    .catch(() => {
                            this.quote = 'Ошибка: не удалось получить информацию с сервера';
                            this.id    = 0;
                            this.max   = 0;
                            this.autoRefresh = false;
                    })
            },
            fade(state = this.opacity) {
                if (state) {
                    this.opacity = 0;
                } else {
                    this.opacity = 1;
                }
            }
        },
        mounted() {
            this.getQuote();
            setInterval( () => {
                if (this.autoUpdate && this.autoRefresh) {
                    this.fade();
                    setTimeout(() => {
                        this.getQuote();
                    }, 250);
                } else {
                    this.autoUpdate = true;
                }
            },3500);
        }
    }
</script>

<style scoped lang="less">
    .disabledAction {
        cursor: not-allowed !important;
    }
    .quote {
        > * {
            display: inline-block;
            padding: 0 0.2rem;
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
            max-width: 70vw;
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