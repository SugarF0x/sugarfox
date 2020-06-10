<template>
  <v-app dark>
    <v-app-bar
      clipped-left
      fixed
      app
    >
      <router-link to="/" style="text-decoration: none; color: inherit;">
        <v-row justify="center" align="center">
          <v-img src="/sgfx_line.webp" height="2.5rem" width="2.5rem" contain></v-img>
          <v-toolbar-title id="logo">
            SGFX
          </v-toolbar-title>
        </v-row>
      </router-link>
      <v-spacer />
      <span v-if="$auth.loggedIn">
        Logged in as {{ $auth.user.login }}
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
              src="/img/avatar-default.webp"
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
                         :to="n.to"
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
          </div>
          <div v-else>
            <v-list-item to="/profile/login">
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
                       :to="n.to"
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
            to: '/profile/settings'
          },
          {
            icon: 'mdi-cash-usd-outline',
            title: 'Donate on Khram',
            to: '/donate'
          },
          {
            icon: 'mdi-account-arrow-right-outline',
            title: 'Sign out',
            to: '/profile/logout'
          }
        ],
        drawerMisc: [
          {
            icon: 'mdi-alert-outline',
            title: 'Sample action',
            to: '/sample-action'
          },
        ]
      }
    }
  }
</script>

<style scoped lang="less">
  @font-face {
    font-family: 'Kurbanistika';
    //noinspection CssUnknownTarget
    src: url('/fonts/kurbanistika.otf');
  }

  #logo {
    font-family: Kurbanistika, sans-serif;
    font-size: 2.5rem;
  }
</style>