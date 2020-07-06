<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <v-card-title class="headline">
        <span>
          This is a <span class="primary--text">privacy</span> child component
        </span>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-row no-gutters v-for="(value, name) in options" :key="name">
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
  /**
   * Privacy settings child component
   *
   * @category client
   * @subcategory pages
   * @namespace profile.settings.privacy
   *
   * @vue-data {string} options.profile=public  - Who can see user profile
   * @vue-data {string} options.activity=public - Who can see user activity
   * @vue-data {string} options.friends=public  - Who can see user friends
   * @vue-data {string} options.inbox=public    - Who can direct message user
   */
  export default {
    name: "privacy",
    data() {
      return {
        options: {
          profile:  'public',
          activity: 'public',
          friends:  'public',
          inbox:    'public'
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