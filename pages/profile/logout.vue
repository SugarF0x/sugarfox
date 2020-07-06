<template>

</template>

<script>
  /**
   * Profile logout redirect<br>
   * Currently a placeholder as $auth.logout() has no need in such redirect page<br>
   * But still better to have one than not
   *
   * @requires auth
   *
   * @category client
   * @subcategory pages
   * @namespace profile.logout
   */
  export default {
    name: "logout",
    middleware: ['auth'],
    mounted() {
      this.$auth.logout();
      this.$auth.redirect('logout');
    }
  }
</script>

<style scoped>

</style>