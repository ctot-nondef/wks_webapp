import Vue from 'vue';
import Router from 'vue-router';
import App from '../components/App';
import Start from '../components/Start';
import Import from '../components/Import';
import Collect from '../components/Collect';
import I from '../components/i';
import E from '../components/e';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: (to) => {
        if (to.params.lang !== 'en' || to.params.lang !== 'de') {
          // const language = window.navigator.userLanguage || window.navigator.language;
          return '/en';
        }
        return to.fullPath;
      },
    },
    {
      path: '/:lang',
      components: {
        default: App,
      },
      // Children to the root path '/'
      children: [
        {
          path: 'start',
          name: 'start',
          components: {
            Content: Start,
          },
        },
        {
          path: 'i',
          name: 'i',
          components: {
            Content: I,
          },
        },
        {
          path: 'c/:id',
          name: 'c',
          components: {
            Content: Collect,
          },
        },
        {
          path: 'e/:id',
          name: 'e',
          components: {
            Content: E,
          },
        },
        {
          path: 'import',
          name: 'import',
          components: {
            Content: Import,
          },
        },
        {
          path: '',
          redirect: { name: 'start' },
        },
      ],
    },
  ],
  scrollBehavior() {
    // always scroll back to the top
    return { x: 0, y: 0 };
  },
});
