<template>
    <div class="">
        <v-container grid-list-md>
            <fundamentcard :caption="view.name">
                <v-flex xs12>
                    <component :is="detailLoader" :value="view"></component>
                </v-flex>
                <div slot="content" >
                    <v-layout justify-center column fill-height>
                        <v-flex xs12>
                            <v-layout justify-end row fill-height>
                                <v-btn fab dark small
                                       color="warning"
                                       @click="$refs.createdialog.newItem( type, { partOf: view })"
                                       v-if="$store.state.api.loggedin">
                                    <v-icon dark>add</v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </div>
            </fundamentcard>
            <editdialog title="Create Inventory" ref="createdialog" @close="$refs.inventorylist.getRecords()" v-if="$store.state.api.loggedin">
                <template slot="form" slot-scope="props">
                    <component :is="formLoader" :value="props.item" @input="props.item=$event"></component>
                </template>
            </editdialog>
        </v-container>
    </div>
</template>
<script>
  import { mapActions } from 'vuex';

  import fundamentcard from '../Fundament/FundamentCard';
  import list from '../genericViews/list';
  import editdialog from '../editDialog';

  /* eslint no-unused-vars: ["error", {"args": "none"}] */
  /* eslint no-console: ["error", { allow: ["log"] }] */

  export default {
    props: {
      type: {
        type: String,
        default: () => "",
      },
      id: {
        type: String,
        default: () => "",
      },

    },
    components: {
      fundamentcard,
      list,
      editdialog,
    },
    data() {
      return {
        view: {},
      };
    },
    methods: {

    },
    computed: {
      formLoader() {
        return () => import(/* webpackMode: "eager" */ `./Forms/${this.type}_form`);
      },
      detailLoader() {
        return () => import(/* webpackMode: "eager" */ `./DetailViews/${this.type}_detail`);
      },
    },
    created() {
      this.get({ type: this.$route.params.type, id: this.$route.params.id }).then((res) => {
        this.view = res.data;
      });
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
