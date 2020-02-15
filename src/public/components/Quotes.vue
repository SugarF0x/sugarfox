<template>
    <div
            class="quote noHighlight d-inline-flex align-items-center">
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
                this.$root.getJson('/api/quotes/random')
                    .then(data => {
                        this.quote = data.quote;
                        this.id    = data.id;
                        this.max   = data.max;
                    });
                if (auto) this.autoUpdate = false;
            }
            /* TODO:
                > make another method for updating the quote that fades out, fetches and only then fades in
                    if no data is fetched within update window - insert error and stop auto update
             */
        },
        mounted() {
            /* TODO:
                > make sure it only updates after having received another quote
                    perhaps this can be achieved via callback or .then() function of our beloved getJson()
                > make autoRefresh false state actually break cycle and start it again when set back to true
                    there is no need for setInterval() to go running over and over again with no updates
                    perhaps i can do that through computed: elements
                        make them go round with while(this.autoRefresh) {this.getQuote()}
                    now that i think about it - computes is a bad idea
                        i should rather sow quto refresh into the method itself
             */
            this.getQuote();
            setInterval( () => {
                if (this.autoUpdate && this.autoRefresh) {
                    this.opacity = 0;
                    setTimeout(() => {
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