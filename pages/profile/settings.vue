<template>
  <v-layout column>
    <v-row justify="center">
      <v-col cols="12"
             sm="10"
             md="8"
             lg="7"
             xl="6"
             class="py-0"
      >
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span>
              <span class="secondary--text">{{ $auth.user.login }}</span>
              settings page
            </span>
                <v-spacer></v-spacer>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12"
             sm="10"
             md="8"
             lg="7"
             xl="6"
             class="py-0"
      >
        <v-row>
          <v-col cols="12" md="3">
            <v-card>
              <v-list class="py-0">
                <v-list-item-group>
                  <v-list-item to="personalization">Personalization</v-list-item>
                  <v-list-item to="privacy">Privacy</v-list-item>
                  <v-list-item to="danger-zone">Danger zone</v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" md="9">
            <v-card>
              <nuxt-child keep-alive :key="$route.path"></nuxt-child>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
  /* TODO: add sync button to VK authed users
      > that being a button that refetches user data from VK
        thus updating avatar, frields, name and whatever
          all these fields to be updated are to be checklisted
   */

  export default {
    name: "settings",
    middleware: ['auth'],
    beforeCreate() {
      if (this.$route.path === '/profile/settings') {
        this.$router.replace('settings/personalization')
      }
    }
  }
</script>

<style scoped>

</style>