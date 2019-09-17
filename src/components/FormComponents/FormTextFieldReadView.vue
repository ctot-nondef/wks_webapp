<template>
  <div>
    <v-text-field :label="label" readonly :value="name"></v-text-field>
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
    'refsto',
    'reftype',
    'label',
  ],
  data() {
    return {
      name: null,
    };
  },
  created() {
    this.getText(this.refsto);
  },
  methods: {
    ...mapActions('api', ['get']),
    getText(refid) {
      if (refid && refid !== '') {
        this.get({
          type: this.reftype,
          query: { _id: refid },
        }).then((res) => {
          this.name = res.data[0].name;
        });
      }
    },
  },
  watch: {
    refsto: () => this.getText(this.refsto),
  },
};
</script>
