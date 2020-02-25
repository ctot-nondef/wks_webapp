import Vue from 'vue';
import Router from 'vue-router';
import App from '../components/App';
import Start from '../components/Start';
import single from '../components/single';
import users from '../components/users';
import query from '../components/filtered_list';

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
          path: ':type/:id',
          name: 'single',
          components: {
            Content: single,
          },
        },
        {
          path: 'collections',
          name: 'collections',
          redirect: { name: 'query', params: { lang: 'en', entity: 'collect', query: '{"name":{"$regex":null}}' } },
        },
        {
          path: 'inventories',
          name: 'inventories',
          redirect: { name: 'query', params: { lang: 'en', entity: 'inventory', query: '{"name":{"$regex":null}, "partOf":null}' } },
        },
        {
          path: 'entries',
          name: 'entries',
          redirect: { name: 'query', params: { lang: 'en', entity: 'entry', query: '{"name":{"$regex":null}, "originalTitle":{"$regex":null}}' } },
        },
        {
          path: 'transactions',
          name: 'transactions',
          redirect: { name: 'query', params: { lang: 'en', entity: 'transaction', query: '{"name":{"$regex":null}}' } },
        },
        {
          path: 'objects',
          name: 'objects',
          redirect: { name: 'query', params: { lang: 'en', entity: 'object', query: '{"name":{"$regex":null}, "currentOwner":null}' } },
        },
        {
          path: 'actors',
          name: 'actors',
          redirect: { name: 'query', params: { lang: 'en', entity: 'actor', query: '{ "name": { "$regex": null }, "instanceOf": null, "identifier": { "$regex": null } }' } },
        },
        {
          path: 'descriptors',
          name: 'descriptors',
          redirect: { name: 'query', params: { lang: 'en', entity: 'descriptor', query: '{ "name": { "$regex": null }, "instanceOf": null, "identifier": { "$regex": null } }' } },
        },
        {
          path: 'users',
          name: 'users',
          components: {
            Content: users,
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
