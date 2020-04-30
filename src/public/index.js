import Vue        from 'vue';
import VueRouter  from 'vue-router';
import App        from './App.vue';

import { library }         from '@fortawesome/fontawesome-svg-core';
import { fas }             from '@fortawesome/free-solid-svg-icons';
import { fab }             from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Home      from "./views/Home.vue";
import Chat      from "./views/Chat.vue";
import Missing   from "./views/Missing.vue";
import Minecraft from "./views/Minecraft.vue";
import Error     from "./views/Error.vue";

library.add(fas, fab);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueRouter);

new Vue({
    router: new VueRouter({
        mode: 'history',
        routes: [
            {
                path: '/',
                component: Home
            },{
                path: '/chat',
                component: Chat
            },{
                path: '/minecraft',
                component: Minecraft
            },{
                path: '/error',
                component: Error
            },{
                path: '/*',
                component: Missing
            }
        ]
    }),
    render: h => h(App),
    data: {
        session: ((localStorage.session) ? JSON.parse(localStorage.session) : {
            connected: false,
            login: ''
        })
    },
    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => console.log(error))
        },
        postJson(url, data){
            return fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(result => result.json())
                .catch(error => console.log(error))
        },
        putJson(url, data){
            return fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(result => result.json())
                .catch(error => console.log(error))
        },
        deleteJson(url){
            return fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(result => result.json())
                .catch(error => console.log(error))
        }
    },
    mounted() {
        /* TODO: create an event emiter
            > i need to catch whenever status report comes in
                so as to update dependencies like Login.vue or PentaLink.vue
            > or perhaps i can add a couple lines to Login.vue itself
                that on a successful login it will force rewrite localStorage.session
                and do the same thing in reverse when login out
         */
        this.getJson('/api/passport/status')
            .then(data => {
                if (data.result) {
                    localStorage.session = JSON.stringify({
                        connected: true,
                        login:     data.login
                    });
                } else {
                    localStorage.removeItem('session');
                    this.session = {
                        connected: false,
                        login: ''
                    }
                }
                if (localStorage.session) {
                    this.session = JSON.parse(localStorage.session);
                }
            });
    }
}).$mount('#app');