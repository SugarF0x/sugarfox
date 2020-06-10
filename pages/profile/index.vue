<template>
  <v-content>
    <v-container>
      <v-layout column>
        <v-row justify="center">
          <v-col cols="12" sm="8 md=6">
            <v-card>
              <v-card-title>
                <p class="ma-0">
                  This is <span class="secondary--text">Primary</span> page placeholder
                </p>
              </v-card-title>
              <v-card-text>
                <p>
                  This page will have info on the <span class="primary--text">logged in user</span>
                  or a prompt to login if not authed
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  export default {
    name: "index.vue"
  }
</script>

<style scoped>

</style>