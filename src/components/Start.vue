<template>
  <div class="">
      <fundamentjumbo
        src="/static/intro_bg.jpg"
        caption="VCHC Projekt Datenbank"
        subtitle=""
      >
      </fundamentjumbo>
      <v-container grid-list-md v-if="$store.state.api.loggedin">
        <v-layout justify-space-around row wrap>
          <fundamentsectiondiv icon="description" caption="Sammlungsdaten"></fundamentsectiondiv>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Collections & Inventories"
              :link="{ name: 'collections', params: { lang: 'en' }}"
            >
              <template v-slot:content>
                <h1>Here might be a page title</h1>
              </template>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Identified Objects"
              :link="{ name: 'objects', params: { lang: 'en' }}"
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
          <fundamentsectiondiv icon="device_hub" caption="Normdaten"></fundamentsectiondiv>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Thesaurus"
              :link="{ name: 'descriptors', params: { lang: 'en' }}"
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Actors"
              :link="{ name: 'actors', params: { lang: 'en' }}"
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container grid-list-md v-if="!$store.state.api.loggedin">
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
