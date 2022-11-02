<!-- Default page that also displays messages -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateMessageForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to send messages.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all messages
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <getMessagesForm
            ref="getMessagesForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get messages"
          />
        </div>
      </header>
      <section
        v-if="$store.state.messages.length"
      >
        <MessageComponent
          v-for="message in $store.state.messages"
          :key="message.id"
          :message="message"
        />
      </section>
      <article
        v-else
      >
        <h3>No messages found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import MessageComponent from '@/components/Messages/MessageComponent.vue';
import CreateMessageForm from '@/components/Messages/CreateMessageForm.vue';
import getMessagesForm from '@/components/Messages/GetMessagesForm.vue';

export default {
  name: 'MessagesPage',
  components: {MessageComponent, getMessagesForm, CreateMessageForm},
  mounted() {
    this.$refs.getMessagesForm.submit();
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
