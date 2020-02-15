<template>
    <div class="login">
        <div class="button noHighlight" @click="show=!show">
            Login
        </div>
        <div class="cover" v-if="show">
            <div class="wrap container text-center">
                <span @click="show=!show" class="closeLogin">&times;</span>
                <h3>Login</h3>
                <form>
                    <input type="text" class="loginField" name="login" placeholder="login">
                    <input type="text" class="passwordField" name="password" placeholder="password">
                    <input type="submit" value="Log In">
                </form>
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
                show: true
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
                max-width: 30vw;
                padding: .8rem;
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
            }
            input {
                margin: .2rem 0;
            }
            input[type=submit] {
                background-color: steelblue;
                border: none;
                color: white;
                cursor: pointer;
                padding: .6rem 3rem;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                text-transform: uppercase;
                border-radius: .4rem;
            }
            input:focus {
                outline: none;
            }
        }
    }
</style>