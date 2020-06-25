<template>
  <v-layout column>
    <v-row justify="center">
      <v-col cols="12" sm="8 md=6">
        <v-card>
          <v-card-title>
            <p class="ma-0">
              This is <span class="secondary--text">Profile</span> page placeholder
            </p>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">
                  {{ methodIcon }}
                </v-icon>
              </template>
              <span>{{ $auth.user.method + ' auth'}}</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <p>
              This page will have info on the <span class="primary--text">logged in user</span>
              or a prompt to login if not authed
            </p>
            <v-list>
              <v-list-item two-line
                           v-for="(value, name) in $auth.user"
                           :key="name"
              >
                <v-list-item-content>
                  <v-list-item-title class="text-capitalize">{{ name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
  export default {
    name: "profile-testing.vue",
    computed: {
      methodIcon() {
        switch (this.$auth.user.method) {
          case 'local': return 'mdi-account-circle';
          case 'vk':    return 'mdi-vk';
          default:      return 'mdi-help';
        }
      }
    }
  }
</script>

<style scoped>

</style>