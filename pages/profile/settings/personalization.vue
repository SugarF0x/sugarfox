<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <v-card-title class="headline">
        <span>
          This is a <span class="primary--text">personalization</span> child component
        </span>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-row no-gutters v-for="(value, name, index) in options" :key="name">
          <v-col cols="12" v-if="value !== 'Disabled'">
            <v-divider></v-divider>
            <v-row no-gutters align="center">
              <v-col cols="4">
                <v-card-text class="text-center text-capitalize">
                  {{ name }}
                </v-card-text>
              </v-col>
              <v-col cols="4">
                <v-card-text class="text-center">
                  {{ value }}
                </v-card-text>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-btn text
                       @click="change(name)"
                >
                  Change
                </v-btn>
              </v-col>
            </v-row>
            <v-divider v-if="index===Object.keys(options).length-1"></v-divider>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary">
          save changes
        </v-btn>
      </v-card-actions>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: "personalization",
    data() {
      return {
        options: {
          language: 'English',
          theme:    this.$vuetify.theme.isDark ? 'Dark' : 'Light',
          email:    this.$auth.method === 'local' ? this.$auth.email : 'Disabled',
          password: this.$auth.method === 'local' ? '********' : 'Disabled',
          username: this.$auth.user.login,
          address:  this.$auth.user.publicId
        }
      }
    },
    methods: {
      change(prop) {
        console.log(prop);
      }
    }
  }
</script>

<style scoped>

</style>