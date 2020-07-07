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
            <v-toolbar-title>Register form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form"
                    v-model="isValid"
            >
              <v-text-field label="E-mail"
                            name="email"
                            prepend-icon="mdi-email"
                            type="email"
                            v-model="formFields.email.input"
                            :rules="formFields.email.rules"
                            validate-on-blur
                            @keypress.enter="verify"
              ></v-text-field>
              <v-text-field label="Login"
                            name="login"
                            prepend-icon="mdi-account"
                            counter="32"
                            type="text"
                            v-model="formFields.login.input"
                            :rules="formFields.login.rules"
                            validate-on-blur
                            @keypress.enter="verify"
              ></v-text-field>
              <v-text-field id="password1"
                            label="Password"
                            name="password1"
                            prepend-icon="mdi-lock"
                            counter
                            type="password"
                            v-model="formFields.password1.input"
                            :rules="formFields.password1.rules"
                            validate-on-blur
                            @keypress.enter="verify"
              ></v-text-field>
              <v-text-field id="password2"
                            label="Repeat password"
                            name="password2"
                            prepend-icon="mdi-lock-clock"
                            counter
                            type="password"
                            v-model="formFields.password2.input"
                            :rules="formFields.password2.rules"
                            validate-on-blur
                            @keypress.enter="verify"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn nuxt
                   to="/profile/login"
            >
              <v-icon left>mdi-undo-variant</v-icon>
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="success darken-1"
                   @click="verify"
                   :disabled="!isValid"
            >
              Sign up
              <v-icon right>mdi-account-plus</v-icon>
            </v-btn>
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
   * Profile register form<br>
   * Performs registration based on local strategy<br>
   *   and authorizes user on success
   *
   * @category client
   * @subcategory pages
   * @namespace profile.register
   *
   * @vue-data {object} alert                                                   - Data handling alert message popup
   * @vue-data {boolean} alert.visible=false                                    - Alert message state
   * @vue-data {string} alert.message=''                                        - Alert message text
   * @vue-data {String} formFields.FIELD.input=''                               - Form field input data
   * @vue-data {Array<function>} formFields.(email|password|login).rules=Regexp - Set of validation rules that return boolean true on success and error string on failure
   *
   * @vue-event {void} verify   - Verify user based on input field data via /api/auth/verify call. Execute register on success
   * @vue-event {void} register - Register and authorize user based on formFields data
   */
  export default {
    name: "register",
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
          login: {
            input: '',
            rules: [
              v => !!v                                     || 'Login is required',
              v => (v && v.length <= 32)                   || 'Login must be 32 characters or less',
              v => /^[а-яёa-z0-9].*$/i.test(v)             || 'Login must begin with a letter or a digit',
              v => /^.[а-яёa-z0-9-_ ]*$/i.test(v)          || 'Login may only contain letters and digits as well as - _ symbols and space bar',
              v => /^([а-яА-ЯёЁa-z0-9]+[-. ]?)*$/i.test(v) || 'Login may not contain repetitions of special symbols',
              v => /^.*[а-яёa-z0-9]$/i.test(v)             || 'Login must end with a letter or a digit'
            ]
          },
          password1: {
            input: '',
            rules: [
              v => !!v                  || 'Password is required',
              v => (v && v.length >= 8) || 'Password must be 8 characters or more',
              v => /^\S+$/.test(v)      || 'No spaces are allowed'
            ]
          },
          password2: {
            input: '',
            rules: [
              v => !!v                                   || 'Password is required',
              v => v === this.formFields.password1.input || "Passwords don't match"
            ]
          }
        }
      }
    },
    methods: {
      async verify() {
        await this.$refs.form.validate();
        if (this.isValid) {
          try {
            let response = await this.$axios.post("/auth/verifyRegister", {
              email:    this.formFields.email.input,
              login:    this.formFields.login.input,
              password: this.formFields.password1.input
            }).catch(err => {
              this.alert.visible = true;
              this.alert.message = err.response.data.message;
            });
            if (response) {
              if (response.data.valid) {
                this.register();
              }
            }
          } catch (err) {
            console.log(err)
          }
        }
      },
      async register() {
        try {
          let response = await this.$axios.post("/auth/register", {
            email:    this.formFields.email.input,
            login:    this.formFields.login.input,
            password: this.formFields.password1.input
          });
          if (response.data.result) {
            try {
              await this.$auth.loginWith('local', {data: {
                  email:    this.formFields.email.input,
                  password: this.formFields.password1.input
                }});
            } catch (err) {
              console.log(err)
            }
          } else {
            this.alert = true;
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>

<style scoped>

</style>