<template>
  <div class="">
    <fundamentjumbo
      :src="require('../assets/intro_bg.jpg')"
      caption="Vienna Center for the History of Collecting"
      subtitle="Sammler, Sammlungen und Sammlungskulturen in Wien und Mitteleuropa"
    />
    <v-container
      v-if="$store.state.api.loggedin"
      grid-list-md
    >
      <v-layout
        justify-space-around
        row
        wrap
      >
        <fundamentsectiondiv
          icon="description"
          caption="Sammlungsdaten"
        />
        <v-flex
          v-for="(item, i) in $store.state.app.config.menu"
          :key="i"
          xs12
          sm3
        >
          <fundamentcard
            :buttoncaption="`More (${counts[item.startpage.params.entity]})`"
            :caption="`${item.caption}`"
            :link="item.startpage"
          >
            <template #content />
          </fundamentcard>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container v-if="!$store.state.api.loggedin">
      <v-row align="start">
        <v-col>
          Bitte loggen Sie sich ein um die Datenbank zu benutzen.
        </v-col>
      </v-row>
      <v-row align="start">
        <v-col
          cols="12"
          sm="1"
        >
          <v-btn
            large
            color="primary"
            @click="openDialog('loginDialog')"
          >
            LOGIN
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          sm="1"
        >
          <v-btn
            large
            color="primary"
            @click="openDialog('resetDialog')"
          >
            RESET PASSWORD
          </v-btn>
        </v-col>
        <v-col />
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
  name: 'Start',
  components: {
    fundamentjumbo,
    fundamentcard,
    fundamentsectiondiv,
  },
  data() {
    return {
      counts: {
        entry: 0,
        collect: 0,
        actor: 0,
        object: 0,
        transaction: 0,
        descriptor: 0,
        inventory: 0,
      }
    };
  },
  methods: {
    ...mapMutations('dialogs', [
      'openCreateDialog',
      'openDialog'
    ]),
  },
  mounted() {
    Object.keys(this.counts).forEach((id) => {
      this.$store.state.api.apiclient.apis[id][`get_api_v1_${id}_count`]()
          .then(c => {
            this.counts[id] = c.body.count;
          });
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
