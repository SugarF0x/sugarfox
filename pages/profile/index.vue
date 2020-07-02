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