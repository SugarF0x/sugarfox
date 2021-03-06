<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row>
    <v-col cols="12" class="py-0">
      <v-card-title class="headline">
        <span>
          Profile <span class="primary--text">personalization</span> settings
        </span>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters v-for="(value, name, index) in options" :key="name">
          <v-col cols="12" v-show="value.state !== 'Disabled'">
            <v-form ref="form" @submit.prevent>
              <v-row no-gutters align="center">
                <v-col cols="4">
                  <v-card-text class="text-center text-capitalize">
                    {{ name }}
                  </v-card-text>
                </v-col>
                <v-col cols="4">
                  <v-text-field :placeholder="value.state"
                                :name="name"
                                :type="name === 'password'
                                       ? 'password'
                                       : 'text'"
                                v-model= "value.input"
                                :counter="value.counter"
                                :rules=  "value.rules"
                                validate-on-blur
                                @keypress.enter="canCommit(value, index)
                                               ? value.action(name, value.input)
                                               : {}"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="text-center">
                  <v-btn text
                         :loading="value.loading"
                         @click=  "value.action(name, value.input)"
                         :disabled="!canCommit(value, index)"
                  >
                    Change
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
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
   * Personalization settings child component
   *
   * @category client
   * @subcategory pages
   * @namespace profile.settings.personalization
   *
   * @vue-data {object}  alert                    - Popup alert box data object
   * @vue-data {boolean} alert.state=false        - Alert visibility
   * @vue-data {string}  alert.text='placeholder' - Alert text
   * @vue-data {string}  alert.type='success'     - Alert styling by type
   * @vue-data {object} options          - User personalization configuration
   * @vue-data {string} options.email    - Profile email bind
   * @vue-data {string} options.password - Profile access password
   * @vue-data {string} options.username - Profile display name of choice
   * @vue-data {string} options.address  - URL address to profile access
   *
   * @vue-event {boolean} canCommit   - Validate commit data
   * @vue-event {void}    commit      - Send new data to the server to be modified in the DB
   * @vue-event {void}    promptAlert - Render alert text for 2.5 seconds
   */
  export default {
    name: "personalization",
    data() {
      return {
        alert: {
          state: false,
          text: 'placeholder',
          type: 'success'
        },
        options: {
          email: {
            type: 'input',
            loading: false,
            input: '',
            rules: [
              v => !v || /^[a-z0-9.-@]*$/i.test(v)               || 'Only digits, latin letters as well as . and - are allowed',
              v => !v || /^[a-z0-9].*$/i.test(v)                 || 'Email must begin with digit or a latin letter',
              v => !v || /^.*@.*$/i.test(v)                      || 'Email must contain @ symbol',
              v => !v || /^([a-z0-9]+[-.]?)*@.*$/i.test(v)       || 'Symbol repetition is not allowed',
              v => !v || /^.*[a-z0-9]@.*$/i.test(v)              || 'A digit or a latin letter is to be before @ symbol',
              v => !v || /^.*@[a-z0-9].*$/i.test(v)              || 'Domain is to begin with a digit or a latin letter',
              v => !v || /^.*@(.+\.+)+.*$/i.test(v)              || 'Domain must contain at least one dot',
              v => !v || /^.*@([a-z0-9]+[-.]?)*[a-z]*$/i.test(v) || 'Domain symbol repetition is not allowed',
              v => !v || /^.*[0-9a-z]$/i.test(v)                 || 'Domain must end with either a digit or a latin letter'
            ],
            state: this.$auth.user.method === 'local' ? this.$auth.user.email : 'Disabled',
            action: (name, data) => {
              this.commit(name, data)
            }
          },
          password: {
            type: 'input',
            loading: false,
            input: '',
            rules: [
              v => !v || (v && v.length >= 8) || 'Name must be 8 characters or more',
              v => !v || /^\S+$/.test(v)      || 'No spaces are allowed'
            ],
            state:  this.$auth.user.method === 'local' ? '********' : 'Disabled',
            action: (name, data) => {
              this.commit(name, data)
            }
          },
          login: {
            type: 'input',
            loading: false,
            input: '',
            counter: 32,
            rules: [
              v => !v || (v && v.length <= 32)                   || 'Login must be 32 characters or less',
              v => !v || /^[а-яёa-z0-9].*$/i.test(v)             || 'Login must begin with a letter or a digit',
              v => !v || /^.[а-яёa-z0-9-_ ]*$/i.test(v)          || 'Login may only contain letters and digits as well as - _ symbols and space bar',
              v => !v || /^([а-яА-ЯёЁa-z0-9]+[-. ]?)*$/i.test(v) || 'Login may not contain repetitions of special symbols',
              v => !v || /^.*[а-яёa-z0-9]$/i.test(v)             || 'Login must end with a letter or a digit'
            ],
            state: this.$auth.user.login,
            action: (name, data) => {
              this.commit(name, data)
            }
          },
          address: {
            type: 'input',
            loading: false,
            input: '',
            counter: 32,
            rules: [
              v => !v || (v && v.length <= 32)    || 'Address must be 32 characters or less',
              v => !v || /^[a-z0-9_-]*$/i.test(v) || 'Only digits, latin letters as well as _ and - are allowed',
              v => /^id\d+$/.test(v)              || 'Address can not replicate default id route (e.g. /id123)'
            ],
            state: this.$auth.user.publicId,
            action: (name, data) => {
              this.commit(name, data)
            }
          }
        }
      }
    },
    methods: {
      canCommit(value, index) {
        return value.input !== value.state
            && value.input !== ''
            && !value.loading
            && this.$refs.form[index].validate()
      },
      /* TODO: fix bit where only error message is displayed when commit fails
          -> lookup what i did back at login/register page and do the same
       */

      /* TODO: change every publicId instance to address instance for clarity
          > many places use different keys - either address or publicId
            should be unified
       */
      async commit(name, data) {
        this.options[name].loading = true;
        let newData = {};
            newData[name] = data;
        await this.$axios.post('/auth/editUserData', newData)
          .then(response => {
            this.promptAlert('success', response.data.message);
          }, reason => {
            this.promptAlert('error', reason);
          });
        this.options[name].loading = false;
        await this.$auth.fetchUser();
        name === 'address'
        ? this.options.address.state = this.$auth.user.publicId
        : this.options[name].state = this.$auth.user[name];
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
