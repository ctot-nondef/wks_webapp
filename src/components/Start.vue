<template>
  <div class="">
      <fundamentjumbo
        src="/static/intro_bg.jpg"
        caption="VCHC Projekt Datenbank"
        subtitle=""
      >
      </fundamentjumbo>
      <v-container grid-list-md v-if="$store.state.app.loggedin">
        <v-layout justify-space-around row wrap>
          <fundamentsectiondiv icon="description" caption="Sammlungsdaten"></fundamentsectiondiv>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Anlegen eines neuen Inventars."
            >
              <p class="card-text">
                <v-btn @click="openCreateDialog('inventory')" color="info">Create</v-btn>
              </p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Anlegen einer neuen Sammlung."
              :link="{ name: 'create', params: { lang: 'en' }}"
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
          <fundamentsectiondiv icon="device_hub" caption="Normdaten"></fundamentsectiondiv>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Anlegen einer neuen Person."
              :link="{ name: 'store', params: { lang: 'en' }}"
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Anlegen eines neuen Thesauruseintrags."
              :link="{ name: 'create', params: { lang: 'en' }}"
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container grid-list-md v-if="!$store.state.app.loggedin">
        Bitte loggen Sie sich ein um die Datenbank zu benutzen.
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
    ]),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
