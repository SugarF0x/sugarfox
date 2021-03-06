<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app>
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
        <span class="secondary--text">{{ $auth.user.login }}</span>
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
    <v-content app>
      <v-container fluid>
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
          <v-avatar size="100">
            <!--suppress HtmlUnknownTarget -->
            <img v-if="!$auth.user || $auth.user.avatar === undefined"
                 src="/img/avatar-default.webp"
                 alt="avatar-default.webp"
            >
            <img v-else
                 :src="$auth.user.avatar"
                 alt="avatar-user.jpg">
          </v-avatar>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <v-list class="py-0">
        <v-list-item-group>
          <div v-if="$auth.loggedIn">
            <v-list-item v-for="n in drawerAuthedItems"
                         :key="n.title"
                         :to="n.to"
                         :exact="n.exact || false"
                         @click="exec(n.action)"
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

      <template v-slot:append>
        <v-divider></v-divider>
        <v-container>
          <v-row>
            <v-col cols="12"
                   v-for="(value, name) in drawerFooter"
                   :key="name"
            >
              <v-select v-model="value.input"
                        :items="value.dropdown"
                        :label="name"
                        hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-navigation-drawer>
    <v-footer app absolute>
      <v-spacer></v-spacer>
      <span>quotes be here</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false,
        drawerAuthedItems: [
          {
            icon: 'mdi-account-outline',
            title: 'Profile',
            to: this.$auth.loggedIn ? `/profile/${this.$auth.user.publicId}` : '/profile',
            action: '',
            exact: true
          },{
            icon: 'mdi-account-cog-outline',
            title: 'Edit profile',
            to: '/profile/settings',
            action: ''
          },{
            icon: 'mdi-cash-usd-outline',
            title: 'Donate on Khram',
            to: '/donate',
            action: ''
          },{
            icon: 'mdi-account-arrow-right-outline',
            title: 'Sign out',
            to: '',
            action: "signOut"
          }
        ],
        drawerMisc: [
          {
            icon: 'mdi-alert-outline',
            title: 'Sample action',
            to: '/sample-action',
            action: ''
          },
        ],
        drawerFooter: {
          language: {
            dropdown: [
              'English',
              'Russian'
            ],
            input: 'English', // fetch currently selected from Local Storage
            state: 'English',
            action: () => {}
          },
          theme: {
            dropdown: [
              'Dark',
              'Light'
            ],
            input: '',
            state: this.$vuetify.theme.isDark ? 'Dark' : 'Light',
            action: () => {
              let isDark = this.options.local.theme.input === 'Dark';
              localStorage.setItem('dark', isDark);
              this.$vuetify.theme.dark = isDark;
              this.options.local.theme.state = this.options.local.theme.input;
            }
          }
        }
      }
    },
    computed: {
      theme() {
        return this.drawerFooter.theme.input
      },
      lang() {
        return this.drawerFooter.language.input
      }
    },
    watch: {
      theme(val) {
        let isDark = val === 'Dark';
        localStorage.setItem('dark', isDark);
        this.$vuetify.theme.dark = isDark;
        this.drawerFooter.theme.state = val;
      },
      lang(val) {
        // TODO: language setter be here
      }
    },
    methods: {
      signOut() {
        this.$auth.logout();
        this.$auth.redirect('logout');
      },
      exec(action) {
        // noinspection JSRedundantSwitchStatement
        switch (action) {
          case 'signOut':
            this.signOut();
            break;
        }
      }
    },
    mounted() {
      this.drawerFooter.theme.input = localStorage.getItem('dark') === 'true' ? 'Dark' : 'Light'
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