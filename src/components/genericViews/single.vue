<template>
    <div class="">
        <v-container grid-list-md>
            <fundamentcard :caption="view.name">
                <div slot="content" >
                    <v-layout justify-center column fill-height>
                        <v-flex xs12>
                            <component :is="detailLoader" :id="$route.params.id"></component>
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
    data() {
      return {
        view: {},
      };
    },
    methods: {
      ...mapActions('api', [
        'get',
      ]),
    },
    computed: {
      detailLoader() {
        return () => import(/* webpackMode: "eager" */ `../DetailViews/${this.$route.params.type}_details`);
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
