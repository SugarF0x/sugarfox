const colors = require('vuetify/es5/util/colors').default;
require('dotenv').config();

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: 'Fox lair',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/sgfx_line.webp' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  // serverMiddleware: [
  //   '~/api/auth',
  // ],
  plugins: [

  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  axios: {
    // baseURL: 'http://localhost:3000/api'
    baseURL: process.env.BASE_URL + '/api'
  },
  auth: {
    resetOnError: true,
    redirect: {
      login: '/profile/login', // User will be redirected to this path if login is required.
      home: '/', // User will be redirect to this path after login. (rewriteRedirects will rewrite this path)
      logout: false, // User will be redirected to this path if after logout, current route is protected.
      user: '/profile',
      callback: '/callback' // User will be redirect to this path by the identity provider after login. (Should match configured Allowed Callback URLs (or similar setting) in your app/client with the identity provider)
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'token'
          },
          logout: false,
          user: {
            url: '/auth/me',
            method: 'GET',
            propertyName: 'user'
          }
        },
        tokenRequired: true
      },
      vk: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://oauth.vk.com/authorize',
        redirect_uri: process.env.BASE_URL + '/profile/auth/vk',
        userinfo_endpoint: process.env.BASE_URL + '/api/auth/me',
        scope: ['friends','groups','status','offline'],
        response_type: 'code',
        access_type: 'offline',
        access_token_endpoint: '/auth/login/test',
        token_type: 'Bearer',
        client_id: process.env.VK_CLIENT_ID
      }
    },
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  server: {
    host: "192.168.1.42",
    port: "3000"
  }
};
