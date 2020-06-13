<template>
  <v-layout column
            justify-center
            align-center
  >
    <v-card class="d-inline-flex flex-column text-center pa-2">
      <h1 v-if="error.statusCode === 404"
          class="display-4"
      >
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      <v-card-text>
        <h3>{{ error.message }}</h3>
        <p class="text-left mt-5 pa-2 secondary white--text">{{ error.config }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn nuxt
               to="/"
               color="blue darken-2"
        >
          <v-icon left>mdi-home</v-icon>
          Home Page
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="reload"
               color="blue darken-2"
        >
          <v-icon left>mdi-update</v-icon>
          Reload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
  export default {
    layout: 'empty',
    props: {
      error: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        pageNotFound: '404 Not Found',
        otherError: 'An error occurred'
      }
    },
    head () {
      const title =
        this.error.statusCode === 404 ? this.pageNotFound : this.otherError
      return {
        title
      }
    },
    methods: {
      reload() {
        document.location.reload()
      }
    }
  }
</script>

<style scoped>
  h1 {
    font-size: 20px;
  }
</style>
