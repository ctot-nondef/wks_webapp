<template>
  <v-layout column justify-space-between>
    <v-dialog
      v-model="transactiondialog"
      @keydown.esc="transactiondialog=false"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      lazy
    >
      <v-card>
        <v-toolbar tabs dark color="primary" >
          <v-btn icon dark @click.native="transactiondialog=false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Select or create Transaction</v-toolbar-title>
          <v-spacer></v-spacer>
          <template v-slot:extension>
            <v-tabs
              dark
              v-model="tabs"
              fixed-tabs
              color="transparent"
              slider-color="white"
            >
              <v-tab href="#select">
                Select
              </v-tab>
              <v-tab href="#create">
                Create
              </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>
        <v-container grid-list-md text-xs-center>
          <v-tabs-items v-model="tabs" class="white elevation-1">
            <v-tab-item key="1" value="select">
              <v-card>
                <list ref="transactionlist" entitytype="transaction" :headers="listheaders" @select="selectTransactionRef($event)" ></list>
              </v-card>
            </v-tab-item>
            <v-tab-item key="2" value="create">
              <v-card>
                <transactionform v-if="$store.state.api.schemas.transaction" :value="newtransaction" @input="newtransaction=$event" ></transactionform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="createAndSelect()">Save & Select</v-btn>
                  <v-btn color="primary" flat @click.native="newtransaction={}">Clear Form</v-btn>
                </v-layout>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign */

  import { mapActions } from 'vuex';
  import transactionform from '../Forms/transaction_form';
  import list from '../genericViews/table';

  export default {
    name: 'transaction_popup',
    components: {
      transactionform,
      list,
    },
    data() {
      return {
        tabs: 'select',
        newtransaction: null,
        transactiondialog: false,
        listheaders: [
          { text: 'ref', value: '_id', path: '_id' },
          { text: 'Date', value: 'date', path: 'date' },
          { text: 'Actor', value: 'actor.id', path: 'actor[0].id.name' },
          { text: 'Actions' },
        ],
        type: '',
      };
    },
    watch: {

    },
    methods: {
      ...mapActions('api', [
        'get',
        'post',
        'delete',
      ]),
      openPopup(type) {
        if (type) this.type = type;
        this.transactiondialog = true;
      },
      selectTransactionRef(e) {
        this.$emit('selectTransactionRef', { ref: e, target: this.type });
        this.transactiondialog = false;
      },
      createAndSelect() {
        this.post({ type: 'transaction', body: this.newtransaction }).then((res) => {
          this.newtransaction = {};
          this.selectTransactionRef(res.data);
        });
      },
    },
  };
</script>

<style scoped>

</style>
