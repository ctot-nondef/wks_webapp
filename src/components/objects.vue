<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Objects">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="objectdialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <list ref="objectlist" EntityType="object" :headers="listheaders" ></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="objectdialog"
          @keydown.esc="objectdialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="objectdialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create Object</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-btn color="warning" @click="addobject()">Save</v-btn>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
            <v-card color="grey lighten-2" class="pa-4">
                <objectform v-if="$store.state.api.schemas.object" :value="newobject" @input="newobject=$event"></objectform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addobject()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="objectdialog=false">Discard</v-btn>
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
import { mapActions, mapGetters } from 'vuex';

import HELPERS from '../helpers';

import fundamentcard from './Fundament/FundamentCard';
import list from './genericList/list';
import objectform from './Forms/object_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  components: {
    fundamentcard,
    list,
    objectform,
  },
  data() {
    return {
      objectdialog: false,
      newobject: {},
      iobject: {},
      itype: 'Object',
      listheaders: [
        { text: 'Name', value: 'name', path: 'name' },
        { text: 'Actions' },
      ],
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    addobject() {
      this.post({ type: 'object', body: this.newobject }).then((res) => {
        this.newobject = {};
        this.objectdialog = false;
        this.$refs.objectlist.getRecords();
      });
    },
  },
  computed: {
    ...mapGetters('api', [
      'apiloaded',
    ]),
  },
  created() {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
