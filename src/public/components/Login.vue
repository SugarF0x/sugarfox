<template>
    <div class="login">
        <div class="d-flex align-items-center">
            <span class="mr-2">{{ $root.connection.login }}</span>
            <button type="button" v-if="!$root.connection.connected" class="button noHighlight" @click="show=!show">
                Войти
            </button>
            <form v-else action="/api/passport/logout?_method=DELETE" method="POST">
                <button class="button noHighlight" type="submit">
                    Выйти
                </button>
            </form>
        </div>
        <div class="cover" v-if="show">
            <div v-if="!reg" class="wrap container text-center">
                <button @click="show=!show" class="closeLogin">&times;</button>
                <h3>Войти</h3>
                <form class="d-flex flex-column align-items-center noHighlight" action="/api/passport/login" method="POST">
                    <input required type="text" class="inputField" :class="{inputError : loginError}" name="email" :model="email" placeholder="почта">
                    <input required type="password" class="inputField" :class="{inputError : loginError}" name="password" :model="password" placeholder="пароль">
                            <span v-if="loginError" class="errorText">
                                <font-awesome-icon :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                Неверно введена почта или пароль
                            </span>
                    <div>
                        <input type="submit" class="loginButton" value="Вход">
                        <button type="button" class="loginButton" @click="reg=true">Регистрация</button>
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

            <div v-else class="wrap container text-center">
                <button @click="show=!show; reg=false" class="closeLogin">&times;</button>
                <h3>Регистрация</h3>
                <form class="d-flex flex-column align-items-center noHighlight" @submit="validateReg" action="/api/passport/register" method="POST">
                    <input required type="email" class="inputField" :class="{inputError : regMailError}" name="email" v-model.lazy="email" placeholder="e-mail">
                            <span v-if="regMailError" class="errorText">
                                <font-awesome-icon :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                {{regMailError}}
                            </span>
                    <input required type="text" class="inputField" :class="{inputError : regLoginError}" name="login" v-model.lazy="login" placeholder="логин">
                            <span v-if="regLoginError" class="errorText">
                                <font-awesome-icon :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                {{regLoginError}}
                            </span>
                    <input required type="password" class="inputField" :class="{inputError : regPassError}" name="password1" v-model.lazy="password1" placeholder="пароль">
                    <input required type="password" class="inputField" :class="{inputError : regPassError}" name="password2" v-model.lazy="password2" placeholder="подтвердить пароль">
                            <span v-if="regPassError" class="errorText">
                                <font-awesome-icon :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                {{regPassError}}
                            </span>
                    <div>
                        <button type="button" class="loginButton" @click="reg=false">Вход</button>
                        <input type="submit" class="loginButton" value="Регистрация">
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                show: false,
                reg: false,
                regLoginError: '',
                regPassError: '',
                regMailError: '',
                loginError: '',
                login: '',
                email: '',
                password: '',
                password1: '',
                password2: '',
            }
        },
        methods: {
            validateLogin() {

            },
            validateReg(event) {
                /* TODO:
                    > Make more specific checks and error messages
                        so that user could see what exactly went wrong during the checks
                        that means i will have to part ways with my RegExp consts and use just inline // checks
                */
                const loginRegExp = /^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9-_]{2,20}$/;
                    /*
                        > Length bust range from 3 to 20 symbols
                        > First symbol must be a letter (either Cyrillic or Latin)
                        > Every other symbol can be: Cyrillic and Latin letters, numbers as well as '-' and '_' symbols
                    */
                const passRegExp = /^(?=\S+$).{8,}$/;
                    /*
                        > No whitespace allowed in the entire string
                        > Anything, at least eight places though
                    */
                const mailRegExp = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
                    /*
                        Honestly, dunno :shrug:
                    */

                if (this.login) {
                    if (!loginRegExp.test(this.login)) {
                        this.regLoginError = 'Логин должен содержать от 3 до 20 символов и не содержать пробелов и специальных символов кроме - и _'
                    } else {
                        this.regLoginError = '';
                    }
                } else {
                    this.regLoginError = '';
                }

                if (this.password1) {
                    if (this.password1 === this.password2) {
                        if (!passRegExp.test(this.password1)) {
                            this.regPassError = 'Пароль должен быть от 8 символов и больше и не содержать в себе пробелов'
                        } else {
                            this.regPassError = ''
                        }
                    } else {
                        this.regPassError = 'Пароли должны совпадать';
                    }
                } else {
                    this.regPassError = '';
                }

                if (this.email) {
                    if (!mailRegExp.test(this.email)) {
                        this.regMailError = 'Неправильно введена почта'
                    } else {
                        this.regMailError = '';
                    }
                } else {
                    this.regMailError = '';
                }

                if (this.regMailError || this.regPassError || this.regLoginError) {
                    event.preventDefault();
                    console.log('prevented')
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .login {
        .button {
            cursor: pointer;
            color: white;
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
                    //noinspection CssInvalidPropertyValue
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
                .inputError {
                    border-color: red;
                }
                .errorText {
                    color: red;
                }
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