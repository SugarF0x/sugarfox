<template>
    <div class="login">
        <div class="d-flex align-items-center">
            <span class="mr-2">{{ loggedInLogin }}</span>
            <button type="button" v-if="!isLoggedIn" class="button noHighlight" @click="show=!show">
                Войти
            </button>
            <form v-else @submit.prevent="logout">
                <button class="button noHighlight" type="submit">
                    Выйти
                </button>
            </form>
        </div>
        <div class="cover" v-if="show">
            <div v-if="!reg" class="wrap container text-center">
                <button @click="show=!show" class="closeLogin">&times;</button>
                <h3>Войти</h3>
                <form class="d-flex flex-column align-items-center noHighlight" @submit.prevent="validateLogin" action="/api/passport/login" method="POST">
                    <input required type="text" class="inputField" :class="{inputError : errors.login.length}" name="email" v-model="email" placeholder="почта">
                    <input required type="password" class="inputField" :class="{inputError : errors.login.length}" name="password" v-model="password" placeholder="пароль">
                            <span v-if="errors.login" class="errorText">
                                <font-awesome-icon :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                {{errors.login}}
                            </span>
                    <div>
                        <input type="submit" class="loginButton" value="Вход">
                        <button type="button" class="loginButton" @click="reg=true">Регистрация</button>
                    </div>
                </form>
                <span class="or">или</span>
                <h5>Войти через сторонний сайт:</h5>
                <div class="d-flex justify-content-between p-2 third-party noHighlight">
                    <form action="/api/passport/login/vk" method="POST" @submit="updateUrl">
                        <input type="text" name="returnTo" :value="returnTo" style="display: none">
                        <button type="submit"><font-awesome-icon :icon="['fab', 'vk']" title="Вконтакте"/></button>
                    </form>
                    <form action="#" @submit.prevent>
                        <input type="text" name="returnTo" :value="returnTo" style="display: none">
                        <button type="submit"><font-awesome-icon :icon="['fab', 'facebook']" title="Facebook"/></button>
                    </form>
                    <form action="#" @submit.prevent>
                        <input type="text" name="returnTo" :value="returnTo" style="display: none">
                        <button><font-awesome-icon :icon="['fab', 'twitter']" title="Twitter"/></button>
                    </form>
                    <form action="#" @submit.prevent>
                        <input type="text" name="returnTo" :value="returnTo" style="display: none">
                        <button><span title="placeholder">&times;</span></button>
                    </form>
                </div>
            </div>

            <div v-else class="wrap container text-center">
                <button @click="show=!show; reg=false" class="closeLogin">&times;</button>
                <h3>Регистрация</h3>
                <form class="d-flex flex-column align-items-center noHighlight" @submit.prevent="validateReg" action="/api/passport/register" method="POST">
                    <input required type="email" class="inputField" :class="{inputError : errors.registration.mail.length}" name="email" v-model.lazy="email" placeholder="e-mail">
                            <span v-for="error in errors.registration.mail" class="errorText">
                                <font-awesome-icon :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                {{error}}
                            </span>
                    <input required type="text" class="inputField" :class="{inputError : errors.registration.login.length}" name="login" v-model.lazy="login" placeholder="логин">
                            <span v-for="error in errors.registration.login" class="errorText">
                                <font-awesome-icon :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                {{error}}
                            </span>
                    <input required type="password" class="inputField" :class="{inputError : errors.registration.password.length}" name="password1" v-model.lazy="password1" placeholder="пароль">
                    <input required type="password" class="inputField" :class="{inputError : errors.registration.password.length}" name="password2" v-model.lazy="password2" placeholder="подтвердить пароль">
                            <span v-for="error in errors.registration.password" class="errorText">
                                <font-awesome-icon :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                {{error}}
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
    /* TODO: Rework the button
        > Make it a big [Login] button when not authed
        > When authed, keep the user login to the left, while instead of [Logout] there should be a user icon
            either a default one or the profile picture (rounded)
        >> said icon is to be a drop-down menu with the following options:
            - x3 Placeholders
            - Profile Configuration
            - Logout
    */
    export default {
        name: "Login",
        data() {
            return {
                show: false,
                reg: false,
                returnTo: '',
                errors: {
                    registration: {
                        login: [],
                        password: [],
                        mail: []
                    },
                    login: ''
                },
                login: '',
                email: '',
                password: '',
                password1: '',
                password2: '',
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.state.session.isConnected;
            },
            loggedInLogin() {
                if (this.$store.state.session.userData) {
                    return this.$store.state.session.userData.login;
                } else {
                    return '';
                }
            }
        },
        methods: {
            validateLogin() {
                this.$root.postJson('/api/passport/login/local', {
                    email: this.email,
                    password: this.password})
                    .then(response => {
                        if (response.result) {
                            window.location.reload();
                        } else {
                            this.errors.login = response.msg;
                        }
                    });
            },
            validateReg() {
                this.$root.postJson('/api/passport/register', {
                    email: this.email,
                    login: this.login,
                    password1: this.password1,
                    password2: this.password2})
                    .then(response => {
                        if (response.result) {
                            window.location.reload();
                        } else {
                            this.errors.registration.mail      = response.msg.email;
                            this.errors.registration.password  = response.msg.password;
                            this.errors.registration.login     = response.msg.login;
                        }
                    });
            },
            updateUrl() {
                this.returnTo = window.location.pathname;
            },
            logout() {
                this.$root.deleteJson('/api/passport/logout')
                    .then(response => {
                        if (response.result) {
                            window.location.reload()
                        } else {
                            console.log(`ERR: ${response.msg}`);
                        }
                    });
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
                background: var(--bar);
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
                background: var(--bar);
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
            color: var(--color);
            .wrap {
                position: relative;
                background-color: var(--el);
                border: 1px solid var(--action);
                width: 25rem;
                padding: .8rem 2.5rem;
                @media (min-width:961px) {
                    border-radius: 1rem;
                }
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
                    color: var(--color);
                }
                .closeLogin:hover {
                    opacity: 1;
                }
                .inputField {
                    width: 80%;
                    padding: .1rem .4rem;
                }
                .loginButton {
                    background-color: var(--action);
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
                .loginButton:hover {
                    background-color: var(--hover);
                }
                .or {
                    opacity: .5;
                }
                .or::before, .or::after {
                    content: '';
                    display: inline-block;
                    width: 40%;
                    margin: .3rem;
                    border-bottom: 1px solid var(--action);
                }
                .third-party {
                    margin: 0 3rem;
                }
                .third-party {
                    button > * {
                        background-color: var(--action);
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
                    button > *:hover {
                        background-color: var(--hover);
                    }
                    svg {
                        position: relative;
                    }
                }
                input {
                    margin: .2rem 0;
                    background-color: var(--bg);
                    border: 2px solid var(--action);
                    color: var(--color);
                }
            }
        }
    }
</style>