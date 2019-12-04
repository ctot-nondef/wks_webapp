<template>
    <v-layout row wrap>
      <v-flex xs3>{{ item.date | formatDate }}</v-flex>
      <v-flex xs2>
        <span v-for="a in item.entry_acquisition_ref" :key="a.name" class="body-2">{{ a.name }}</span>
        <span v-if="item.entry_acquisition_ref.length === 0" class="body-2">source undefined</span>
      </v-flex>
      <v-flex xs1><v-icon>arrow_right_alt</v-icon></v-flex>
      <v-flex xs2>
        <span v-for="a in item.entry_destitution_ref" :key="a.name" class="body-2">{{ a.name }}</span>
        <span v-if="item.entry_destitution_ref.length === 0" class="body-2">destination undefined</span>
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
                :expanded="true"
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
                :expanded="true"
        ></listview>
      </v-flex>
    </v-layout>
</template>
<script>
  /* eslint-disable no-underscore-dangle */

  import { mapActions, mapGetters } from 'vuex';
  import filters from '../../helpers/filters';
  import listview from './listview';

  export default {
    components: {
      listview,
    },
    props: [
      'id',
    ],
    mixins: [filters],
    data() {
      return {
        item: {},
        loading: {},
        actorsexpanded: true,
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
