import moment from 'moment';

export default {
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('DD. MM. YYYY');
      }
      return value;
    },
  },
};
