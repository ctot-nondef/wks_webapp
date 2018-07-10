<template lang="html">
  <!-- store deletion -->
  <v-dialog v-model="$store.state.dialogs[name].status" max-width="900px">
    <v-card>
      <v-card-title>
        Delete Subject
      </v-card-title>
      <v-card-text color="primary">
        Are you sure you want to delete the following triples?
        <v-data-table
          :items="triples"
          hide-actions
        >
          <template slot="items" slot-scope="props">
              <td class="text-xs-right">{{ props.item.predicate }}</td>
              <td>{{ props.item.object }}</td>
          </template>
        </v-data-table>
        <v-checkbox
          label="Don't ask me again"
          v-model="checkbox"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="RemoveSubject($store.state.dialogs[name].uri); closeDialog(name);" large color="error">
          Delete
        </v-btn>
        <v-btn @click="closeDialog(name)" color="secondary" large>
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

import HELPERS from '../../helpers';

export default {
  props: {
    dialog: {
      default: false,
    },
  },
  computed: {
    ...mapGetters('n3', [
      'getTriples',
    ]),
    uri() {
      return this.$store.state.dialogs[this.name].uri;
    },
  },
  data() {
    return {
      checkbox: false,
      triples: [],
      name: 'deletesubjectdialog',
    };
  },
  watch: {
    checkbox() {
      this.toggleDeletePrompt(!this.checkbox);
    },
    uri(oldVal, newVal) {
      this.$debug('updated uri:', oldVal, newVal);
      this.triples = (this.getTriples({ subject: this.uri }));
    },
  },
  mixins: [HELPERS],
  methods: {
    ...mapActions('n3', [
      'RemoveSubject',
    ]),
    ...mapMutations('n3', [
      'toggleDeletePrompt',
    ]),
    ...mapMutations('dialogs', [
      'closeDialog',
    ]),
  },
};
</script>

<style lang="css">
</style>
