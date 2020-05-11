<template>
    <div id="chat">
        <div
            v-if="!isConnected"
            class="app"
        >
            <h1>Авторизуйтесь для продолжения</h1>
        </div>
        <div
            v-else
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
                    <textarea
                            name="input"
                            v-model="input"
                            placeholder="Введите сообщение"
                            @keydown.enter.exact.prevent="send"
                            @keydown.enter.shift.exact="newline"
                    ></textarea>
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

    export default {
        name: "Chat",
        data() {
            /* TODO: add symbol counter to input textarea
                > like Twitter x/300 one in the top-right corner
            */
            return {
                socket: io('/chat'),
                input: '',
                messages: [],
                users: []
            }
        },
        methods: {
            send() {
                /* TODO: limit the throughput
                    > set a limit for 3000 characters so as not to clog the server
                */
                if (this.input) {
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
            userData:    state => state.session.userData
        }),
        watch: {
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
            /* TODO: fix issue with chat not initing when entering from route-to
                > also fix issue when user is no longer authed but still can send messages and receive them
                    as per socket session is still going
            */
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
            /* TODO: Add socket leave event
                > make it so that user leaves chat session upon leaving chat with route-to
             */
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
                padding-left: 1rem;
            }
        }
        .app {
            flex: 1;
            display: flex;
            .sidebar {
                flex: 1;
            }
            .users {
                h3 {
                    text-align: center;
                }
                li {
                    text-align: left;
                }
            }
            .main {
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
    }
</style>