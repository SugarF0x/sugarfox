<template>
    <div id="chat">
<!--        v-if="!$store.state.session.isConnected"        -->
        <div
            v-if="false"
            class="app"
        >
            <h1>Авторизуйтесь для продолжения</h1>
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
            <form class='input' action="" ref="form">
                <textarea
                    name="input"
                    v-model="input"
                    placeholder="Введите сообщение"
                    @keydown.enter.exact.prevent="send"
                    @keydown.enter.shift.exact="newline"
                ></textarea>
            </form>
        </div>
    </div>
</template>

<script>
    const moment = require('moment');

    export default {
        name: "Chat",
        data() {
            return {
                input: '',
                messages: [
                    /*
                        these are dummy messages for testing purposes
                     */
                    {
                        sender: 'Sender 1',
                        time: moment().format('HH:mm'),
                        message: [
                            'This is my first message',
                            'and here is the second one after that'
                        ]
                    },{
                        sender: 'Sender 2',
                        time: moment().format('HH:mm'),
                        message: [
                            'And I only sent one single message cuz im not a nerd lol'
                        ]
                    }
                ]
            }
        },
        methods: {
            send() {
                if (this.input) {
                    this.appendMessage({
                        sender: 'me',
                        time: moment().format('HH:mm'),
                        message: this.input.split('\n')
                    });
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
                        message: [
                            'message',
                            '...'
                        ]
                    }
                */
                if (this.messages[this.messages.length-1].sender === messageData.sender) {
                    messageData.message.forEach((entry) => {
                        this.messages[this.messages.length-1].message.push(entry)
                    })
                } else {
                    this.messages.push(messageData)
                }
                // TODO: add scrollToEnd() trigger for if .messages scroll is already past 90%
            }
        },
        mounted() {
                /*
                    this is just for testing purposes
                    with rough inline implementation of what functionality is yet to come
                 */
            setTimeout(() => {
                this.appendMessage({
                    sender: 'Sender 3',
                    time: moment().format('HH:mm'),
                    message: [
                        'I am a delayed sender'
                    ]
                });
                setTimeout(() => {
                    this.appendMessage({
                        sender: 'Sender 3',
                        time: moment().format('HH:mm'),
                        message: [
                            'with a delayed message'
                        ]
                    });
                },1500)
            },3000)
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