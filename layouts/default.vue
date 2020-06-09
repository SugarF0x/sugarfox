<template>
  <v-app dark>
    <v-app-bar
      clipped-left
      fixed
      app
    >
      <v-toolbar-title>
        SGFX
      </v-toolbar-title>
      <v-spacer />
      <span v-if="$auth.loggedIn">
        Logged in as ____ <!-- TODO: add user login here -->
      </span>
      <span v-else>
        Not logged in <v-icon>mdi-arrow-right</v-icon>
      </span>
      <v-btn
        icon
        @click.stop="drawer = !drawer"
      >
        <v-icon>mdi-account-cog-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer
      v-model="drawer"
      right
      temporary
      fixed
    >
      <v-container>
        <v-row align="center" justify="center">
          <v-avatar size="100" color="info">
            <!--suppress HtmlUnknownTarget -->
            <img
              src="/avatar-default.webp"
              alt="avatar-default.webp"
            >
          </v-avatar>
        </v-row>
      </v-container>
      <v-list>
        <v-list-item-group>
          <div v-if="$auth.loggedIn">
            <v-list-item v-for="n in drawerAuthedItems"
                         :key="n.title"
            >
              <!--
                      @click.stop="n.action"
              -->
              <v-list-item-icon>
                <v-icon>{{ n.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ n.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div v-else>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-arrow-left-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  Sign in
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <v-divider></v-divider>
          <v-list-item v-for="n in drawerMisc"
                       :key="n.title"
          >
            <v-list-item-icon>
              <v-icon>{{ n.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ n.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-footer fixed>
<!--      <span>&copy; {{ new Date().getFullYear() }}</span>-->
      <v-spacer></v-spacer>
      <span>le footer</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false,
        /* TODO: add actions and introduce them in template elements
            > the location is commented in the template
         */
        drawerAuthedItems: [
          {
            icon: 'mdi-account-edit-outline',
            title: 'Edit account',
            action: ''
          },
          {
            icon: 'mdi-cash-usd-outline',
            title: 'Donate on Khram',
            action: ''
          },
          {
            icon: 'mdi-account-arrow-right-outline',
            title: 'Sign out',
            action: ''
          }
        ],
        drawerMisc: [
          {
            icon: 'mdi-alert-outline',
            title: 'Sample action',
            action: ''
          },
        ]
      }
    }
  }
</script>