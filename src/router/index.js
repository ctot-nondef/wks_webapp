import Vue from 'vue';
import Router from 'vue-router';
import App from '../components/App';
import Start from '../components/Start';
import Import from '../components/Import';
import collections from '../components/collections';
import collectionsingle from '../components/collectionsingle';
import inventorysingle from '../components/inventorysingle';
import actors from '../components/actors';
import descriptors from '../components/descriptors';
import inventories from '../components/inventories';
import objects from '../components/objects';
import users from '../components/users';

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
          path: 'collections',
          name: 'collections',
          components: {
            Content: collections,
          },
        },
        {
          path: 'collections/:id',
          name: 'collectionsingle',
          components: {
            Content: collectionsingle,
          },
        },
        {
          path: 'inventory/:id',
          name: 'inventorysingle',
          components: {
            Content: inventorysingle,
          },
        },
        {
          path: 'actors',
          name: 'actors',
          components: {
            Content: actors,
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
          path: 'objects',
          name: 'objects',
          components: {
            Content: objects,
          },
        },
        {
          path: 'descriptors',
          name: 'descriptors',
          components: {
            Content: descriptors,
          },
        },
        {
          path: 'inventories',
          name: 'inventories',
          components: {
            Content: inventories,
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
