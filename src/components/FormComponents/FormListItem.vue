<template>
  <div>
    <v-list-tile-title v-if="styletype==='title'" v-text="name || refsto" ></v-list-tile-title>
    <v-list-tile-sub-title v-if="styletype==='subtitle'" v-text="name || refsto"></v-list-tile-sub-title>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import HELPERS from '../../helpers';

export default {

  mixins: [HELPERS],
  props: [
    'styletype',
    'itemprop',
    'refsto'
  ],
  data() {
    return {
        name:null
      };
  },
  methods: {
    ...mapActions("api", ["get"]),
  },
  created() {
    if (this.itemprop["x-ref"]) {
    this.get({
            type: this.itemprop["x-ref"],
            query: JSON.stringify({
              _id: this.refsto
            })
    }).then(res => {
        console.log(res.data);
        this.name = res.data[0].name;
    });
    }
  },
};
</script>