<template>
      <v-menu
    ref="datepickermenu"
    v-model="datepickermenu"
    :close-on-content-click="false"
    :nudge-right="40"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      v-model="computedDateFormatted"
      :label="label"
      prepend-icon="event"
      @blur="dateval = parseDate(dateFormatted)"
      box
    ></v-text-field>
    <v-date-picker
      ref="picker"
      v-model="dateval"
      @change="save"
    ></v-date-picker>
  </v-menu>
</template>
<script>
import HELPERS from '../../helpers';

export default {
  mixins: [HELPERS],

  props: [
    'label',
    'date',
  ],
  data() {
    return {
      dateval: this.date,
      datepickermenu: false,
      dateFormatted: this.formatDate(this.dateval),
    };
  },
  computed: {
    computedDateFormatted:{
      get() {
        return this.formatDate(this.date);
      },
      set(newVal) {
        this.parseDate(newVal);
      },
    },
  },
  watch: {
    datepickermenu() {
      // eslint-disable-next-line no-return-assign
      this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
    date() {
      this.dateFormatted = this.formatDate(this.dateval);
    },
  },
  methods: {
    save(dateval) {
      console.log(dateval);
      this.$refs.datepickermenu.save(dateval);
      this.$emit('update:date', `${dateval}T00:00:00.000Z`);
    },
    formatDate(dateval) {
      let dwot = null;
      if (!dateval) return null;
      if (dateval instanceof Array) {
        dwot = dateval[0].replace('T00:00:00.000Z', '');
      } else {
        dwot = dateval.replace('T00:00:00.000Z', '');
      }
      const a = dwot.split('-');
      return a.join('/');
    },
    parseDate(dateval) {
      if (!dateval) return null;
      const a = dateval.split('/');
      this.save(a.join('-'));
      return a.join('-');
    },
  },
};
</script>
