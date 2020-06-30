<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout column>
    <v-row justify="center">
      <v-col cols="12"
             sm="10"
             md="8"
             lg="7"
             xl="6"
      >
        <v-row justify="center">
          <v-col cols="12" md="3">
            <v-card class="fill-height">
              <v-card-title>
                <v-spacer></v-spacer>
                <v-avatar size="100">
                  <img :src="user.avatar" alt="avatar">
                </v-avatar>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions v-if="isOwner">
                <v-spacer></v-spacer>
                <v-btn nuxt
                       to="/profile/settings"
                       color="primary"
                >
                  Edit Profile
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="9">
            <v-card class="fill-height">
              <v-card-title>
                <span> {{ user.login }}</span>
                <v-spacer></v-spacer>
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">
                      {{ methodIcon }}
                    </v-icon>
                  </template>
                  <span>{{ user.method + ' auth' }}</span>
                </v-tooltip>
              </v-card-title>
              <v-card-text>
                <span v-if="isOwner">You <span class="secondary--text">are</span> the page owner</span>
                <span v-else>You are <span class="secondary--text">not</span> the page owner</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12"
             sm="10"
             md="8"
             lg="7"
             xl="6"
             class="pt-0"
      >
        <v-card>
          <v-card-title>
            User data
          </v-card-title>
          <v-card-text>
            or perhaps user activity feed? question mark?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$router.go(-1)"
                   color="primary"
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
  export default {
    name: "publicId.vue",
    middleware: ['auth'],
    async asyncData(context) {
      let user = {};
      if (context.app.$auth.user.publicId === context.params.publicId) {
        user = context.app.$auth.user
      } else {
        let data = await context.app.$axios.$post('/auth/getUser', { publicId: context.params.publicId });
        if (data.result) {
          user = data.user;
        } else {
          user = false;
        }
      }

      return { user }
    },
    data() {
      return {
        isOwner: this.$auth.user.publicId === this.$route.params.publicId
      }
    },
    computed: {
      methodIcon() {
        switch (this.user.method) {
          case 'local': return 'mdi-account-circle';
          case 'vk':    return 'mdi-vk';
          default:      return 'mdi-help';
        }
      }
    },
    mounted() {
      if (!this.user) {
        this.$router.push('/error?title=User%20not%20found&message=Failed%20to%20fetch%20user%20data')
      }
    }
  }
</script>

<style scoped>

</style>