<template>
  <v-layout column v-if="code">
    <v-row justify="center" align="center">
      <h1>Please wait, authorisation in progress</h1>
    </v-row>
    <v-row justify="center" align="center">
      <v-btn text loading height="100" width="100"></v-btn>
    </v-row>
  </v-layout>
  <v-layout column v-else>
    <v-row justify="center" align="center">
      <v-card class="pa-2">
        <v-card-title>
          <v-row justify="center">
            No auth code passed
          </v-row>
        </v-card-title>
        <v-card-text>
          Empty query - auth process terminated
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <v-btn nuxt
                   to="/"
                   color="blue darken-2"
            >
              <v-icon left>mdi-home</v-icon>
              Home Page
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-layout>
</template>

<script>
  /**
   * Third party auth strategies
   *
   * @category client
   * @subcategory pages
   * @namespace profile.auth
   */

  /**
   * VK auth redirect page<br>
   * Client is redirected here with code in GET parameters after accepting VK auth<br>
   * Said code is then sent to the server to process and proceed with authorization
   *
   * @category client
   * @subcategory pages
   * @namespace profile.auth.vk
   *
   * @vue-event {void} auth - Pass VK auth code to the server for processing and subsequent authorization
   */
  export default {
    name: "vk-auth",
    data() {
      return {
        code: this.$route.query.code
      }
    },
    methods: {
      async auth() {
        let response = await this.$axios.get(`/auth/login/vk?code=${this.code}`).catch(err => {
          console.log(err.response.data.message)
        });
        await this.$auth.setToken('vk', 'Bearer ' + response.data.access_token);
        this.$auth.fetchUser();
        this.$router.push('/profile');
      }
    },
    mounted() {
      if (this.code) {
        this.auth();
      }
    }
  }
</script>

<style scoped>

</style>