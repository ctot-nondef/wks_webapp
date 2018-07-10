<template>
  <div>
    <v-text-field
      v-model="select"
      :label="name"
      :rules = "[() => select.length > 0 || 'This field may not be empty', () => (!this.exists || !this.allowExists) || 'Please choose an non existing Identifier' ]"
      required
      @input="querySelections(select); $emit('input', select)"
      >
    </v-text-field>
    <template v-if="!loading">
      <p v-if="exists && status" class="exists">does already exist as an identifier in ARCHE</p>
      <p v-if="!exists && status" class="notExists">does not exist as an identifier in ARCHE</p>
      <p v-if="!status">Failed to get Data from the API.</p>
    </template>
    <template v-else>
      <p>laoding...</p>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import HELPERS from '../helpers';
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable indent */


export default {
  mixins: [HELPERS],
  props: [
    'name',
    'value',
    'allowExists'
  ],
  name: 'HasIdentifierField',
  data() {
    return {
      loading: true,
      exists: false,
      status: false,
      items: [],
      search: null,
      select: this.value || [],
    };
  },
  methods: {
    ...mapMutations('dialogs', [
      'setDialog',
      'setDialogPromise',
    ]),
    selectItem(item) {
      if (this.select.length > 1) {
        this.select.splice(0,1);
      }
    },
    querySelections(val) {
      this.$debug('querySelections(val)', val);
      this.loading = true;

      this.isIdentifier(val)
        .then((res) => {
          this.$debug('res exists identifier', res);
          this.exists = true;
          this.status = true;
          this.loading = false;
        })
        .catch((res) => {
          this.$debug('res not exists', res);
          if(res) { //// TODO: check for no answer
            this.exists = false;
            this.status = true;
            this.loading = false;
          } else {
            this.status = false;
          }
        });
    },
  },
  watch: {
    search() {
      this.querySelections(this.search);
    },
  },
  created() {
    /*if (this.value) {
      this.$log('selection', this.select, this.value);
      for (let i = 0; i < this.value.length; i += 1) {
        this.items.push({ title: this.value[i], uri: this.value[i], type: '' });
      }
    } */
  },
  computed: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tree {
  max-height: 80vh;
  overflow: auto;
}

.exists {
  color: red;
}
.notExists {
  color: green;
}
</style>
