<template>
    <!-- TODO:
         > Move styles to the component itself
              now im not that sure i can actually do that without .vue components
                  (failed miserably when trying to install them)
              but i should give it another look since i gotta to the further tasks
         > Add default values to [props]
         > Add colors to [props]
             colors should all have default values set to what there is now
             should be able to set custom :color-start :color-end :color-disabled
     -->
    <a
        class="pentaLink"
        :href=link
        data-toggle="tooltip"
        data-placement="top"
        data-delay="{ &quot;show&quot;: 500, &quot;hide&quot;: 100 }"
        title=""
        :data-original-title=desc
    >
        <svg
            viewBox="0 0 58 64"
            class="pL__bg"
            :style="'transform: rotate(' + tilt + 'deg)'"
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
    export default {
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
        height: 6rem;
        width: 6rem;
        margin: 0.5rem;
        //background-color: cyan;
        border-radius: 50%;
        img, object, svg {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }
        .pL__fg {
            padding: 20%;
            transition-duration: 0.5s;
            transition-timing-function: ease-in-out;
        }
        .pL__bg {
            transition-duration: 0.5s;
            transition-timing-function: ease-in-out;
            transform: rotate(0deg);
            fill: #00BFFF;
        }
    }

    .pentaLink[disabled] {
        .pL__bg, .pL__fg {
            fill: gray;
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