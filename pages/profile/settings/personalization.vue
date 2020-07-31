<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row>
    <v-col cols="12" class="py-0">
      <v-card-title class="headline">
        <span>
          This is a <span class="primary--text">personalization</span> child component
        </span>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters v-for="(value, name) in options" :key="name">
          <v-col cols="12" v-if="value.state !== 'Disabled'">
            <v-form>
              <v-row no-gutters align="center">
                <v-col cols="4">
                  <v-card-text class="text-center text-capitalize">
                    {{ name }}
                  </v-card-text>
                </v-col>
                <v-col cols="4">
                  <v-text-field :placeholder="value.state"
                                :name="name"
                                :type="value.name === 'password' ? 'password' : 'text'"
                                v-model="value.input"
                                :counter="value.counter"
                                :rules="value.rules"
                                validate-on-blur
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="text-center">
                  <v-btn text
                         @click="options[name].action"
                         :disabled="value.input === value.state || value.input === ''"
                  >
                    Change
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
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
          email: {
            type: 'input',
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
            action: () => {}
          },
          password: {
            type: 'input',
            input: '',
            rules: [
              v => !v || (v && v.length >= 8) || 'Name must be 8 characters or more',
              v => !v || /^\S+$/.test(v)      || 'No spaces are allowed'
            ],
            state:  this.$auth.user.method === 'local' ? '********' : 'Disabled',
            action: () => {}
          },
          username: {
            type: 'input',
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
            action: () => {}
          },
          address: {
            type: 'input',
            input: '',
            counter: 32,
            rules: [
              v => !v || (v && v.length <= 32) || 'Address must be 32 characters or less'
            ],
            state: this.$auth.user.publicId,
            action: () => {}
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>