<template>
    <div id="chat">
        <div
            v-if="!isConnected"
            class="app"
        >
            <h1>Авторизуйтесь для продолжения</h1>
            <div style="background-color: lightgray; flex: 1"></div>
        </div>
        <div
            v-else
            class="app"
        >
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
                <textarea
                    name="input"
                    v-model="input"
                    placeholder="Введите сообщение"
                    @keydown.enter.exact.prevent="send"
                    @keydown.enter.shift.exact="newline"
                ></textarea>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import { mapState } from 'vuex';
    const moment = require('moment');

    export default {
        name: "Chat",
        data() {
            return {
                socket: io('/chat'),
                input: '',
                messages: []
            }
        },
        methods: {
            send() {
                /* TODO: limit the throughput
                    > set a limit for 3000 characters so as not to clog the server
                */
                if (this.input) {
                    this.appendMessage({
                        sender: this.login,
                        time: moment().format('HH:mm'),
                        message: this.input.split('\n')
                    });
                    this.socket.emit('message', JSON.stringify({
                        sender: this.login,
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
            appendMessage(messageData) {
                /*
                    messageData =  {
                        sender: 'login',
                        time: 'time'
                        message: [
                            'message',
                            '...'
                        ]
                    }
                */
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
            login: state => state.session.userData.login
        }),
        watch: {
            isConnected: function (n,o) {
                if (n !== o && n) {
                    this.socket.emit('message', JSON.stringify({
                        sender: 'System',
                        time: moment().format('HH:mm'),
                        message: [`Подключился пользователь: ${this.login}`]
                    }));
                    this.appendMessage({
                        sender: 'System',
                        time: moment().format('HH:mm'),
                        message: [`Вы подключились как ${this.login}`]
                    })
                }
            }
        },
        mounted() {
            this.socket.on('message', data => {
                if (this.isConnected) {
                    this.appendMessage(JSON.parse(data))
                }
            });
        }
    }
</script>

<style lang="less" scoped>
    #chat {
        display: flex;
        justify-content: center;
        text-align: center;
        .app {
            display: flex;
            flex-flow: column;
            border-left: 1px solid black;
            border-right: 1px solid black;
            width: 100vh;
            text-align: left;
            h1 {
                text-align: center;
                padding: 1rem;
                border-bottom: 1px solid black;
                margin-bottom: 0;
            }
            ul {
                list-style: none;
                padding-left: 0;
                margin-bottom: 0;
                li {
                    padding-left: 1rem;
                }
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
            }
        }
    }
</style>