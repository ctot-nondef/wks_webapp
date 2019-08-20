<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Actors">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="actordialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <list ref="actorlist" EntityType="actor" :headers="listheaders" ></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="actordialog"
          @keydown.esc="actordialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="actordialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create Actor</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-btn color="warning" @click="saveactor()">Save</v-btn>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
              <v-card color="grey lighten-2" class="pa-4 mb-4">
                <v-select v-model="itype" :items="['Person','CorporateBody']" label="Type"></v-select>
                <autocompgnd :value="iactor" :type="itype" :multiple="false" @input="iactor=$event"></autocompgnd>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="importactor()">Import</v-btn>
                  <v-btn color="primary" flat @click.native="iactor=[]">Clear</v-btn>
                </v-layout>
              </v-card>
              <v-card color="grey lighten-2" class="pa-4">
                <actorform v-if="$store.state.api.schemas.actor" :value="newactor" @input="newactor=$event"></actorform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addactor()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="actordialog=false">Discard</v-btn>
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
  /* eslint-disable no-underscore-dangle,no-param-reassign */

  import { mapActions, mapGetters } from 'vuex';

import HELPERS from '../helpers';

import fundamentcard from './Fundament/FundamentCard';
import list from './genericList/list';
import actorform from './Forms/actor_form';
import autocompgnd from './AutoCompleteComponents/AutocompGND';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    mixins: [HELPERS],
    components: {
      fundamentcard,
      list,
      actorform,
      autocompgnd,
    },
    data() {
      return {
        actordialog: false,
        newactor: {},
        iactor: {},
        itype: 'Person',
        listheaders: [
          { text: 'Name', value: 'name', path: 'name' },
          { text: 'Type', value: 'instanceOf', path: 'instanceOf._labels[4].label' },
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
      addactor() {
        if (this.newactor.relations) {
          this.newactor.relations.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        this.post({ type: 'actor', body: this.newactor }).then(() => {
          this.newactor = {};
          this.actordialog = false;
          this.$refs.actorlist.getRecords();
        });
      },
      importactor() {
        if (this.iactor.id) {
          const id = this.iactor.id.split('/').slice(-1)[0];
          this.APIS.GND.DIRECT.get(id).then((res) => {
            console.log(res.data);
            this.newactor = this.mapGNDImport(this.itype, res.data);
          });
        }
      },
    },
    computed: {
      ...mapGetters('api', [
        'apiloaded',
      ]),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
