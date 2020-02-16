<template>
    <div class="login">
        <div class="button noHighlight" @click="show=!show">
            Войти
        </div>
        <div class="cover" v-if="show">
            <div class="wrap container text-center">
                <button @click="show=!show" class="closeLogin">&times;</button>
                <h3>Войти</h3>
                <form class="d-flex flex-column align-items-center noHighlight">
                    <input type="text" class="inputField" name="login" placeholder="логин">
                    <input type="password" class="inputField" name="password" placeholder="пароль">
                    <div>
                        <input type="submit" class="loginButton" value="Вход">
                        <button class="loginButton">Регистрация</button>
                    </div>
                </form>
                <span class="or">или</span>
                <h5>Войти через сторонний сайт:</h5>
                <div class="d-flex justify-content-between p-2 third-party noHighlight">
                    <button><font-awesome-icon :icon="['fab', 'vk']" title="Вконтакте"/></button>
                    <button><font-awesome-icon :icon="['fab', 'facebook']" title="Facebook"/></button>
                    <button><font-awesome-icon :icon="['fab', 'twitter']" title="Twitter"/></button>
                    <button><span title="placeholder">&times;</span></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /* TODO: Jesus this will be a barge
        > Finish tweaking CSS and make it actually look descent
        > Add validation methods
            both client and server-side
        > Add registration form
     */

    export default {
        name: "Login",
        data() {
            return {
                show: false
            }
        },
        methods: {
            validator() {

            }
        }
    }
</script>

<style scoped lang="less">
    .login {
        .button {
            cursor: pointer;
            position: relative;
            background: none;
            text-transform: uppercase;
            border: 0.2em solid white;
            padding: 0.5em 1em;
            &::before {
                content: "";
                display: block;
                position: absolute;
                width: 10%;
                background: steelblue;
                height: 0.3em;
                right: 20%;
                top: -0.21em;
                transform: skewX(-45deg);
                -webkit-transition: all 0.45s cubic-bezier(0.86, 0, 0.07, 1);
                transition: all 0.45s cubic-bezier(0.86, 0, 0.07, 1);
            }
            &::after {
                content: "";
                display: block;
                position: absolute;
                width: 10%;
                background: steelblue;
                height: 0.3em;
                left: 20%;
                bottom: -0.25em;
                transform: skewX(45deg);
                -webkit-transition: all 0.45 cubic-bezier(0.86, 0, 0.07, 1);
                transition: all 0.45s cubic-bezier(0.86, 0, 0.07, 1);
            }
            &:hover {
                &::before {
                    right: 80%;
                }
                &::after {
                    left: 80%;
                }
            }
        }
        .cover {
            position: fixed;
            top:0;
            left: 0;
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            background-color: rgba(0,0,0,0.5);
            color: black;
            .wrap {
                position: relative;
                background-color: white;
                border-radius: 1rem;
                width: 25rem;
                padding: .8rem 2.5rem;
                button {
                    border: none;
                    background-color: transparent;
                    padding: 0;
                    margin: 0;
                }
                .closeLogin {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    line-height: 1rem;
                    width: 1rem;
                    height: 1rem;
                    cursor: pointer;
                    opacity: .75;
                    font-size: 2em;
                }
                .closeLogin:hover {
                    opacity: 1;
                }
                .inputField {
                    width: 80%;
                    padding: .1rem .4rem;
                }
                .loginButton {
                    background-color: steelblue;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: .6rem 1.2rem;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    text-transform: uppercase;
                    border-radius: .4rem;
                    margin: .7rem .4rem;
                }
                .or {
                    opacity: .5;
                }
                .or::before, .or::after {
                    opacity: .5;
                    content: '';
                    display: inline-block;
                    width: 40%;
                    margin: .3rem;
                    border-bottom: 1px solid black;
                }
                .third-party {
                    margin: 0 3rem;
                }
                .third-party > * {
                    > * {
                        background-color: steelblue;
                        font-weight: bold;
                        color: white;
                        cursor: pointer;
                        font-size: 2rem;
                        border: 1px solid transparent;
                        border-radius: .4rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 2rem;
                        width: 2rem;
                        padding: .3rem;
                    }
                }
                input {
                    margin: .2rem 0;
                }
            }
        }
    }
</style>