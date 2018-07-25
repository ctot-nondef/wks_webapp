<template lang="html">
  <v-layout column justify-space-between>
    <v-dialog
        v-model="createDialog.status"
        id="askForStore"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="discard">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ createDialog.type }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="submit">Save</v-btn>
          </v-toolbar-items>
          <v-menu bottom right offset-y>
            <v-btn slot="activator" dark icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
          </v-menu>
        </v-toolbar>
        <v-card-text>
          <form-schema v-if="model" @input="saveEntry(); $emit('input', model)" :schema="schema(`${createDialog.type}`)" v-model="model" @submit="submit">
            <v-btn variant="primary" @click="submit">Load into Store</v-btn>
            <v-btn @click="resetForm();" variant="secondary">Reset Form</v-btn>
            <v-btn @click="discard" large color="secondary">
              CANCEL
            </v-btn>
          </form-schema>
        </v-card-text>
        <div style="flex: 1 1 auto;"></div>
    </v-card>
    </v-dialog>
    </v-layout>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex';
import FormSchema from '@formschema/native';
import HELPERS from '../../helpers';

export default {
  mixins: [HELPERS],
  data() {
    return {
      model:{},
    };
  },
  components: {
    FormSchema,
  },
  computed: {
    ...mapState('dialogs', [
      'createDialog',
    ]),
    ...mapGetters('api', [
      'schema',
    ]),
  },
  methods: {
    ...mapMutations('app', [
      'loginMut',
    ]),
    ...mapMutations('dialogs', [
      'closeDialog',
    ]),
    discard() {
      this.closeDialog('createDialog');
    },
    submit() {
      this.closeDialog('createDialog');
    },
  },
};
</script>

<style lang="css">
</style>
