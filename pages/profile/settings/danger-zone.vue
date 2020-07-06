<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <v-card-title class="headline">
        <span>
          This is a <span class="error--text">danger-zone</span> child component
        </span>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-divider></v-divider>
            <v-row no-gutters align="center" class="error--text">
              <v-col cols="4">
                <v-card-text class="text-center">
                  Delete account
                </v-card-text>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="4" class="text-center">
                <v-btn text
                       class="error--text"
                >
                  delete
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script>
  /**
   * Danger-zone settings child component<br>
   * Here user can delete their profile
   *
   * @category client
   * @subcategory profile
   * @namespace danger-zone
   * @memberOf module:profile.settings
   */
  export default {
    name: "danger-zone"
  }
</script>

<style scoped>

</style>