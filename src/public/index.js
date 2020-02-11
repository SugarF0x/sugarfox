import Vue from 'vue'
import App from './App.vue';

// const mainAPp = new Vue({
//     el: '#app',
//     components: {
//         App
//     }
// });

new Vue({
    render: h => h(App),
}).$mount('#app');