// import Vue  from 'vue';
// import Vuex from 'vuex';
//
// Vue.use(Vuex);
//
// const store = () =>
//   new Vuex.Store({
//     state: {
//       test: {
//         user: null
//       }
//     },
//     mutations: {
//       user(data) {
//         state.test.user = data;
//       }
//     },
//     actions: {
//       nuxtServerInit ({ commit }, { req }) {
//         console.log('User: ', req);
//         if (req.user) {
//           commit('user', req.user)
//         }
//       }
//     }
//   });
//
// export default store