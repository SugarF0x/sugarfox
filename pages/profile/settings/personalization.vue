<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row>
    <v-col cols="12" class="py-0">
      <v-card-title class="headline">
        <span>
          This is a <span class="primary--text">personalization</span> child component
        </span>
      </v-card-title>
      <v-card-text class="pa-0"
                   v-for="(optionsValue, optionsName, optionsIndex) in options"
                   :key="optionsName"
      >
        <v-row>
          <v-col cols="12" class="title">
            <span class="mx-5">
              <span class="primary--text text-capitalize">{{ optionsName }}</span> options
            </span>
          </v-col>
        </v-row>
        <v-row v-for="(value, name, index) in options[optionsName]" :key="name">
          <v-col cols="12" v-if="value.state !== 'Disabled'">
            <v-row no-gutters align="center">
              <v-col cols="4">
                <v-card-text class="text-center text-capitalize">
                  {{ name }}
                </v-card-text>
              </v-col>
              <v-col cols="4">
                <v-overflow-btn v-if="value.type==='dropdown'"
                                :items="value.dropdown"
                                v-model="value.input"
                                hide-details
                                class="my-1"
                ></v-overflow-btn>
                <v-text-field v-else
                              :placeholder="value.state"
                              :name="name"
                              :type="value.name === 'password' ? 'password' : 'text'"
                              v-model="value.input"
                              :counter="value.counter"
                ></v-text-field>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-btn text
                       @click="options[optionsName][name].action"
                       :disabled="value.input === value.state || value.input === ''"
                >
                  Change
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
   * Personalization settings child component
   *
   * @category client
   * @subcategory pages
   * @namespace profile.settings.personalization
   *
   * @vue-data {object} options - User configuration object
   *
   * @vue-data {object} options.local                  - User configuration stored locally
   * @vue-data {string} options.local.language=English   - Set language of choice
   * @vue-data {string} options.local.theme=Dark         - Theme of choice
   *
   * @vue-data {object} options.account           - User configuration stored on server
   * @vue-data {string} options.account.email       - Profile email bind
   * @vue-data {string} options.account.password    - Profile access password
   * @vue-data {string} options.account.username    - Profile display name of choice
   * @vue-data {string} options.account.address     - URL address to profile access
   *
   * @todo turn value.state into input/dropdown fields
   * @todo disable CHANGE button for as long as said state fields remain unchanged
   * @todo move Language and Theme selection to the profile drawer footer? question mark?
   * @todo store language and theme states in Local Storage
   */
  export default {
    name: "personalization",
    data() {
      return {
        options: {
          local: {
            language: {
              type: 'dropdown',
              dropdown: [
                'English',
                'Russian'
              ],
              input: 'English', // fetch currently selected from Local Storage
              state: 'English',
              action: () => {}
            },
            theme: {
              type: 'dropdown',
              dropdown: [
                'Dark',
                'Light'
              ],
              input: '',
              state: this.$vuetify.theme.isDark ? 'Dark' : 'Light',
              action: () => {}
            }
          },
          account: {
            email: {
              type: 'input',
              input: '',
              state: this.$auth.method === 'local' ? this.$auth.email : 'Disabled',
              action: () => {}
            },
            password: {
              type: 'input',
              input: '',
              state:  this.$auth.method === 'local' ? '********' : 'Disabled',
              action: () => {}
            },
            username: {
              type: 'input',
              input: '',
              counter: 32,
              rules: [
                v => (v && v.length <= 32)                   || 'Login must be 32 characters or less',
                v => /^[а-яёa-z0-9].*$/i.test(v)             || 'Login must begin with a letter or a digit',
                v => /^.[а-яёa-z0-9-_ ]*$/i.test(v)          || 'Login may only contain letters and digits as well as - _ symbols and space bar',
                v => /^([а-яА-ЯёЁa-z0-9]+[-. ]?)*$/i.test(v) || 'Login may not contain repetitions of special symbols',
                v => /^.*[а-яёa-z0-9]$/i.test(v)             || 'Login must end with a letter or a digit'
              ],
              state: this.$auth.user.login,
              action: () => {}
            },
            address: {
              type: 'input',
              input: '',
              counter: 32,
              rules: [
                v => (v && v.length <= 32) || 'Address must be 32 characters or less'
              ],
              state: this.$auth.user.publicId,
              action: () => {}
            }
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>