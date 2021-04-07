<template>
  <v-container fluid>
    <v-row dense>
      <!-- toolbar -->
      <v-col cols="12">
        <v-row justify="end">
          <v-btn icon ripple @click="intexpanded = !intexpanded">
            <v-icon>{{ intexpanded ? "expand_less" : "expand_more" }}</v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <!-- actor identifiers -->
      <v-col cols="4">
        <listview
            icon="code"
            title="Identifiers"
            :items="item.identifier"
            :expanded="intexpanded"
        />
      </v-col>
      <!-- actor begin of Existence -->
      <v-col cols="4">
        <singleview
            icon="logout"
            title="Begin of Existence"
            :item="item.beginOfExistence| formatDate"
        />
      </v-col>
      <!-- actor end of Existence -->
      <v-col cols="4">
        <singleview
            icon="login"
            title="End of Existence"
            :item="item.endOfExistence| formatDate"
        />
      </v-col>
      <!-- actor description -->
      <v-col cols="12">
        <singleview
            icon="login"
            title="Description"
            :item="item.description"
        />
      </v-col>
      <!-- actor description -->
      <v-col cols="12">
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Original Title
              </th>
              <th class="text-left">
                Link
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in [...item.entry_creator_id, ...item.collect_creator_id, ...item.actor_relations_target]"
                :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.originalTitle }}</td>
              <td>
                <v-btn fab dark small color="primary" :to="{ name: 'single', params: { type: 'entry', id:  item._id  }}">
                  <v-icon dark>collections_bookmark</v-icon>
                </v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <editdialog title="Create Inventory" ref="createdialog" @close="refresh" v-if="$store.state.api.loggedin">
      <template slot="form" slot-scope="props">
        <component :is="formLoader" :value="props.item" @input="props.item=$event"></component>
      </template>
    </editdialog>
  </v-container>
</template>
<script>
/* eslint-disable no-underscore-dangle,no-console */

import {mapActions, mapGetters} from 'vuex';
import filters from '../../helpers/filters';
import listview from '../ViewComponents/listpropview';
import singleview from '../ViewComponents/singlepropview';
import assetlistview from '../ViewComponents/assetlistview';
import transactiondetails from "./transaction_details";
import list from '../ViewComponents/list';
import editdialog from '../Dialogs/editDialog';

export default {
  components: {
    transactiondetails,
    listview,
    singleview,
    assetlistview,
    list,
    editdialog,
  },
  props: {
    id: {
      type: String,
      default: () => "",
    },
    expanded: {
      type: Boolean,
      default: () => true,
    },
    editable: {
      type: Boolean,
      default: () => false,
    },
  },
  mixins: [filters],
  data() {
    return {
      type: 'actor',
      item: {},
      loading: false,
      intexpanded: true,
      inteditable: false,
      listheaders: [
        {text: 'Name', value: 'name', path: 'name'},
        {text: 'Original Title', value: 'originalTitle', path: 'originalTitle'},
        {text: 'Artist', value: 'creator.id', path: 'creator[0].id.name'},
        {text: 'Actions'},
      ],
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
    ]),
    getItem(_id) {
      this.item = {};
      this.loading = true;
      this.get({
        type: this.type,
        query: {_id},
        populate: JSON.stringify(
            this.getPathsByName(this.type).map(path => ({path}))
                .concat(this.getReversePathsByName(this.type).map(path => ({path}))),
        ),
      }).then((res) => {
        this.item = res.body[0];
        this.loading = false;
      }).catch((err) => {
        console.log(err);
        this.loading = false;
      });
    },
    refresh() {
      if (this.item._id) this.getItem(this.item._id);
    }
  },
  computed: {
    ...mapGetters('api', [
      'getPathsByName',
      'getReversePathsByName',
    ]),
  },
  watch: {
    id: {
      immediate: true,
      handler(a) {
        let _id = null;
        if (a && typeof a === 'string') _id = a;
        if (a && typeof a === 'object' && a._id) _id = a._id;
        if (_id !== null) this.getItem(_id);
      },
      deep: true,
    },
    expanded: {
      immediate: true,
      handler(a) {
        this.intexpanded = a;
      },
    },
    editable: {
      immediate: true,
      handler(a) {
        if (!this.$store.state.api.loggedin) this.inteditable = false;
        else this.inteditable = a;
      },
    },
  },
};
</script>

<style>
</style>
