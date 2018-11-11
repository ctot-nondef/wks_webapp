/* eslint-disable arrow-parens */
/* eslint-disable default-case */
/* eslint-disable no-underscore-dangle */
import {
  STORAGE_KEY,
  SESSION_ID,
} from './index';

const triggerMutations = [
  'api/setToken',
  'app/loginMut',
  'app/logoutMut',
  'api/setState',
  'app/setState',
];

// helper function for filtering for properties that need to be persistent.
function filterForPersistantProperties(stateObj) {
  const result = {};
  const modules = Object.keys(stateObj);
  // const values = Object.values(stateObj); // obj: {name: value }
  for (let k = 0; k < modules.length; k += 1) {
    result[modules[k]] = {};
    const m = stateObj[modules[k]];
    const p = m.p || [];
    for (let i = 0; i < p.length; i += 1) {
      result[modules[k]][p[i]] = m[p[i]];
    }
  }
  return result;
}

const localStoragePlugin = store => {
  let localStorage;
  try {
    localStorage = window.localStorage;
    store.subscribe((mutation, state) => {
      if (triggerMutations.indexOf(mutation.type) > -1) {
        const pState = filterForPersistantProperties(state);
        const currentStore = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
        const now = Date.now();
        currentStore[SESSION_ID] = { pState,
          date: now,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStore));
        } catch (e) {
          return e;
        }
        return currentStore;
      }
      return {};
    });
  } catch (e) {
    return e;
  }
  return {};
};

export default [localStoragePlugin];
