<template>
    <v-layout row wrap>
      <v-flex xs3>{{ item.date | formatDate }}</v-flex>
      <v-flex xs2>
        <span v-for="a in item.entry_acquisition_ref" class="body-2">{{ a.name }}</span>
        <span v-if="item.entry_acquisition_ref.length === 0" class="body-2">source undefined</span>
      </v-flex>
      <v-flex xs1><v-icon>arrow_right_alt</v-icon></v-flex>
      <v-flex xs2>
        <span v-for="a in item.entry_destitution_ref" class="body-2">{{ a.name }}</span>
        <span v-if="item.entry_destitution_ref.length === 0" class="body-2">destination undefined</span>
      </v-flex>
      <v-flex xs6>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-avatar>
                    <v-icon>person</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <span class="title font-weight-thin">Actors</span>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>expand_less</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
          <v-list v-if="actorsexpanded">
            <v-list-tile v-for="a in item.actor">
              <v-list-tile-content>
                <v-list-tile-title>{{ a.role.name }} :</v-list-tile-title>
                <v-list-tile-sub-title>{{ a.note }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content class="align-end">{{ a.id.name }}</v-list-tile-content>
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
                ripple
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
  /* eslint-disable no-underscore-dangle */

  import { mapActions, mapGetters } from 'vuex';
  import filters from '../../helpers/filters';

  export default {
    props: [
      'id',
    ],
    mixins: [filters],
    data() {
      return {
        item: {},
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
