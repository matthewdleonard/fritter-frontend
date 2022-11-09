<!-- Default page that also displays messages -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateLockForm />
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
          to access account locks.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all active locks
          </h2>
        </div>
        <div class="right">
        </div>
      </header>
      <section
        v-if="$store.state.locks.length"
      >
        <LockComponent
          v-for="lock in $store.state.locks"
          :key="lock.id"
          :lock="lock"
        />
      </section>
      <article
        v-else
      >
        <h3>No locks found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import LockComponent from '@/components/Lock/LockComponent.vue';
import CreateLockForm from '@/components/Lock/CreateLockForm.vue';

export default {
  name: 'LockPage',
  components: {LockComponent, CreateLockForm},
  mounted() {
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
