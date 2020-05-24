<template>
    <div id="chat">
        <div v-if="!isConnected"
             class="app"
        >
            <h1 class="blocked">Авторизуйтесь для продолжения</h1>
        </div>
        <div v-else
             class="app"
        >
            <div class="sidebar">

            </div>
            <div class="main">
                <h1>Фрупчат</h1>
                <ul class="messages" ref="messages">
                    <li v-for="n in messages">
                        <div class="sender" style="font-size:1.5rem">
                            {{n.sender}}: <small>{{ n.time }}</small>
                        </div>
                        <ul class="message">
                            <li v-for="m in n.message">
                                {{m}}
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class='input'>
                    <textarea name="input"
                              v-model="input"
                              placeholder="Введите сообщение"
                              @keydown.enter.exact.prevent="send"
                              @keydown.enter.shift.exact="newline"
                    ></textarea>
                    <div class="charCount"
                         :style="messageLength > 3000 ? 'color: red' :
                                 messageLength > 2500 ? 'color: orange' : ''"
                    >
                        {{messageLength}}/3000
                    </div>
                </div>
            </div>
            <div class="users sidebar">
                <h3>Подключенные пользователи:</h3>
                <ul>
                    <li v-for="n in users">
                        {{n}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import { mapState } from 'vuex';
    const moment = require('moment');

    /* TODO: review .messages display method
        > perhaps i should use Vue list loader component from here:
                URL: https://github.com/IvanSafonov/vue-list-scroller
     */

    export default {
        name: "Chat",
        data() {
            return {
                socket: io('/chat'),
                input: '',
                messages: [],
                users: []
            }
        },
        methods: {
            send() {
                if ([...this.input].length > 3000) {
                    this.appendMessage({
                        sender: 'Система',
                        time: moment().format('HH:mm'),
                        message: ['Максимальная длина сообщения: 3000 символов']
                    })
                } else
                if (this.input) {
                    /* TODO: redo the sending function
                        > now if there are any newlines, it splits the input into different messages
                        > what i want is newlines to stay within one single message and have them closer together
                    */
                    this.appendMessage({
                        sender: this.userData.login,
                        time: moment().format('HH:mm'),
                        message: this.input.split('\n')
                    });
                    this.socket.emit('message', JSON.stringify({
                        sender: this.userData.login,
                        time: moment().format('HH:mm'),
                        message: this.input.split('\n')
                    }));
                    this.input = '';
                    this.scrollToEnd();
                }
            },
            newline() {
                this.value = `${this.value}\n`;
            },
            scrollToEnd() {
                setTimeout(() => {
                    this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
                });
            },
            /* TODO: rething appendMessage
                > since messageData structure is always the same {sender: <>, time: <>, message: <>}
                    think i can replace messageData with three separate arguments, resulting in:
                                        appendMessage(sender, time, message);
            */
            appendMessage(messageData) {
                if (this.messages.length) {
                    if (this.messages[this.messages.length-1].sender === messageData.sender) {
                        messageData.message.forEach((entry) => {
                            this.messages[this.messages.length-1].message.push(entry)
                        })
                    } else {
                        this.messages.push(messageData)
                    }
                } else {
                    this.messages.push(messageData)
                }
                setTimeout(() => {
                    if (this.$refs.messages.scrollHeight - this.$refs.messages.clientHeight - this.$refs.messages.scrollTop < 250) {
                        this.scrollToEnd()
                    }
                });
                /* TODO: make a circle down arrow in bottom-right corner that scrolls down
                        and make it appear only if scrolled past  not to 100%
                */
            }
        },
        computed: mapState({
            isConnected: state => state.session.isConnected,
            userData:    state => state.session.userData,
            messageLength() {
                return this.input.length
            }
        }),
        watch: { // n = new value, o = old value
            isConnected: function (n,o) {
                if (n !== o && n) {
                    this.socket.emit('login', JSON.stringify({
                        id:    this.userData.id,
                        login: this.userData.login
                    }));
                }
            }
        },
        mounted() {
            /* TODO: fix not scrolling to bottom on loading long history
            
            */
            if (this.isConnected) {
                this.socket.emit('login', JSON.stringify({
                    id:    this.userData.id,
                    login: this.userData.login
                }));
            }

            this.socket.on('message', data => {
                if (this.isConnected) {
                    this.appendMessage(JSON.parse(data))
                }
            });
            this.socket.on('list', data => {
                this.users = JSON.parse(data);
            })
        },
        beforeDestroy() {
            this.socket.disconnect();
        }
    }
</script>

<style lang="less" scoped>
    #chat {
        display: flex;
        ul {
            list-style: none;
            padding-left: 0;
            margin-bottom: 0;
            li {
                padding: 0 1rem;
            }
        }
        .app {
            flex: 1;
            display: flex;
            .blocked {
                flex: 1;
                margin: 0;
                display:flex;
                justify-content:center;
                align-items:center;
                background-color: lightgray;
                text-align: center;
                padding: 1rem;
            }
            .users {
                h3 {
                    text-align: center;
                }
                li {
                    text-align: left;
                }
            }
            .sidebar {
                flex: 1;
                display: none;
            }
            @media (min-width:961px)  {
                .sidebar {
                    display: initial;
                }
            }
            .main {
                display: flex;
                flex-flow: column;
                border-left: 1px solid black;
                border-right: 1px solid black;
                width: 100vw;
                max-width: 100vh;
                text-align: left;
                h1 {
                    text-align: center;
                    padding: 1rem;
                    border-bottom: 1px solid black;
                    margin-bottom: 0;
                }
                .messages {
                    flex: 1rem 1;
                    overflow-y: auto;
                    overflow-x: hidden;
                    > li:nth-of-type(2n-1) {
                        background-color: seashell;
                    }
                }
                .messages { // these disable scrollbar (+ the ::-webkit-scrollbar further down)
                    overflow: -moz-scrollbars-none;
                    -ms-overflow-style: none;
                }
                .messages::-webkit-scrollbar { width: 0 !important }
                .input {
                    position: relative;
                    border-top: 1px solid black;
                    padding: 1rem;
                    display: flex;
                    justify-content: center;
                    align-content: center;
                    textarea {
                        width: 100%;
                        outline: none;
                        resize: none;
                        padding: .3rem;
                    }
                    .charCount {
                        position: absolute;
                        top: 0;
                        right: 1rem;
                        font-size: .8em;
                        color: lightgray;
                    }
                }
            }
        }
    }
</style>