<template>
  <v-layout column>
    <v-row justify="center">
      <v-col cols="12"
             sm="8"
             md="6"
      >
        <v-row justify="center" no-gutters>
          <v-col cols="3" class="pr-3">
            <v-card class="pa-3 fill-height">
                <v-col cols="12" class="d-flex justify-center">
                  <v-avatar size="100">
                    <img :src="$auth.user.avatar" alt="avatar">
                  </v-avatar>
                </v-col>
                <v-col cols="12" class="d-flex justify-center py-2">
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        {{ methodIcon }}
                      </v-icon>
                    </template>
                    <span>{{ $auth.user.method + ' auth'}}</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <h4 class="text-center">
                    button group be here
                  </h4>
                </v-col>
            </v-card>
          </v-col>
          <v-col cols="9" class="pl-3">
            <v-card class="pa-3 fill-height">
              <h2> {{ $auth.user.login }} </h2>
              <p>
                User info is to be displayed here
              </p>
              <p>Perhaps even stats</p>
              <p>Perhaps even stats</p>
              <p>Perhaps even stats</p>
              <p>Perhaps even stats</p>
              <p>Perhaps even stats</p>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12"
             sm="8"
             md="6"
      >
        <v-card>
          <v-card-title>
            User data
          </v-card-title>
          <v-card-text>
            User data fields
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$router.go(-1)"
                   color="blue darken-2"
            >
              FUCK GO BACK
              <v-icon right>mdi-undo-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
  /* TODO: personal page redirect
      this page probably should redirect to something like
      /profile/:publicID
      as this path can customised by user
   */
  export default {
    name: "index.vue",
    middleware: ['auth'],
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