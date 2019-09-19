<template>
  <div class="">
    <v-container grid-list-md>
      <fundamentcard caption="Entries">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12 v-if="$store.state.api.loggedin">
              <v-layout justify-end row fill-height>
                <v-btn fab dark small
                       color="warning"
                       @click="$refs.createdialog.newItem('entry', {})">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <list ref="entrylist" EntityType="entry" :headers="listheaders" ></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <editdialog title="Create Entry" ref="createdialog" @close="$refs.entrylist.getRecords()">
        <template slot="form" slot-scope="props">
          <component :is="componentLoader" :value="props.item" @input="props.item=$event"></component>
        </template>
      </editdialog>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle,no-param-reassign */
import HELPERS from '../helpers';
import fundamentcard from './Fundament/FundamentCard';
import list from './genericList/list';
import editdialog from './editDialog';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  components: {
    fundamentcard,
    list,
    editdialog,
  },
  data() {
    return {
      listheaders: [
        { text: 'Name', value: 'name', path: 'name' },
        { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
        { text: 'Actions' },
      ],
    };
  },
  computed: {
    componentLoader() {
      return () => import('./Forms/entry_form');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
