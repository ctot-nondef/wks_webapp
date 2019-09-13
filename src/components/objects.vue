<template>
  <div class="">
    <v-container grid-list-md>
      <fundamentcard caption="Objects">
        <div slot="content">
          <v-layout justify-center column fill-height >
            <v-flex xs12 v-if="$store.state.api.loggedin">
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="$refs.createdialog.newItem('object', {})">
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
      <editdialog title="Create Object" ref="createdialog" @close="$refs.objectlist.getRecords()">
        <template slot="form" slot-scope="props">
          <component :is="componentLoader" :value="props.item" @input="props.item=$event"></component>
        </template>
      </editdialog>
    </v-container>
  </div>
</template>

<script>
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
      objectdialog: false,
      newobject: {},
      iobject: {},
      itype: 'Object',
      listheaders: [
        { text: 'Name', value: 'name', path: 'name' },
        { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
        { text: 'Actions' },
      ],
    };
  },
  computed: {
    componentLoader() {
      return () => import('./Forms/object_form');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
