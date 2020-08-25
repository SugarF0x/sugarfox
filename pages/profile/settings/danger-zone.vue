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
                       :loading="button.loading"
                       @click="commit"
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
   * @subcategory pages
   * @namespace profile.settings.danger-zone
   *
   * @vue-data {object}  alert                    - Popup alert box data object
   * @vue-data {boolean} alert.state=false        - Alert visibility
   * @vue-data {string}  alert.text='placeholder' - Alert text
   * @vue-data {string}  alert.type='success'     - Alert styling by type
   * @vue-data {boolean} button.loading - Directs button loading state
   *
   * @vue-event {void} commit      - Send new data to the server to be modified in the DB
   * @vue-event {void} promptAlert - Render alert text for 2.5 seconds
   */
  export default {
    name: "danger-zone",
    data() {
      return {
        alert: {
          state: false,
          text: 'placeholder',
          type: 'success'
        },
        button: {
          loading: false
        }
      }
    },
    methods: {
      async commit() {
        this.button.loading = true;
        let newData = { state: 'deleted' };
        await this.$axios.post('/auth/editUserData', newData)
          .then(response => {
            this.promptAlert('success', response.data.message);
          }, reason => {
            this.promptAlert('error', reason);
          });
        this.button.loading = false;
        await this.$auth.logout();
      },
      promptAlert(type, text) {
        this.alert = {
          state: true,
          text,
          type
        };
        setTimeout(() => {
          this.alert.state=false;
        }, 2500)
      }
    }
  }
</script>

<style scoped>

</style>
