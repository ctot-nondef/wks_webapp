<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard :caption="view.name">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="entrydialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <list ref="entrylist" EntityType="entry" :Headers="listheaders" :filter="{ partOf: this.$route.params.id }"></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="entrydialog"
          @keydown.esc="entrydialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="entrydialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create Entry</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-btn color="warning" @click="addEntry()">Save</v-btn>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
              <v-card color="grey lighten-2" class="pa-4">
                <entryform v-if="$store.state.api.schemas.entry" :value="newentry" @input="newentry=$event"></entryform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addEntry()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="entrydialog=false">Discard</v-btn>
                </v-layout>
              </v-card>
            </v-container>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
    <v-container grid-list-md v-if="!$store.state.app.loggedin">
      Bitte loggen Sie sich ein um die Datenbank zu benutzen.
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import fundamentcard from '../Fundament/FundamentCard';
import list from '../genericList/list';
import entryform from '../Forms/entry_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    list,
    entryform,
  },
  data() {
    return {
      view: {},
      data: [],
      listheaders: [
        { text: 'Name', value: 'name', path: 'name' },
        { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
        { text: 'Actions' },
      ],
      entrydialog: false,
      newentry: {},
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    addEntry() {
      this.post({ type: 'entry', body: this.newentry }).then((res) => {
        this.$refs.entrylist.getRecords();
        this.newentry = {
          partOf: this.view,
        };
      });
      this.entrydialog = false;
    },
  },
  computed: {
  },
  created() {
    this.get({ type: 'Inventory', id: this.$route.params.id }).then((res) => {
      this.view = res.data;
      this.newentry = {
        partOf: res.data,
      };
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
