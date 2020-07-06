<template>
  <v-layout column>
    <v-row align="center"
           justify="center"
    >
      <v-col cols="12"
             sm="8"
             md="6"
             lg="5"
             xl="4"
      >
        <v-card class="elevation-12">
          <v-toolbar flat>
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="isValid"
                    ref="form"
            >
              <v-text-field label="Email"
                            name="email"
                            prepend-icon="mdi-email"
                            type="email"
                            v-model="formFields.email.input"
                            :rules="formFields.email.rules"
                            validate-on-blur
                            @keypress.enter="verify"
              ></v-text-field>
              <v-text-field id="password"
                            label="Password"
                            name="password"
                            prepend-icon="mdi-lock"
                            type="password"
                            v-model="formFields.password.input"
                            :rules="formFields.password.rules"
                            validate-on-blur
                            @keypress.enter="verify"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn nuxt
                   to="/profile/register"
            >
              <v-icon left>mdi-account-plus</v-icon>
              Register
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn :disabled="!isValid"
                   class="success darken-1"
                   @click="verify"
            >
              Sign in
              <v-icon right>mdi-account-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$auth.loginWith('vk')"><v-icon>mdi-vk</v-icon></v-btn>
            <v-btn disabled><v-icon>mdi-facebook</v-icon></v-btn>
            <v-btn disabled><v-icon>mdi-twitter</v-icon></v-btn>
            <v-btn disabled><v-icon>mdi-google</v-icon></v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-alert
        v-model="alert.visible"
        dense
        dismissible
        type="error"
      >
        {{ alert.message }}
      </v-alert>
    </v-row>
  </v-layout>
</template>

<script>
  /**
   * Login page<br>
   * Performs authorization based on local strategy<br>
   *   as well as third-party oauth2 strategies<br>
   *   like VK, FB, Google and Github<br>
   *     (the latter three are not implemented)
   *
   * @category client
   * @subcategory pages
   * @namespace profile.login
   *
   * @vue-data {object} alert - Data handling alert message popup
   * @vue-data {boolean} alert.visible=false - Alert message state
   * @vue-data {string} alert.message='' - Alert message text
   * @vue-data {String} formFields.FIELD.input='' - Form field input data
   * @vue-data {Array<function>} formFields.(email|password).rules=Regexp - Set of validation rules that return boolean true on success and error string on failure
   *
   * @vue-event {void} verifyUser - Verify user based on input field data via /api/auth/verify call. Execute loginUser on success
   * @vue-event {void} loginUser - Authorize user based on formFields data
   */
  export default {
    name: "login",
    data() {
      return {
        isValid: false,
        alert: {
          visible: false,
          message: ''
        },
        formFields: {
          email: {
            input: '',
            rules: [
              v => !!v                                     || 'E-mail is required',
              v => /^[a-z0-9.-@]*$/i.test(v)               || 'Only digits, latin letters as well as . and - are allowed',
              v => /^[a-z0-9].*$/i.test(v)                 || 'Email must begin with digit or a latin letter',
              v => /^.*@.*$/i.test(v)                      || 'Email must contain @ symbol',
              v => /^([a-z0-9]+[-.]?)*@.*$/i.test(v)       || 'Symbol repetition is not allowed',
              v => /^.*[a-z0-9]@.*$/i.test(v)              || 'A digit or a latin letter is to be before @ symbol',
              v => /^.*@[a-z0-9].*$/i.test(v)              || 'Domain is to begin with a digit or a latin letter',
              v => /^.*@(.+\.+)+.*$/i.test(v)              || 'Domain must contain at least one dot',
              v => /^.*@([a-z0-9]+[-.]?)*[a-z]*$/i.test(v) || 'Domain symbol repetition is not allowed',
              v => /^.*[0-9a-z]$/i.test(v)                 || 'Domain must end with either a digit or a latin letter'
            ]
          },
          password: {
            input: '',
            rules: [
              v => !!v                  || 'Password is required',
              v => (v && v.length >= 8) || 'Password must be 8 characters or more',
              v => /^\S+$/.test(v)      || 'No spaces are allowed'
            ]
          }
        }
      }
    },
    methods: {
      async loginUser() {
        try {
          await this.$auth.loginWith('local', {data: {
            email:    this.formFields.email.input,
            password: this.formFields.password.input
          }});
        } catch (err) {
          console.log(err)
        }
      },
      async verify() {
        await this.$refs.form.validate();
        if (this.isValid) {
          try {
            let response = await this.$axios.post("/auth/verify", {
              email:    this.formFields.email.input,
              password: this.formFields.password.input
            }).catch((err) => {
              this.alert.visible = true;
              this.alert.message = err.response.data.message;
            });
            if (response) {
              if (response.data.result) {
                this.loginUser();
              }
            }
          } catch (err) {
            console.log(err)
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>