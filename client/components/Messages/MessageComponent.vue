<!-- Reusable component representing a single message and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="message"
  >
    <header>
      <h3 class="author">
        From: @{{ message.author }}
      </h3>
      <h3 class="recipient">
        To: @{{ message.recipient }}
      </h3>
    </header>
      {{ message.content }}
    </p>
    <p class="info">
      Posted at {{ message.dateModified }}
    </p>
  </article>
</template>

<script>
export default {
  name: 'MessageComponent',
  props: {
    // Data from the stored message
    message: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      draft: this.message.content, // Potentially-new content for this freet
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
        const r = await fetch(`/api/messages/${this.message._id}`, options);
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
    }
  }
};
</script>

<style scoped>
.message {
    border: 1px solid #ccc;
    padding: 20px;
    position: relative;
    margin: 4px;
}
</style>

