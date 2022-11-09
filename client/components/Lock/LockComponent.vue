<!-- Reusable component representing a single message and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="lock"
  >
    <header>
        <button @click="editItem">
          ✏️ Edit
        </button>
        <button @click="deleteItem">
          🗑️ Delete
        </button>
      <p class="type">
        Type: {{ lock.type }}
      </p>
      <p class="type">
        Time left before app locks: {{ lock.browseTimeLeft }} seconds
      </p>
      <p class="type">
        Activity practice time required before the app unlocks: {{ lock.activityTimeLeft }} seconds
      </p>
    </header>
    </p>
    <p class="info">
      Created at {{ lock.dateModified }}
    </p>
  </article>
</template>

<script>
export default {
  name: 'LockComponent',
  props: {
    // Data from the stored message
    lock: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    deleteItem() {
      /**
       * Deletes this item.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted store item!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    editItem() {
      this.$store.commit('updateEditedLock', this.lock._id);
      this.$router.push("/decreaselock");
    },
    async request(params) {
      /**
       * Submits a request to the message's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/lock/${this.lock._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshLocks');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
