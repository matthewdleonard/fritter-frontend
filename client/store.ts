import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    messages: [], // All messages created in the app
    storeItems: [], // All messages created in the app,
    locks: [],
    editedStoreItem: null,//The store item the user is currently editing (null = not editing an item)
    editedLock: null,
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateMessages(state, messages) {
      /**
       * Update the stored messages to the provided messages.
       * @param messages - messages to store
       */
      state.messages = messages;
    },
    updateStoreItems(state, storeItems) {
      /**
       * Update the stored messages to the provided messages.
       * @param messages - messages to store
       */
      state.storeItems = storeItems;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    updateEditedStoreItem(state, storeItem) {
      /**
       * Update the stored messages to the provided messages.
       * @param messages - messages to store
       */
      state.editedStoreItem = storeItem;
    },
    updateEditedLock(state, lock) {
      /**
       * Update the stored messages to the provided messages.
       * @param messages - messages to store
       */
      state.editedLock = lock;
    },
    
    setLocks(state, locks) {
      /**
       * Update the stored locks to the provided lock.
       * @param messages - messages to store
       */
      state.locks = locks;
    },
    async lockPassTime(state, item) {
      /**
       * Update the stored locks to the provided lock.
       * @param messages - messages to store
       */
      let lock = state.locks[item[0]];
      let oldTime = parseInt(lock.browseTimeLeft);
      if (isNaN(oldTime)) {
        oldTime = 3600;
      }
      let newTime = oldTime - item[1];
      if (newTime <= 0) {
        newTime = 0;
      }
      if (newTime.toString() != lock.browseTimeLeft) {
          
      lock.browseTimeLeft = newTime.toString();
        const options = {
          method: 'PUT', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(lock)
        };

        try {
          const r = await fetch(`/api/lock/${lock._id}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }


      }


    },
    async refreshMessages(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/messages` : '/api/messages';
      const res = await fetch(url).then(async r => r.json());
      state.messages = res;
    },
    async refreshStoreItems(state) {
      /**
       * Request the server for the currently available store items.
       */
      const url = state.filter ? `/api/users/${state.filter}/store` : '/api/store';
      const res = await fetch(url).then(async r => r.json());
      state.storeItems = res;
    },
    async refreshLocks(state) {
      /**
       * Request the server for the currently available locks.
       */
      if (!state.username) {
        state.locks = [];
      }

      const url = `/api/lock?author=${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.locks = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
