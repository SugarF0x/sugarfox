<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <v-card-title class="headline">
        <span>
          Profile <span class="primary--text">privacy</span> settings
        </span>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters v-for="(value, name) in options" :key="name">
          <v-col cols="12" v-if="value.value !== 'Disabled'">
            <v-row no-gutters align="center">
              <v-col cols="4">
                <v-card-text class="text-center text-capitalize">
                  {{ name }}
                </v-card-text>
              </v-col>
              <v-col cols="4">
                <v-card-text class="text-center">
                  <v-select v-model="options[name].value"
                            :items="variants"
                            hide-details
                  ></v-select>
                </v-card-text>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-btn text
                       @click="commit(name, value.value)"
                       :loading="value.loading"
                       :disabled="value.value === $auth.user.options.privacy[name]"
                >
                  Change
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <div class="alert">
        <v-alert :type="alert.type"
                 v-model="alert.state"
                 dismissible
        >
          {{ alert.text }}
        </v-alert>
      </div>
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
   * @vue-data {object}  alert                    - Popup alert box data object
   * @vue-data {boolean} alert.state=false        - Alert visibility
   * @vue-data {string}  alert.text='placeholder' - Alert text
   * @vue-data {string}  alert.type='success'     - Alert styling by type
   * @vue-data {string} options.profile=public  - Who can see user profile
   * @vue-data {string} options.activity=public - Who can see user activity
   * @vue-data {string} options.friends=public  - Who can see user friends
   * @vue-data {string} options.inbox=public    - Who can direct message user
   *
   * @vue-event {void} commit      - Send new data to the server to be modified in the DB
   * @vue-event {void} promptAlert - Render alert text for 2.5 seconds
   */
  export default {
    name: "privacy",
    data() {
      return {
        alert: {
          state: false,
          text: 'placeholder',
          type: 'success'
        },
        options: {
          profile: {
            value: this.$auth.user.options.privacy.profile,
            loading: false
          },
          activity: {
            value: this.$auth.user.options.privacy.activity,
            loading: false
          },
          friends: {
            value: this.$auth.user.options.privacy.friends,
            loading: false
          },
          inbox: {
            value: this.$auth.user.options.privacy.inbox,
            loading: false
          }
        },
        variants: [
          'public',
          'private',
          'friends-only'
        ]
      }
    },
    methods: {
      async commit(name, data) {
        this.options[name].loading = true;
        let newData = {
          options: {
            privacy: {
              [name]: data
            }
          }
        };
        await this.$axios.post('/auth/editUserData', newData)
          .then(response => {
            this.promptAlert('success', response.data.message);
          }, reason => {
            this.promptAlert('error', reason);
          });
        this.options[name].loading = false;
        await this.$auth.fetchUser();
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

<style lang="less" scoped>
  .alert {
    position: fixed;
    width: 100vw;
    bottom: 5%;
    left: 0;
    display: flex;
    justify-content: center;
  }
</style>
