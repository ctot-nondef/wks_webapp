<template>
    <v-layout row fill-height wrap>
      <v-flex xs4>
        <singleview
          icon="calendar_today"
          title="Date"
          :item="item.date | formatDate"
        />
      </v-flex>
      <v-flex xs4>
        <listview
                icon="assignment"
                title="Source"
                :items="item.entry_acquisition_ref"
                :paths="{
                  itemcontent: 'name',
                }"
        ></listview>
      </v-flex>
      <v-flex xs4>
        <listview
                icon="assignment"
                title="Target"
                :items="item.entry_destitution_ref"
                :paths="{
                  itemcontent: 'name',
                }"
        ></listview>
      </v-flex>
      <v-flex xs6>
        <listview
            icon="person"
            title="Actors"
            :items="item.actor"
            :paths="{
              itemtitle: 'role.name',
              itemsubtitle: 'note',
              itemcontent: 'id.name',
              collapsed: 'id.name',
            }"
            :expanded="false"
            :expandable="true"
        ></listview>
      </v-flex>
      <v-flex xs6>
        <listview
            icon="attach_money"
            title="Price"
            :items="item.price"
            :paths="{
              itemtitle: 'currency.name',
              itemcontent: 'amount',
            }"
            :expanded="false"
            :expandable="true"
        ></listview>
      </v-flex>
    </v-layout>
</template>
<script>
  /* eslint-disable no-underscore-dangle */

  import { mapActions, mapGetters } from 'vuex';
  import filters from '../../helpers/filters';
  import listview from './listview';
  import singleview from './singleview';

  export default {
    components: {
      listview,
      singleview,
    },
    props: [
      'id',
      'expanded',
    ],
    mixins: [filters],
    data() {
      return {
        item: {},
        loading: {},
      };
    },
    methods: {
      ...mapActions('api', [
        'get',
      ]),
      getItem(_id) {
        this.item = {};
        this.get({
          type: 'transaction',
          query: { _id },
          populate: JSON.stringify(
            this.getPathsByName('transaction').map(path => ({ path }))
              .concat(this.getReversePathsByName('transaction').map(path => ({ path }))),
          ),
        }).then((res) => {
          this.item = res.data[0];
        });
      },
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
    },

  };
</script>

<style>

</style>
