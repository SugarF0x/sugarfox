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
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="isValid">
                <v-text-field label="Email"
                              name="email"
                              prepend-icon="mdi-email"
                              type="email"
                              v-model="formFields.email.input"
                              :rules="formFields.email.rules"
                ></v-text-field>
                <v-text-field id="password"
                              label="Password"
                              name="password"
                              prepend-icon="mdi-lock"
                              type="password"
                              v-model="formFields.password.input"
                              :rules="formFields.password.rules"
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
              <v-btn disabled><v-icon>mdi-vk</v-icon></v-btn>
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
          v-model="alert"
          dense
          dismissible
          type="error"
        >
          Bad credentials
        </v-alert>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        isValid: false,
        alert: false,
        formFields: {
          email: {
            input: '',
            rules: [
              v => !!v || 'Email is required'
            ]
          },
          password: {
            input: '',
            rules: [
              v => !!v || 'Password is required'
            ]
          }
        }
      }
    },
    methods: {
      async loginUser() {
        if (this.isValid) {
          try {
            let response = await this.$auth.loginWith('local', {data: {
              email: this.formFields.email.input,
              password: this.formFields.password.input
            }});
          } catch (err) {
            console.log(err)
          }
        }
      },
      async verify() {
        try {
          let response = await this.$axios.post("/auth/verify", {
            email:    this.formFields.email.input,
            password: this.formFields.password.input
          });
          if (response.data.valid) {
            this.loginUser();
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