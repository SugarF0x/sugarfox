<template>
  <v-layout column>
    <v-row justify="center" align="center">
      <h1>Please wait, redirecting to user page</h1>
    </v-row>
    <v-row justify="center" align="center">
      <v-btn text loading height="100" width="100"></v-btn>
    </v-row>
  </v-layout>
</template>

<script>
  /**
   * Profile redirect page<br>
   * Redirects to user profile by their publicId if authed<br>
   * Otherwise redirects to login page
   *
   * @requires auth
   *
   * @category client
   * @subcategory pages
   * @namespace profile
   */
  export default {
    name: "index.vue",
    middleware: ['auth'],
    mounted() {
      this.$router.replace(`/profile/${this.$auth.user.publicId}`)
    }
  }
</script>

<style scoped>

</style>