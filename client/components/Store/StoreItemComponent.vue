<!-- Reusable component representing a single message and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="message"
  >
    <header>
      <h3 class="author">
        Created by @{{ storeItem.author }}
      </h3>

      <div
        v-if="$store.state.username === storeItem.author"
        class="actions"
      >
        <button @click="editItem">
          ✏️ Edit
        </button>
        <button @click="deleteItem">
          🗑️ Delete
        </button>
      </div>
      <h3 class="recipient">
        {{ storeItem.type }}
      </h3>
    </header>
      <img ref = "storeItemImage"/>
    </p>
  </article>
</template>

<script>
export default {
  name: 'StoreItemComponent',
  props: {
    // Data from the stored message
    storeItem: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      draft: this.storeItem.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
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
        const r = await fetch(`/api/store/${this.storeItem._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshMessages');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    editItem() {
      this.$store.commit('updateEditedStoreItem', this.storeItem._id);
      this.$router.push("/createstoreitem");
    },
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
  },
  mounted() {
    this.$refs.storeItemImage.src = this.storeItem.content;
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
