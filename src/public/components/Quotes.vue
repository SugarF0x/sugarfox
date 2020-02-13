<template>
    <div class="quote" @click="getQuote(true)" :style="{'color': color}">
        <span class="quote__text" :style="{opacity: opacity}">
            {{quote}}
        </span>
        <span class="quote__number">
            <font-awesome-icon icon="sync-alt" />
            <br>
            [{{id}} / {{max}}]
        </span>
    </div>
</template>

<script>
    /* TODO:
        > Make a checkbox near quote__number that triggers auto refresh
            try to make it a nice looking one, not the default with a cross
            perhaps make it a refresh symbol that is grayed out when disabled
            and bright main text color when active
     */

    export default {
        name: "Quotes",
        data() {
            return {
                quote: 'undefined',
                id: 0,
                max: 0,
                autoUpdate: true,
                opacity: 1
            }
        },
        props: {
            color: {
                type: String,
                default: ''
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
            this.getQuote();
            setInterval( () => {
                if (this.autoUpdate) {
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
    }
    .quote:hover {
        cursor: pointer;
    }
</style>