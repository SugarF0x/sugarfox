<template>
  <v-layout column
            justify-center
            align-center
  >
    <v-card class="d-inline-flex flex-column text-center pa-2">
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-btn nuxt
               to="/"
               color="primary"
        >
          <v-icon left>mdi-home</v-icon>
          Home Page
        </v-btn>
        <v-btn @click="$router.go(-1)"
               color="blue darken-2"
        >
          Go back
          <v-icon right>mdi-undo-variant</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
  /**
   * Redirect here to display error embedded in GET params<br>
   * Currently is to be terminated as layouts/error is a better alternative
   *
   * @category client
   * @subcategory pages
   * @namespace error
   *
   * @vue-data {String} [title=Undefined error]     - Error message title
   * @vue-data {String} [message=Undefined message] - Error message text
   */
  export default {
    name: 'empty',
    data () {
      return {
        title:   this.$route.query.title   || 'Undefined error',
        message: this.$route.query.message || 'Undefined message'
      }
    },
    head () {
      const title = this.title;
      return {
        title
      }
    }
  }
</script>

<style scoped>
  h1 {
    font-size: 20px;
  }
</style>
