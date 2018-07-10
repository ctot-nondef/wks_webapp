<template lang="html">
  <!-- store deletion -->
  <v-dialog v-model="$store.state.dialogs[name].status" max-width="500px">
    <v-card>
      <v-card-title>
        Hey there!
      </v-card-title>
      <v-card-text color="primary" v-if="result.length > ($store.state.localStorageInfo.localStorageLimit || 5200000) - ($store.state.localStorageInfo.currentStoreLength || 0)">
        <p>
          The file you are trying to upload seems to be to big according to the latest localstorage calculation.
        </p>
        <p>
          Your file's size: {{ result.length }}
        </p>
        <p>
          Calculated Localstorage Space left: {{ ($store.state.localStorageInfo.localStorageLimit || 5200000) - ($store.state.localStorageInfo.currentStoreLength || 0) }}
        </p>
      </v-card-text>
      <v-card-text v-else>
        You're good to go!
      </v-card-text>
      <v-card-actions v-if="result.length > ($store.state.localStorageInfo.localStorageLimit || 5200000) - ($store.state.localStorageInfo.currentStoreLength || 0)">
        <v-btn @click="testLimit" color="primary">
          Recalculate localstorage
        </v-btn>
        <v-btn @click="save(); close();" color="warning">
          Save to Store anyway
        </v-btn>
        <v-btn @click="close" color="secondary">
          Cancel
        </v-btn>
      </v-card-actions>
      <v-card-actions v-else>
      <v-btn @click="save(); close();" color="Primary">
        Continue
      </v-btn>
      <v-btn @click="close" color="secondary">
        Cancel
      </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import HELPERS from '../../helpers';

export default {
  mixins: [HELPERS],
  data() {
    return {
      name: 'filesizedialog',
    };
  },
  methods: {
    ...mapActions('localStorageInfo', [
      'safeLimitTest',
      'testLimit',
    ]),
    ...mapActions('app', [
      'toggleAppMode',
    ]),
    ...mapActions('n3', [
      'StringToStore',
    ]),
    ...mapMutations('dialogs', [
      'closeDialog',
    ]),
    save() {
      this.$log('StringToStore', this.StringToStore(this.result));
      this.StringToStore(this.result).then(this.toggleAppMode());
    },
    close() {
      this.closeDialog(this.name);
    },
  },
  computed: {
    result() {
      return this.$store.state.dialogs[this.name].result;
    },
  },
};
</script>

<style lang="css">
</style>
