<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <h3>{{view.name}}</h3>
      <v-data-table
        :headers="headers"
        :items="data"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.adlib }}</td>
          <td>{{ props.item._id }}</td>
          <td><v-btn :to="{ name: 'e', params: { id:  props.item._id  }}" color="info">Details</v-btn></td>
        </template>
      </v-data-table>
    </v-container>
    <v-container grid-list-md v-if="!$store.state.app.loggedin">
      Bitte loggen Sie sich ein um die Datenbank zu benutzen.
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import HELPERS from '../helpers';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  components: {
  },
  data() {
    return {
      view: {},
      data: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Range', value: 'type' },
        { text: 'Type', value: 'range' },
      ],
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
  },
  computed: {
  },
  created() {
    this.get({ type: 'Inventory', id: this.$route.params.id }).then((res) => {
      this.view = res.data;
    });
    this.get({ type: 'Entry', query: `{"partOf":"${this.$route.params.id}"}` }).then((res) => {
      this.data = res.data;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
