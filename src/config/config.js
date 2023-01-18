import filters from "./default_filters";
import headers from "./default_listheaders";
import menu from "./menu";

export default {
  title: process.env.APP_TITLE,
  color: 'primary',
  homestate: {
    name: 'start',
    params: {
      lang: 'en' },
  },
  menu,
  filters,
  headers,
  repo: '',
  api: process.env.BACKEND_API,
};
