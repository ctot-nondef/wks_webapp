<template>
  <v-menu
    ref="datepickermenu"
    v-model="datepickermenu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        v-model="computedDateFormatted"
        :label="label"
        prepend-icon="event"
        hint="YYYY\MM\DD format"
        persistent-hint
        filled
        clearable
        @blur="dateval = parseDate(dateFormatted)"
        v-on="on"
        @click:clear="save(null)"
      />
    </template>
  </v-menu>
</template>
<script>
export default {
  props: [
    'label',
    'date',
  ],
  data() {
    return {
      dateval: null,
      datepickermenu: false,
      dateFormatted: this.formatDate(this.dateval),
    };
  },
  computed: {
    computedDateFormatted: {
      get() {
        return this.formatDate(this.date);
      },
      set(newVal) {
        this.parseDate(newVal);
      },
    },
  },
  watch: {
    // TODO: this should be rewritten with some regex validation
    datepickermenu() {
      // eslint-disable-next-line no-return-assign
      this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
    date(newval) {
      this.dateval = newval;
      this.dateFormatted = this.formatDate(this.dateval);
    },
  },
  methods: {
    save(dateval) {
      if (this.$refs.picker && this.$refs.picker.activePicker === 'DATE') {
        this.$refs.datepickermenu.save(dateval);
      }
      if(dateval != null) this.$emit('update:date', `${dateval}T00:00:00.000Z`);
      else this.$emit('update:date', null);
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
