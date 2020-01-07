<template>
  <div>
    <v-col cols="12">
      <v-row justify="end">
        <v-btn icon ripple @click="intexpanded = !intexpanded" ><v-icon>{{ intexpanded ? "expand_less" : "expand_more"  }}</v-icon></v-btn>
      </v-row>
    </v-col>
    <v-layout row wrap>
      <v-flex xs6>
        <listview
          icon="person"
          title="Actors"
          :items="item.creator"
          :paths="{
            itemtitle: 'role.name',
            itemsubtitle: 'note',
            itemcontent: 'id.name',
            collapsed: 'id.name',
          }"
          :expanded="intexpanded"
        />
      </v-flex>
      <v-flex xs6>
        <listview
          icon="attach_money"
          title="Price"
          :items="item.price"
          :paths="{
            itemtitle: 'currency.name',
            itemcontent: 'amount',
            collapsed: 'amount',
          }"
          :expanded="intexpanded"
        />
      </v-flex>
      <v-flex xs12>
        <v-layout justify-end row fill-height>
          <v-btn fab dark small
                 color="warning"
                 @click="$refs.createdialog.newItem( 'inventory', { partOf: item })"
                 v-if="$store.state.api.loggedin">
            <v-icon dark>add</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
      <editdialog title="Create Inventory" ref="createdialog" @close="refresh" v-if="$store.state.api.loggedin">
        <template slot="form" slot-scope="props">
          <component :is="formLoader" :value="props.item" @input="props.item=$event"></component>
        </template>
      </editdialog>
    </v-layout>
  </div>
</template>
<script>
  /* eslint-disable no-underscore-dangle,no-console */

  import { mapActions, mapGetters } from 'vuex';
  import filters from '../../helpers/filters';
  import listview from '../genericViews/listpropview';
  import singleview from '../genericViews/singlepropview';
  import list from '../genericViews/list';
  import editdialog from '../editDialog';

  export default {
    components: {
      listview,
      singleview,
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
        type: 'collect',
        item: {},
        loading: false,
        intexpanded: true,
        inteditable: false,
      };
    },
    methods: {
      ...mapActions('api', [
        'get',
      ]),
      getItem(_id) {
        console.log(_id);
        this.item = {};
        this.loading = true;
        this.get({
          type: this.type,
          query: { _id },
          populate: JSON.stringify(
            this.getPathsByName(this.type).map(path => ({ path }))
              .concat(this.getReversePathsByName(this.type).map(path => ({ path }))),
          ),
        }).then((res) => {
          this.item = res.data[0];
          this.loading = false;
        }).catch((err) => {
          console.log(err);
          this.loading = false;
        });
      },
      refresh() {
        if(this.item._id) this.getItem(this.item._id);
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
          if(!this.$store.state.api.loggedin) this.inteditable = false;
          else this.inteditable = a;
        },
      },
    },
  };
</script>

<style>

</style>
