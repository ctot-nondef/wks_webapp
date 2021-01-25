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
          <v-flex xs12 sm3>
            <fundamentcard
              caption="Search"
              :link="{ name: 'entries', params: { lang: 'en' }}"
            >
              <template v-slot:content>
              </template>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm3>
            <fundamentcard
                caption="Collections"
                :link="{ name: 'collections', params: { lang: 'en' }}"
            >
              <template v-slot:content>
              </template>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm3>
            <fundamentcard
                caption="Entries"
                :link="{ name: 'entries', params: { lang: 'en' }}"
            >
              <template v-slot:content>
              </template>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm3>
            <fundamentcard
              caption="Identified Objects"
              :link="{ name: 'objects', params: { lang: 'en' }}"
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm3>
            <fundamentcard
                caption="Actors"
                :link="{ name: 'actors', params: { lang: 'en' }}"
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm3>
            <fundamentcard
                caption="Transactions"
                link=""
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm3>
            <fundamentcard
                caption="Inventories & Catalogs"
                link=""
            >
              <p class="card-text"></p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm3>
            <fundamentcard
                caption="Filter"
                link=""
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
