<template>
  <div>
    <transition
      :duration="200"
      name="slideLeft"
      mode="out-in"
    >
      <v-navigation-drawer
        v-if="$store.state.app.drawer"
        :mini-variant="$store.state.app.miniVariant"
        enable-resize-watcher
        :class="$store.state.app.config.color"
        dark
        app
      >
        <v-container
          fill-height
          @mouseover.stop="setNavDrawerMaxi()"
          @mouseleave.stop="setNavDrawerMini()"
        >
          <v-layout
            column
            justify-space-between
          >
            <v-list>
              <v-list-item>
                <v-btn
                  icon
                  @click.stop="toggleNavDrawerClipped()"
                >
                  <v-icon
                    v-if="!$store.state.app.miniVariant"
                    v-html="$store.state.app.drawerclipped?'first_page':'last_page'"
                  />
                </v-btn>
              </v-list-item>
            </v-list>
            <v-list dense>
              <v-list-item
                value="true"
                :to="{ name: 'start', params: { lang: 'en' } }"
                class="navtile"
              >
                <v-list-item-content>
                  <v-icon>home</v-icon>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title class="toolbarcaption">
                    Home
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-for="(item, i) in $store.state.app.config.menu"
                :key="i"
                value="true"
                :to="item.startpage"
                class="navtile"
              >
                <v-list-item-content>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title class="toolbarcaption">
                    {{ item.caption }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="!$store.state.api.loggedin"
                value="true"
                class="navtile"
                @click.stop="openDialog('loginDialog')"
              >
                <v-list-item-content>
                  <v-icon>input</v-icon>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title class="toolbarcaption">
                    LOGIN
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="$store.state.api.loggedin"
                value="true"
                class="navtile"
                @click.stop="openDialog('logoutDialog')"
              >
                <v-list-item-content>
                  <v-icon>power_settings_new</v-icon>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title class="toolbarcaption">
                    LOGOUT
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list dense>
              <v-list-item>
                <router-link :to="{ name: 'start' }">
                  <div class="logo">
                    <h5 style="font-weight: 200; padding: 0px; margin: 0px;letter-spacing: 3px!important; line-height:25px;text-decoration-line: none!important;">
                      VC
                    </h5>
                    <h5 style="font-weight: 800; padding: 0px; margin: 0px;letter-spacing: 2px!important; line-height:25px;text-decoration-line: none!important;">
                      HC
                    </h5>
                  </div>
                  Database
                </router-link>
              </v-list-item>
            </v-list>
          </v-layout>
        </v-container>
      </v-navigation-drawer>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-return-assign: "off" */

export default {
  name: 'FundamentNav',
  data() {
    return {
    };
  },
  methods: {
    ...mapMutations('JSONschema', [
      'constructJSONschema',
    ]),
    ...mapMutations('dialogs', [
      'openDialog',
    ]),
    ...mapActions('app', [
      'toggleAppMode',
    ]),
    ...mapMutations('app', [
      'setConfig',
      'toggleNavDrawerMini',
      'setNavDrawerMini',
      'setNavDrawerMaxi',
      'toggleNavDrawerClipped',
      'toggleRightDrawer',
      'toggleDrawer',
      'toggleNavbar',
    ]),
  },
  created() {
  },
};
</script>
<style scoped>
.compensation {
  margin-left: -15px;
  margin-right: -15px;
}
.toolbarcaption {
  color:white;
}
.logo {
  color:white;
  white-space: nowrap;
  font-family: 'Montserrat', sans-serif;
}

.navtile {
  margin-left: -16px!important;
  margin-right: -16px!important;
}

</style>
