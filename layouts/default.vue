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
            <img
              src="/avatar-default.webp"
              alt="avatar-default.webp"
            >
          </v-avatar>
        </v-row>
      </v-container>
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="n in drawerItems"
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
        /* TODO: add actions and introduce them in emplate elements
            > the location is commented in the template
         */
        drawerItems: [
          {
            icon: 'mdi-account-arrow-left-outline',
            title: 'Sign in',
            action: ''
          },
          {
            icon: 'mdi-account-arrow-right-outline',
            title: 'Sign out',
            action: ''
          },
          {
            icon: 'mdi-account-edit-outline',
            title: 'Edit account',
            action: ''
          },
          {
            icon: 'mdi-alert-outline',
            title: 'Sample action',
            action: ''
          },
          {
            icon: 'mdi-cash-usd-outline',
            title: 'Donate on Khram',
            action: ''
          }
        ]
      }
    }
  }
</script>