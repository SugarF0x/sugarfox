<template>
  <v-content>
    <v-container class="fill-height"
                 fluid
    >
      <v-row align="center"
             justify="center"
      >
        <v-col cols="12"
               sm="9"
               md="4"
        >
          <v-card class="elevation-12">
            <v-toolbar flat>
              <v-toolbar-title>Register form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
<!--              TODO: add append-icon based on validator result of said field-->
                <v-text-field label="E-mail"
                              name="email"
                              prepend-icon="mdi-email"
                              type="mail"
                ></v-text-field>
                <v-text-field label="Login"
                              name="login"
                              prepend-icon="mdi-account"
                              type="text"
                ></v-text-field>
                <v-text-field id="password"
                              label="Password"
                              name="password"
                              prepend-icon="mdi-lock"
                              type="password"
                ></v-text-field>
                <v-text-field id="password-repeat"
                              label="Repeat Password"
                              name="password-repeat"
                              prepend-icon="mdi-lock"
                              type="password"
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
              <v-btn disabled>Sign up</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
  export default {
    name: "register"
  }
</script>

<style scoped>

</style>