<template>
  <v-content>
    <v-container class="fill-height"
                 fluid
    >
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
                ></v-text-field>
                <v-text-field label="Login"
                              name="login"
                              prepend-icon="mdi-account"
                              counter="32"
                              type="text"
                              v-model="formFields.login.input"
                              :rules="formFields.login.rules"
                              validate-on-blur
                ></v-text-field>
                <v-text-field id="password1"
                              label="Password"
                              name="password1"
                              prepend-icon="mdi-lock"
                              type="password"
                              v-model="formFields.password1.input"
                              :rules="formFields.password1.rules"
                              validate-on-blur
                ></v-text-field>
                <v-text-field id="password2"
                              label="Repeat password"
                              name="password2"
                              prepend-icon="mdi-lock-clock"
                              type="password"
                              v-model="formFields.password2.input"
                              :rules="formFields.password2.rules"
                              validate-on-blur
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
                     @click="$refs.form.validate()"
                     :disabled="!isValid"
              >
                Sign up
                <v-icon right>mdi-account-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
  export default {
    name: "register",
    data() {
      return {
        isValid: false,
        formFields: {
          email: {
            input: '',
            rules: [
              v => !!v || 'E-mail is required',
              v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
            ]
          },
          login: {
            input: '',
            rules: [
              v => !!v || 'Name is required',
              v => (v && v.length <= 32) || 'Name must be 32 characters or less'
            ]
          },
          password1: {
            input: '',
            rules: [
              v => !!v || 'Password is required',
              v => (v && v.length >= 8) || 'Name must be 8 characters or more'
            ]
          },
          password2: {
            input: '',
            rules: [
              v => !!v || 'Password is required',
              v => v === this.formFields.password1.input || "Passwords don't match"
            ]
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>