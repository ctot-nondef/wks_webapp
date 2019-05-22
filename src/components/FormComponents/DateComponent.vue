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
      :max="new Date().toISOString().substr(0, 10)"
      min="1550-01-01"
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
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  watch: {
    datepickermenu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
    date() {
      this.dateFormatted = this.formatDate(this.dateval);
    },
  },
  methods: {
    save(dateval) {
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
      const [year, month, day] = dwot.split('-');
      return `${month}/${day}/${year}`;
    },
    parseDate(dateval) {
      if (!dateval) return null;

      const [month, day, year] = dateval.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
  },
};
</script>
