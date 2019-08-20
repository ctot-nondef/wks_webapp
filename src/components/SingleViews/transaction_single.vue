<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard :caption="view._id">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
    </v-container>
    <v-container grid-list-md v-if="!$store.state.app.loggedin">
      Bitte loggen Sie sich ein um die Datenbank zu benutzen.
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import fundamentcard from '../Fundament/FundamentCard';


/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
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
      entrydialog: false,
      newtransaction: {},
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    addEntry() {
    },
  },
  computed: {
  },
  created() {
    this.get({ type: 'Transaction', id: this.$route.params.id }).then((res) => {
      this.view = res.data;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
