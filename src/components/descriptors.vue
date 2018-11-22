<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Descriptors">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="descriptordialog=true">
                  <v-icon dark>edit</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <descriptorlist ref="descriptorlist"></descriptorlist>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="descriptordialog"
          @keydown.esc="descriptordialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          scrollable
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="descriptordialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create descriptor</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-menu bottom right offset-y>
                <v-btn slot="activator" dark icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </v-menu>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
              <v-card color="grey lighten-2" class="pa-4 mb-4">
                <v-select v-model="itype" :items="['PlaceOrGeographicName','SubjectHeading']" label="Type"></v-select>
                <autocompgnd :value="idescriptor" :type="itype" :multiple="false" @input="idescriptor=$event"></autocompgnd>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="importdescriptor()">Import</v-btn>
                  <v-btn color="primary" flat @click.native="idescriptor=[]">Clear</v-btn>
                </v-layout>
              </v-card>
              <v-card color="grey lighten-2" class="pa-4">
                <descriptorform :value="newdescriptor" @input="newdescriptor=$event"></descriptorform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="adddescriptor()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="descriptordialog=false">Discard</v-btn>
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

import HELPERS from '../helpers';

import fundamentcard from './Fundament/FundamentCard';
import descriptorlist from './descriptor_list';
import descriptorform from './descriptor_form';
import autocompgnd from './AutocompGND';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  components: {
    fundamentcard,
    descriptorlist,
    descriptorform,
    autocompgnd,
  },
  data() {
    return {
      descriptordialog: false,
      newdescriptor: {},
      idescriptor: {},
      itype: 'PlaceOrGeographicName',
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    adddescriptor() {
      if(this.newdescriptor.place) this.newdescriptor.place.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      if(this.newdescriptor.collector) this.newdescriptor.collector.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      this.post({ type: 'descriptor', body: this.newdescriptor }).then((res) => {
        this.newdescriptor = {};
        this.descriptordialog = false;
        this.$refs.descriptorlist.getRecords();
      });
    },
    importdescriptor() {
      if(this.idescriptor.id) {
        let id = this.idescriptor.id.split('/').slice(-1)[0];
        this.APIS.GND.DIRECT.get(id).then((res) => {
          console.log(res.data);
          this.newdescriptor = this.mapGNDImport(this.itype, res.data);
        });
      }
    },
  },
  computed: {
  },
  created() {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
