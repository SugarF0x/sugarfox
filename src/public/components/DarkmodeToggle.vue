<template>
    <div class="toggleWrapper">
        <input type="checkbox"
               class="dn"
               id="darkmodeToggle"
               v-model="darkmode"
               @click="darkmodeToggle"
        />
        <label for="darkmodeToggle" class="toggle">
            <span class="toggle__handler">
                <span class="crater crater--1"></span>
                <span class="crater crater--2"></span>
                <span class="crater crater--3"></span>
            </span>
            <span class="star star--1"></span>
            <span class="star star--2"></span>
            <span class="star star--3"></span>
            <span class="star star--4"></span>
            <span class="star star--5"></span>
            <span class="star star--6"></span>
        </label>
    </div>
</template>

<script>
    export default {
        name: "DarkmodeToggle",
        computed: {
            darkmode: {
                get() {
                    return this.$store.state.darkmode;
                },
                set(newValue) {
                    return newValue;
                }
            }
        },
        methods: {
            darkmodeToggle() {
                if (this.darkmode) {
                    this.$store.commit('setDarkmode', false)
                } else {
                    this.$store.commit('setDarkmode', true)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    /* TODO: add size control
        > perhaps i should add some kind of, lets say, a prop
            that would define the size of this component relative to it
            cuz atm the size if fixes to what i want it to be in the footer
                yet still relative set with rems and shit
     */

    .toggleWrapper {
        flex: 1;
        overflow: hidden;
        display: flex;
        align-items: center;

        input {
            display: none;
        }
        label {
            margin-bottom: 0;
        }
    }

    .toggle {
        cursor: pointer;
        display: inline-block;
        position: relative;
        width: 1.95rem;
        height: 1.1rem;
        background-color: #83D8FF;
        border-radius: 2rem;
        transition: background-color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
    }

    .toggle__handler {
        display: inline-block;
        position: absolute;
        z-index: 1;
        top: .06rem;
        left: .06rem;
        width: 1rem;
        height: 1rem;
        background-color: #FFCF96;
        border-radius: 1rem;
        box-shadow: 0 .04rem .12rem rgba(0,0,0,.3);
        transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
        transform:  rotate(-45deg);

        .crater {
            position: absolute;
            background-color: #E8CDA5;
            opacity: 0;
            transition: opacity 200ms ease-in-out;
            border-radius: 100%;
        }

        .crater--1 {
            top: .36rem;
            left: .2rem;
            width: .08rem;
            height: .08rem;
        }

        .crater--2 {
            top: .56rem;
            left: .44rem;
            width: .12rem;
            height: .12rem;
        }

        .crater--3 {
            top: .2rem;
            left: .5rem;
            width: .16rem;
            height: .16rem;
        }
    }

    .star {
        position: absolute;
        background-color: #ffffff;
        transition: all 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
        border-radius: 50%;
    }

    .star--1 {
        top: .2rem;
        left: .7rem;
        z-index: 0;
        width: .6rem;
        height: .06rem;
    }

    .star--2 {
        top: .36rem;
        left: .56rem;
        z-index: 1;
        width: .6rem;
        height: .06rem;
    }

    .star--3 {
        top: .54rem;
        left: .8rem;
        z-index: 0;
        width: .6rem;
        height: .06rem;
    }

    .star--4,
    .star--5,
    .star--6 {
        opacity: 0;
        //noinspection CssInvalidPropertyValue
        transition: all 300ms 0 cubic-bezier(0.445, 0.05, 0.55, 0.95);
    }

    .star--4 {
        top: .32rem;
        left: .22rem;
        z-index: 0;
        width: .04rem;
        height: .04rem;
        transform: translate3d(.06rem,0,0);
    }

    .star--5 {
        top: .62rem;
        left: .34rem;
        z-index: 0;
        width: .06rem;
        height: .06rem;
        transform: translate3d(.06rem,0,0);
    }

    .star--6 {
        top: .72rem;
        left: .56rem;
        z-index: 0;
        width: .04rem;
        height: .04rem;
        transform: translate3d(.06rem,0,0);
    }

    input:checked {
        + .toggle {
            background-color: #749DD6;

            &:before {
                color: #749ED7;
            }

            &:after {
                color: #ffffff;
            }

            .toggle__handler {
                background-color: #FFE5B5;
                transform: translate3d(.8rem, 0, 0) rotate(0);

                .crater { opacity: 1; }
            }

            .star--1 {
                width: .04rem;
                height: .04rem;
            }

            .star--2 {
                width: .08rem;
                height: .08rem;
                transform: translate3d(-.1rem, 0, 0);
            }

            .star--3 {
                width: .04rem;
                height: .04rem;
                transform: translate3d(-.14rem, 0, 0);
            }

            .star--4,
            .star--5,
            .star--6 {
                opacity: 1;
                transform: translate3d(0,0,0);
            }
            .star--4 {
                transition: all 300ms 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
            }
            .star--5 {
                transition: all 300ms 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
            }
            .star--6 {
                transition: all 300ms 400ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
            }
        }
    }
</style>