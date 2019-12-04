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
          <v-list dense>
            <v-list-item>
              <v-list-item-avatar>
                    <v-icon>person</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <span class="title font-weight-thin">Actors</span>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>expand_less</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list v-if="actorsexpanded">
            <v-list-item v-for="a in item.actor" :key="a.id.name">
              <v-list-item-content>
                <v-list-item-title>{{ a.role.name }} :</v-list-item-title>
                <v-list-item-subtitle>{{ a.note }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="align-end">{{ a.id.name }}</v-list-item-content>
            </v-list-item>
          </v-list>
      </v-flex>
      <v-flex xs6>
          <v-list two-line subheader>
            <v-subheader inset>Price</v-subheader>
              <v-list-item
                v-for="p in item.price"
                :key="p.currency.name"
                avatar
                ripple
              >
                <v-list-item-avatar>
                  <v-icon>attach_money</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ p.amount }}</v-list-item-title>
                  <v-list-item-subtitle>{{ p.currency.name }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
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
