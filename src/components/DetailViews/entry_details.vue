<template>
  <v-container fluid>
    <v-row dense>
      <!-- toolbar -->
      <v-col cols="12">
        <v-row justify="end">
          <v-btn icon ripple @click="intexpanded = !intexpanded" ><v-icon>{{ intexpanded ? "expand_less" : "expand_more"  }}</v-icon></v-btn>
          <v-btn fab dark small
                 color="warning"
                 @click="$refs.createdialog.getItem( type , item._id)"
                 v-if="$store.state.api.loggedin">
            <v-icon dark>edit</v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <!-- entry Original Title -->
      <v-col cols="6">
        <singleview
         icon="code"
         title="Orginal Title"
         :item="item.originalTitle"
        />
      </v-col>
      <!-- collect creator -->
      <v-col cols="6">
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
      </v-col>
      <!-- collect classification -->
      <v-col cols="6">
        <listview
          icon="device_hub"
          title="Classification"
          :items="item.classification"
          :paths="{
            itemtitle: 'aspect.name',
            itemsubtitle: 'note',
            itemcontent: 'descriptor.name',
            collapsed: 'descriptor.name',
          }"
          :expanded="intexpanded"
        />
      </v-col>
      <!-- entry dimensions -->
      <v-col cols="6">
        <listview
            icon="height"
            title="Dimensions"
            :items="item.dimensions"
            :paths="{
            itemtitle: 'aspect.name',
            itemsubtitle: 'unit.name',
            itemcontent: 'amount',
            collapsed: 'aspect.name',
          }"
            :expanded="intexpanded"
        />
      </v-col>
      <v-col cols="12">
        <transactiondetails v-if="item.acquisition_ref" :id="item.acquisition_ref" :expanded="false" ref="destdetails"/>
      </v-col>
      <v-col cols="12">
        <transactiondetails v-if="item.destitution_ref" :id="item.destitution_ref" :expanded="false" ref="destdetails"/>
      </v-col>
    </v-row>
    <editdialog :title="`Edit ${item.name}`" ref="createdialog" @close="refresh" v-if="$store.state.api.loggedin">
      <template slot="form" slot-scope="props">
        <component :is="formLoader" :value="props.item" @input="props.item=$event"></component>
      </template>
    </editdialog>
  </v-container>
</template>
<script>
  /* eslint-disable no-underscore-dangle,no-console */

  import { mapActions, mapGetters } from 'vuex';
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
        type: 'entry',
        item: {},
        loading: false,
        intexpanded: true,
        inteditable: false,
        listheaders: [
          { text: 'Name', value: 'name', path: 'name' },
          { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
          { text: 'Artist', value: 'creator.id', path: 'creator[0].id.name' },
          { text: 'Actions' },
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
          query: { _id },
          populate: JSON.stringify(
            this.getPathsByName(this.type).map(path => ({ path }))
              .concat(this.getReversePathsByName(this.type).map(path => ({ path }))),
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
