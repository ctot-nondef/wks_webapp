<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.api.loggedin">
      <fundamentcard caption="Transactions">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="transactiondialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <list ref="transactionlist" EntityType="transaction" :headers="listheaders" ></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="transactiondialog"
          @keydown.esc="transactiondialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="transactiondialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create transaction</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-btn color="warning" @click="addtransaction()">Save</v-btn>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
            <v-card color="grey lighten-2" class="pa-4">
                <transactionform v-if="$store.state.api.schemas.transaction" :value="newtransaction" @input="newtransaction=$event"></transactionform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addtransaction()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="transactiondialog=false">Discard</v-btn>
                </v-layout>
              </v-card>
            </v-container>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
    <v-container grid-list-md v-if="!$store.state.api.loggedin">
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
import transactionform from './Forms/transaction_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    mixins: [HELPERS],
    components: {
      fundamentcard,
      list,
      transactionform,
    },
    data() {
      return {
        transactiondialog: false,
        newtransaction: {},
        itransaction: {},
        itype: 'Transaction',
        listheaders: [
          { text: 'Date', value: 'date' },
          { text: 'Actor', value: 'actor[0].id.name' },
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
      addtransaction() {
        if (this.newtransaction.price) {
          this.newtransaction.price.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        if (this.newtransaction.actor) {
          this.newtransaction.actor.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        this.post({ type: 'transaction', body: this.newtransaction }).then((res) => {
          this.newtransaction = {};
          this.transactiondialog = false;
          this.$refs.transactionlist.getRecords();
        });
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
