import Vue from 'vue';
import Router from 'vue-router';
import App from '../components/App';
import Start from '../components/Start';
import ForgotPassword from '../components/ForgotPassword';
import single from '../components/single';
import users from '../components/users';
import query from '../components/filtered_list';
import search from '../components/search_list';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: (to) => {
        if (to.params.lang !== 'en' || to.params.lang !== 'de') {
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
          path: 'q/:entity/:query?',
          name: 'query',
          components: {
            Content: query,
          },
        },
        {
          path: 's/:entity/:query?',
          name: 'search',
          components: {
            Content: search,
          },
        },
        {
          path: ':type/:id',
          name: 'single',
          components: {
            Content: single,
          },
        },
        {
          path: 'users',
          name: 'users',
          components: {
            Content: users,
          },
        },
        {
          path: 'forgotpassword',
          name: 'forgotpassword',
          components: {
            Content: ForgotPassword,
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
