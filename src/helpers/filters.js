import moment from 'moment';

export default {
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('YYYY MM  DD');
      }
      return value;
    },
  },
};
