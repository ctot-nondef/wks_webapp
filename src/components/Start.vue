<template>
  <div class="">
      <fundamentjumbo
        :src="require('../assets/intro_bg.jpg')"
        caption="Vienna Center for the History of Collecting"
        subtitle="Sammler, Sammlungen und Sammlungskulturen in Wien und Mitteleuropa"
      >
      </fundamentjumbo>
      <v-container grid-list-md v-if="$store.state.api.loggedin">
        <v-layout justify-space-around row wrap>
          <fundamentsectiondiv icon="description" caption="Sammlungsdaten"></fundamentsectiondiv>
          <v-flex xs12 sm3
            v-for="(item, i) in $store.state.app.config.menu"
            :key="i"
          >
            <fundamentcard
              :caption="item.caption"
              :link="item.startpage"
            >
              <template v-slot:content>
              </template>
            </fundamentcard>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container  v-if="!$store.state.api.loggedin">
        <v-row align="start">
          <v-col>
            Bitte loggen Sie sich ein um die Datenbank zu benutzen.
          </v-col>
        </v-row>
        <v-row align="start">
          <v-col cols="12" sm="1">
            <v-btn @click="openDialog('loginDialog')" large color="primary">
              LOGIN
            </v-btn>
          </v-col>
          <v-col cols="12" sm="1">
            <v-btn @click="openDialog('resetDialog')" large color="primary">
              RESET PASSWORD
            </v-btn>
          </v-col>
          <v-col></v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import fundamentjumbo from './Fundament/FundamentJumbo';
import fundamentcard from './Fundament/FundamentCard';
import fundamentsectiondiv from './Fundament/FundamentSectionDiv';

export default {
  components: {
    fundamentjumbo,
    fundamentcard,
    fundamentsectiondiv,
  },
  name: 'start',
  data() {
    return {
    };
  },
  methods: {
    ...mapMutations('dialogs', [
      'openCreateDialog',
      'openDialog'
    ]),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
