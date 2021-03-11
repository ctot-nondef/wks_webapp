<template>
  <div class="">
    <v-container grid-list-md>
      <fundamentcard :caption="view.name">
        <div slot="content" >
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <component :is="detailLoader" :id="id" ></component>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
    </v-container>
  </div>
</template>
<script>
  import { mapActions } from 'vuex';

  import fundamentcard from '../Fundament/FundamentCard';

  export default {
    components: {
      fundamentcard,
    },
    props: {
      id: {
        type: String,
        default: () => null,
      },
      type: {
        type: String,
        default: () => null,
      },
    },
    data() {
      return {
        view: {},
      };
    },
    methods: {
      ...mapActions('api', [
        'get',
      ]),
      getEntity(type, id) {
         this.get({ type, id }).then((res) => {
           this.view = res.body;
        });
      },
    },
    watch: {

    },
    computed: {
      detailLoader() {
        return () => import(/* webpackMode: "eager" */ `../DetailViews/${this.type}_details`);
      },
    },
    created() {
      this.getEntity(this.type, this.id);
    },
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
