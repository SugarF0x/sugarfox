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
            <ul class="messages">
                <li v-for="n in messages">
                    <div class="sender" style="font-size:1.5rem">
                        {{n.sender}}: <small>{{ Math.floor(Math.random()*1000) }}</small>
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
                        message: [
                            'This is my first message',
                            'and here is the second one after that'
                        ]
                    },{
                        sender: 'Sender 2',
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
                    this.$refs.form.submit()
                }
            },
            newline() {
                this.value = `${this.value}\n`;
            }
        },
        mounted() {
                /*
                    this is just for testing purposes
                    with rough inline implementation of what functionality is yet to come
                 */
            setTimeout(() => {
                this.messages.push({
                    sender: 'Sender 3',
                    message: [
                        'I am a delayed sender'
                    ]
                });
                setTimeout(() => {
                    this.messages[2].message.push('With a delayed message');
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
                // perhaps flex boxes are the way to go here if i want textarea to stick to the bottom
                // i.e. see how .vueapp is implemented
            border-left: 1px solid black;
            border-right: 1px solid black;
            width: 100vh;
            padding: 1rem 0;
            text-align: left;
            h1 {
                text-align: center;
                flex: 1;
            }
            ul {
                list-style: none;
                padding-left: 0;
                li {
                    padding-left: 1rem;
                }
            }
            .messages {
                > li:nth-last-of-type(2n-1) {
                    background-color: seashell;
                }
            }
            .input {
                display: flex;
                justify-content: center;
                align-content: center;
                textarea {
                    width: 95%;
                    outline: none;
                    padding: .3rem;
                }
            }
        }
    }
</style>