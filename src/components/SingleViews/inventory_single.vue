<template>
  <div class="">
    <v-container grid-list-md >
      <fundamentcard :caption="view.name">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small
                       color="warning"
                       @click="$refs.createdialog.newItem('entry', { partOf: view })"
                       v-if="$store.state.api.loggedin">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <list ref="entrylist" entitytype="entry" :headers="listheaders" :filter="{ partOf: this.$route.params.id }"></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
    </v-container>
    <editdialog title="Create Entry" ref="createdialog" @close="$refs.entrylist.getRecords()" v-if="$store.state.api.loggedin">
      <template slot="form" slot-scope="props">
        <component :is="componentLoader" :value="props.item" @input="props.item=$event"></component>
      </template>
    </editdialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import fundamentcard from '../Fundament/FundamentCard';
import list from '../genericViews/list';
import editdialog from '../Dialogs/editDialog';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    list,
    editdialog,
  },
  data() {
    return {
      view: {},
      data: [],
      listheaders: [
        { text: 'Name', value: 'name', path: 'name' },
        { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
        { text: 'Artist', value: 'creator.id', path: 'creator[0].id.name' },
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
    componentLoader() {
      return () => import('../Forms/entry_form');
    },
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
