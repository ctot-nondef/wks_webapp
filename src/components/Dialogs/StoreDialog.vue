<template lang="html">
    <v-dialog v-model="dialogShow" id="askForStore" max-width="500px">
      <v-card>
        <v-card-title>
          Session Recovery
        </v-card-title>
        <v-card-text>
          Hey! you have an old session. It is from {{date}} (DD/MM/YY hh:mm:ss). Do you want to restore it?
        </v-card-text>
        <v-card-actions>
        <v-btn @click="restore" large color="primary">
          Recover
        </v-btn>
        <v-btn @click="discard" large color="secondary">
          Discard
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import HELPERS from '../../helpers';

export default {
  data() {
    return {
      dialogShow: false,
      latestSession: null,
      date: '',
    };
  },
  mixins: [HELPERS],
  methods: {
    ...mapMutations('JSONschema', [
      'constructJSONschema',
    ]),
    ...mapActions('n3', [
      'constructN3',
    ]),
    ...mapMutations('localStorageInfo', [
      'constructLocalStorageInfo',
    ]),
    discard() {
      this.dialogShow = false;
      this.deleteOldSessions();
    },
    restore(reload = true) {
      // this.constructJOWL(this.latestSession);
      this.constructJSONschema(this.latestSession);
      this.constructN3(this.latestSession);
      this.constructLocalStorageInfo(this.latestSession);
      this.discard();
      if (reload) {
        this.$router.go(this.$router.currentRoute);
      }
    },
  },
  created() {
    this.latestSession = this.getLatestSession();
    if (this.latestSession) {
      this.$log('latestSession', this.latestSession);
      this.date = this.dateToString(new Date(this.latestSession.date));
      if (Date.now() - this.latestSession.date < 300000) {
        this.restore(false);
      } else {
        this.dialogShow = true;
      }
    }
  },
};
</script>

<style lang="css">
</style>
