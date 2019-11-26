<template>
    <v-layout row wrap>
      <v-flex xs6>{{ item.date.split('T')[0] }}</v-flex>
      <v-flex xs6>{{ `${item.entry_acquisition_ref[0].name || 'source undefined'} => ${item.entry_destitution_ref[0].name || 'destination undefined'}` }}</v-flex>
      <v-flex xs6>
          <v-list two-line subheader>
            <v-subheader inset>Actors</v-subheader>
            <v-list-tile
              v-for="a in item.actor"
              avatar
              ripple
              @click=""
            >
              <v-list-tile-avatar>
                <v-icon>person</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ a.id.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ a.role.name }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
      </v-flex>
      <v-flex xs6>
          <v-list two-line subheader>
            <v-subheader inset>Price</v-subheader>
              <v-list-tile
                v-for="p in item.price"
                avatar
                @click=""
              >
                <v-list-tile-avatar>
                  <v-icon>attach_money</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ p.amount }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ p.currency.name }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
          </v-list>
      </v-flex>
    </v-layout>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    props: [
      'id',
    ],
    data() {
      return {
        item: {},
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
      'id': {
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
