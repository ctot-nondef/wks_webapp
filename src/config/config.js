import filters from "./default_filters";
import headers from "./default_listheaders";
import menu from "./menu";

export default {
  title: 'VCHC Project DB',
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
  api: 'https://wks.acdh.oeaw.ac.at/',
};
