import Vue from 'vue';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSyncAlt);

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
    render: h => h(App),
}).$mount('#app');