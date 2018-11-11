<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Collections">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="collectiondialog=true">
                  <v-icon dark>edit</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <collectionlist ref="collectionlist"></collectionlist>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
    </v-container>
    <v-dialog v-model="collectiondialog" persistent max-width="600px" @keydown.esc="collectiondialog=false">
      <fundamentcard caption="Create Collection">
        <div slot="content">
          <v-card color="grey lighten-2" class="pa-4">
            <collectionform @input="newcollection=$event"></collectionform>
            <v-layout justify-end row fill-height>
              <v-btn color="warning" @click="addCollection()">Save</v-btn>
              <v-btn color="primary" flat @click.native="collectiondialog=false">Discard</v-btn>
            </v-layout>
          </v-card>
        </div>
      </fundamentcard>
    </v-dialog>
    <v-container grid-list-md v-if="!$store.state.app.loggedin">
      Bitte loggen Sie sich ein um die Datenbank zu benutzen.
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import fundamentcard from './Fundament/FundamentCard';
import collectionlist from './collection_list'


/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    collectionlist,
  },
  data() {
    return {
      collectiondialog: false,
      newcollection: {},
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
  },
  computed: {
  },
  created() {
    this.get({ type: 'Collect' }).then((res) => {
      this.data = res.data;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
