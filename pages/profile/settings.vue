<template>
  <v-layout column>
    <v-row justify="center" align="center">
      <v-col cols="6">
        <v-card>
          <v-card-title>
            This is a profile settings placeholder page
          </v-card-title>
          <v-card-text>
            Here you will be able to set such things as:
            <v-list two-line>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Profile Username
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    login
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Public ID
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    link to your profile
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Password
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Profile picture
                  </v-list-item-title>
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
    name: "settings",
    middleware: ['auth']
  }
</script>

<style scoped>

</style>