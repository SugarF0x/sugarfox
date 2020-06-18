<template>

</template>

<script>
  export default {
    name: "logout",
    mounted() {
      this.$auth.logout();
      this.$auth.redirect('logout');
    }
  }
</script>

<style scoped>

</style>