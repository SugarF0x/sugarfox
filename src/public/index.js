import Vue       from 'vue';
import Vuex      from 'vuex';
import VueRouter from 'vue-router';
import App       from './App.vue';

import { library }         from '@fortawesome/fontawesome-svg-core';
import { fas }             from '@fortawesome/free-solid-svg-icons';
import { fab }             from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Home          from "./pages/Home.vue";
import Chat          from "./pages/Chat.vue";
import Missing       from "./pages/Missing.vue";
import Minecraft     from "./pages/Minecraft.vue";
import Error         from "./pages/Error.vue";
import CommunityBank from "./pages/CommunityBank.vue";
import QuotesEditor  from "./pages/QuotesEditor.vue";

library.add(fas, fab);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueRouter);
Vue.use(Vuex);

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
                path: '/community-bank',
                component: CommunityBank
            },{
                path: '/quotes-editor',
                component: QuotesEditor
            },{
                path: '/error',
                component: Error
            },{
                path: '/*',
                component: Missing
            }
        ]
    }),
    store:  new Vuex.Store({
        state: {
            session: {
                isConnected: false,
                userData: {}
            }
        },
        mutations: {
            setSessionStatus(state, payload) {
                state.session = payload;
            }
        },
        actions: {
            getSessionStatus(context, {vm}) {
                vm.getJson('/api/passport/status')
                    .then(data => {
                            if (data.result) {
                                context.commit({
                                    type: 'setSessionStatus',
                                    isConnected: true,
                                    userData: data.user
                                })
                            } else {
                                context.commit({
                                    type: 'setSessionStatus',
                                    isConnected: false,
                                    userData: {}
                                })
                            }
                        }
                    );
            }
        }
    }),
    data: {},
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
        /* TODO: think of something better than this
               > this is a huge workaround for the browser using old data when history.back() is executed
               > basically, it forces data reload on page load with a delay
                   this ensures that session data is up to date on history.back()
                   though i do believe there is a better way of doing this
        */
        window.onload = () => {
            setTimeout(() => {
                this.$store.dispatch('getSessionStatus', {vm: this.$root});
            })
        };
    },
    render: h => h(App)
}).$mount('#app');