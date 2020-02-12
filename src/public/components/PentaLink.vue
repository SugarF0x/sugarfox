<template>
    <a
        class="pentaLink"
        :href=link
        data-toggle="tooltip"
        data-placement="top"
        data-delay="{ &quot;show&quot;: 500, &quot;hide&quot;: 100 }"
        title=""
        :data-original-title=desc
        :style="{width: size + 'rem', height: size + 'rem'}"
    >
        <svg
            viewBox="0 0 58 64"
            class="pL__bg"
            :style="{transform: 'rotate(' + tilt + 'deg)', fill: color}"
        >
            <polygon points="46.954,57.792 11,57.792 -1,24.544 29.039,0.208 59,24.792"></polygon>
        </svg>
        <img
            class="pL__fg"
            :src=img
            :style="'transform: rotate(' + Math.floor(tilt/2)*(-1) + 'deg)'"
            :alt=desc
        >
    </a>
</template>

<script>
    /* TODO:
        > Add <disabled> state support for styles
            for now disabled state can only be used by styles from element tags
            but in order to be computed or what not there should be a this.isDisabled state in data()
     */

    export default {
        name: 'PentaLink',
        props: {
            img: {
                type: String,
                default: 'img/utils/missing-image.webp'
            },
            link: {
                type: String,
                default: '#'
            },
            desc: {
                type: String,
                default: 'Description missing'
            },
            color: {
                type: String,
                default: '#00BFFF'
            },
            size: {
                type: String,
                default: '6'
            }
        },
        data() {
            return {
                tilt: ''
            }
        },
        created() {
            this.tilt = Math.floor(Math.random() * (60 - 15)) + 15;
            if (Math.random() < 0.5) {
                this.tilt *= -1;
            }
        }
    }
</script>

<style scoped lang="less">
    .pentaLink {
        display: inline-block;
        position: relative;
        margin: 0.5rem;
        border-radius: 50%;
        img, object, svg {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }
        .pL__bg, .pL__fg {
            transition-duration: 0.5s;
            transition-timing-function: ease-in-out;
        }
        .pL__fg {
            padding: 20%;
        }
    }

    .pentaLink[disabled] {
        .pL__bg, .pL__fg {
            fill: gray !important;
        }
        cursor: not-allowed;
    }

    .pentaLink:not([disabled]):hover {
        .pL__bg, .pL__fg {
            transform: rotate(0deg) !important;
            fill: #0086ff;
        }
    }
</style>