<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Descriptors">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12 v-if="!$store.state.app.loggedin">
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="descriptordialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <filterlist entitytype="descriptor" :filter="query" @update="query = $event.filter" :fixedtype="true"></filterlist>
            </v-flex>
            <v-flex xs12>
              <list ref="descriptorlist" EntityType="descriptor" :filter="query" :headers="listheaders" ></list>
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
              <v-btn color="warning" @click="adddescriptor()">Save</v-btn>
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
                <descriptorform v-if="$store.state.api.schemas.descriptor" :value="newdescriptor" @input="newdescriptor=$event"></descriptorform>
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
  </div>
</template>

<script>
  /* eslint-disable no-param-reassign,no-underscore-dangle */

  import { mapActions } from 'vuex';

import HELPERS from '../helpers';

import fundamentcard from './Fundament/FundamentCard';
import list from './genericList/list';
import filterlist from './genericList/filter';
import descriptorform from './Forms/descriptor_form';
import autocompgnd from './AutoCompleteComponents/AutocompGND';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    mixins: [HELPERS],
    components: {
      fundamentcard,
      list,
      filterlist,
      descriptorform,
      autocompgnd,
    },
    data() {
      return {
        descriptordialog: false,
        newdescriptor: {},
        idescriptor: {},
        itype: 'PlaceOrGeographicName',
        listheaders: [
          { text: 'Name', value: 'name', path: 'name' },
          { text: 'Type', value: 'instanceOf', path: 'instanceOf._labels[4].label' },
          { text: 'Description', value: 'description', path: 'description' },
          { text: 'Actions' },
        ],
        query: {'name':{'$regex':''}, instanceOf: null},
      };
    },
    methods: {
      ...mapActions('api', [
        'get',
        'post',
        'delete',
      ]),
      adddescriptor() {
        this.post({ type: 'descriptor', body: this.newdescriptor }).then((res) => {
          this.newdescriptor = {};
          this.descriptordialog = false;
          this.$refs.descriptorlist.getRecords();
        });
      },
      importdescriptor() {
        if (this.idescriptor.id) {
          const id = this.idescriptor.id.split('/').slice(-1)[0];
          this.APIS.GND.DIRECT.get(id).then((res) => {
            this.newdescriptor = this.mapGNDImport(this.itype, res.data);
          });
        }
      },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
